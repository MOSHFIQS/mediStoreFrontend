"use server";

import { userServiceServer } from "@/service/user.server.service";
import { imageHostingService } from "@/service/image-hosting.service";
import { revalidatePath } from "next/cache";


export async function updateProfileAction(formData: FormData) {
     try {
          const name = formData.get("name") as string;
          const phone = formData.get("phone") as string;
          const file = formData.get("image") as File | null;

          let imageUrl: string | undefined = undefined;

          if (file && file.size > 0) {
               const uploadRes = await imageHostingService.uploadImage(file);

               if (!uploadRes.ok || !uploadRes.url) {
                    return { ok: false, message: "Image upload failed" };
               }

               imageUrl = uploadRes.url;
          }

          const res = await userServiceServer.updateMe({
               name,
               phone,
               ...(imageUrl && { image: imageUrl }),
          });

          if (!res.ok) {
               return { ok: false, message: res.message || "Profile update failed" };
          }

          revalidatePath("/dashboard/profile");
          revalidatePath("/seller-dashboard/profile");
          revalidatePath("/admin-dashboard/profile");
          revalidatePath("/");

          return { ok: true, message: "Profile updated successfully" };
     } catch (err) {
          return { ok: false, message: "Something went wrong" };
     }
}
