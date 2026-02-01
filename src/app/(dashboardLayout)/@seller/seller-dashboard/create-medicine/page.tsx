import CreateMedicineClient from "@/components/createMedicine/CreateMedicineClient"
import { categoryService } from "@/service/category.service"

export default async function Page() {
     const res = await categoryService.getAll()
     const categories = res.ok ? res.data.data : []

     return <CreateMedicineClient categories={categories} />
}
