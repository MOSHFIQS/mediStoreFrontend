"use client";

import { deleteImagesAction, uploadImagesAction } from "@/actions/file.action";
import { useState } from "react";
import { toast } from "sonner";

export type ImageType = {
     id: string;
     name: string;
     img: string;
     imageUploading?: boolean;
};

type Options = {
     max?: number;
     defaultImages?: string[];
};

export const useImageUpload = ({ max = 5, defaultImages = [] }: Options = {}) => {
     const [images, setImages] = useState<ImageType[]>(
          defaultImages.map((img, index) => ({
               id: crypto.randomUUID(),
               name: `Image-${index}`,
               img,
               imageUploading: false,
          }))
     );

     // Track URLs that should be deleted only when form is submitted
     const [pendingDeletes, setPendingDeletes] = useState<string[]>([]);

     const upload = async (file: File) => {
          const MAX_SIZE = 4.5 * 1024 * 1024;
          if (file.size > MAX_SIZE) { toast.error("Image size must be less than 4.5 MB"); return; }
          if (images.length >= max) { toast.error(`Maximum ${max} images allowed`); return; }

          const tempId = crypto.randomUUID();
          setImages((prev) => [...prev, {
               id: tempId,
               name: "Image",
               img: URL.createObjectURL(file),
               imageUploading: true,
          }]);

          try {
               const formData = new FormData();
               formData.append("file", file);
               const res = await uploadImagesAction(formData);
               if (!res?.ok) throw new Error(res?.message);
               setImages((prev) =>
                    prev.map((img) =>
                         img.id === tempId
                              ? { ...img, img: res.data?.url, imageUploading: false }
                              : img
                    )
               );
          } catch (err: any) {
               toast.error(err?.message);
               setImages((prev) => prev.filter((img) => img.id !== tempId));
          }
     };

     // Just remove from UI + queue for deletion — don't hit Cloudinary yet
     const remove = (img: ImageType) => {
          setImages((prev) => prev.filter((i) => i.id !== img.id));
          // Only queue real URLs (not blob: previews of failed/cancelled uploads)
          if (img.img && !img.img.startsWith("blob:")) {
               setPendingDeletes((prev) => [...prev, img.img]);
          }
     };

     // Call this on successful form submit — cleans up Cloudinary
     const commitDeletes = async () => {
          if (pendingDeletes.length === 0) return;
          await Promise.allSettled(
               pendingDeletes.map((url) => deleteImagesAction({ url }))
          );
          setPendingDeletes([]);
     };

     // Call this on form cancel/discard — restores nothing, just clears queue
     const discardDeletes = () => {
          setPendingDeletes([]);
     };

     // Call on create-form cancel — deletes all uploaded images since none were saved to DB
     const cleanup = async () => {
          const realImages = images.filter((img) => !img.img.startsWith("blob:"));
          if (realImages.length === 0) return;
          await Promise.allSettled(
               realImages.map((img) => deleteImagesAction({ url: img.img }))
          );
          setImages([]);
          setPendingDeletes([]);
     };

     return {
          images,
          setImages,
          upload,
          remove,
          commitDeletes,
          discardDeletes,
          cleanup,
          hasPendingDeletes: pendingDeletes.length > 0,
     };
};