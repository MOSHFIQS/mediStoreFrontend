import { apiFetchServerMain } from "@/lib/apiFetchServer";

export const fileService = {
     // upload single or multiple images
     uploadImages: (formData: FormData) =>
          apiFetchServerMain("/file/upload-image", {
               method: "POST",
               body: formData,
          }),

     // delete single or multiple images
     deleteImages: (payload: { url: string | string[] }) =>
          apiFetchServerMain("/file/delete-image", {
               method: "DELETE",
               body: JSON.stringify(payload),
          }),
};