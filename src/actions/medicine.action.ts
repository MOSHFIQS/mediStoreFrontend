"use server"

import { imageHostingService } from "@/service/image-hosting.service"
import { medicineServiceServer } from "@/service/medicine.server.service"
import { revalidatePath } from "next/cache"

export async function createMedicineAction(formData: FormData) {
     const name = formData.get("name") as string
     const description = formData.get("description") as string
     const categoryId = formData.get("categoryId") as string
     const price = Number(formData.get("price"))
     const stock = Number(formData.get("stock"))
     const file = formData.get("photo") as File

     if (!file) throw new Error("Image required")

     // upload image
     const uploadRes = await imageHostingService.uploadImage(file)
     if (!uploadRes.ok || !uploadRes.url) throw new Error("Image upload failed")

     const res = await medicineServiceServer.create({
          name,
          description,
          categoryId,
          price,
          stock,
          image: uploadRes.url,
     })

     if (!res.ok) throw new Error(res.message)
     return true
}

export async function updateMedicineAction(id: string, data: any) {
     const res = await medicineServiceServer.update(id, data)
     if (!res.ok) throw new Error(res.message)

     revalidatePath("/seller-dashboard/medicines")
}


export async function deleteMedicineAction(id: string) {
     const res = await medicineServiceServer.delete(id)
     if (!res.ok) throw new Error(res.message)

     revalidatePath("/seller-dashboard/medicines")
}