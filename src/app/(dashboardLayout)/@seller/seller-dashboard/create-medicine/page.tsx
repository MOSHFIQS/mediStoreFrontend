import CreateMedicineClient from "@/components/createMedicine/CreateMedicineClient"
import { categoryServiceServer } from "@/service/category.server.service"

export default async function Page() {
     const res = await categoryServiceServer.getAll()
     const categories = res.ok ? res?.data?.data : []

     return <CreateMedicineClient categories={categories} />
}
