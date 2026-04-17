import { getAllCategoriesAction } from "@/actions/category.action"
import CreateMedicineClient from "@/components/createMedicine/CreateMedicineClient"

export default async function Page() {
     const res = await getAllCategoriesAction(1, 1000 )
     const categories = res.ok ? res?.data?.data : []

     return <CreateMedicineClient categories={categories} />
}