import { getAllCategoriesAction } from "@/actions/category.action"
import CreateMedicineClient from "@/components/createMedicine/CreateMedicineClient"

export default async function Page() {
     const res = await getAllCategoriesAction()
     const categories = res.ok ? res?.data : []

     return <CreateMedicineClient categories={categories} />
}
