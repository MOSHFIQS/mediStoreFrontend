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

  

     const upload = async (file: File) => {

          const MAX_SIZE = 4.5 * 1024 * 1024; // 4.5 MB in bytes

          // 🔴 Size validation
          if (file.size > MAX_SIZE) {
               toast.error("Image size must be less than 4.5 MB");
               return;
          }

          if (images.length >= max) {
               toast.error(`Maximum ${max} images allowed`);
               return;
          }

          const tempId = crypto.randomUUID();

          const tempImage: ImageType = {
               id: tempId,
               name: `Image`,
               img: URL.createObjectURL(file),
               imageUploading: true,
          };

          setImages((prev) => [...prev, tempImage]);

          try {
               const formData = new FormData();
               formData.append("file", file);

               const res = await uploadImagesAction(formData);
               console.log(res);
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

     const remove = async (img: ImageType) => {
          try {
               setImages((prev) =>
                    prev.map((i) =>
                         i.id === img.id ? { ...i, imageUploading: true } : i
                    )
               );
               console.log(img.img);

               const res = await deleteImagesAction({ url: img.img });


               console.log(res);

               setImages((prev) => prev.filter((i) => i.id !== img.id));
          } catch (err: any) {
               toast.error(err?.message);

               setImages((prev) =>
                    prev.map((i) =>
                         i.id === img.id ? { ...i, imageUploading: false } : i
                    )
               );
          }
     };

     return {
          images,
          setImages,
          upload,
          remove,
     };
};