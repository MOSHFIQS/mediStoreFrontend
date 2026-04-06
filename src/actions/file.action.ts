"use server";

import { fileService } from "@/service/file.server.service";


export async function uploadImagesAction(formData: FormData) {
     try {
          const res = await fileService.uploadImages(formData);
          // console.log(res);

          if (!res?.ok) {
               return {
                    ok: false,
                    message: res?.message || "Image upload failed",
               };
          }

          return {
               ok: true,
               message: res?.message || "Images uploaded successfully",
               data: res.data,
          };
     } catch (error) {
          return {
               ok: false,
               message: "Something went wrong",
          };
     }
}

export async function deleteImagesAction(payload: {
     url: string | string[];
}) {
     try {
          const res = await fileService.deleteImages(payload);
          // console.log(res);

          if (!res?.ok) {
               return {
                    ok: false,
                    message: res?.message || "Image delete failed",
               };
          }

          return {
               ok: true,
               message: res?.message || "Images deleted successfully",
               data: res.data,
          };
     } catch (error) {
          return {
               ok: false,
               message: "Something went wrong",
          };
     }
}