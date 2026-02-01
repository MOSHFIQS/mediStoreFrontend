"use server"

import { imageHostingService } from "@/service/image-hosting.service"
import { medicineServiceServer } from "@/service/medicine.server.service"

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
