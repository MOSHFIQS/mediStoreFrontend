"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageType } from "@/hooks/useImageUpload";
import ImageView from "./ImageView";

type Props = {
     label: string;
     images: ImageType[];
     onUpload: (file: File) => void;
     onDelete: (img: ImageType) => void;
     multiple?: boolean;
};

export default function ImageUploader({
     label,
     images,
     onUpload,
     onDelete,
     multiple = true,
}: Props) {
     return (
          <div className="space-y-3">
               <Label>{label}</Label>

               <Input
                    type="file"
                    multiple={multiple}
                    accept="image/*"
                    onChange={(e) => {
                         const files = e.target.files;
                         if (!files) return;

                         if (multiple) {
                              Array.from(files).forEach(onUpload);
                         } else {
                              onUpload(files[0]);
                         }
                    }}
               />

               {images.length > 0 && (
                    <div className="flex gap-2">
                         <ImageView imgList={images} onImageDelete={onDelete} />
                    </div>
               )}
          </div>
     );
}