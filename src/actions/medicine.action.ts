"use server"

import { imageHostingService } from "@/service/image-hosting.service"
import { medicineServiceServer } from "@/service/medicine.server.service"
import { revalidatePath } from "next/cache"

// services/medicineServiceServer.ts
export async function createMedicineAction(data: {
     name: string
     genericName?: string
     brand?: string
     manufacturer?: string
     sku?: string
     description: string
     categoryId: string
     dosageForm?: string
     strength?: string
     unit?: string
     price: number
     discountPrice?: number
     stock: number
     requiresPrescription: boolean
     image: string
}) {
     if (!data.image) throw new Error("Image is required")
     if (!data.name) throw new Error("Name is required")
     if (!data.description) throw new Error("Description is required")
     if (!data.categoryId) throw new Error("Category is required")
     if (!data.price) throw new Error("Price is required")
     if (!data.stock && data.stock !== 0) throw new Error("Stock is required")

     const res = await medicineServiceServer.create({
          name: data.name,
          genericName: data.genericName,
          brand: data.brand,
          manufacturer: data.manufacturer,
          sku: data.sku,
          description: data.description,
          categoryId: data.categoryId,
          dosageForm: data.dosageForm,
          strength: data.strength,
          unit: data.unit || "piece",
          price: data.price,
          discountPrice: data.discountPrice,
          stock: data.stock,
          requiresPrescription: data.requiresPrescription,
          image: data.image,
     })

     if (!res.ok) throw new Error(res.message || "Failed to create medicine")
          

     revalidatePath("/seller-dashboard/medicines")
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