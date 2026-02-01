
import UpdateMedicineClient from "@/components/updateMedicine/UpdateMedicineClient"
import { medicineServiceServer } from "@/service/medicine.server.service"
import { categoryServiceServer } from "@/service/category.server.service"

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
     const {id} = await params
     const medRes = await medicineServiceServer.getById(id)
     const catRes = await categoryServiceServer.getAll()

     const medicine = medRes.ok ? medRes.data.data : null
     const categories = catRes.ok ? catRes.data.data : []

     if (!medicine) return <p className="p-6">Medicine not found</p>

     return (
          <UpdateMedicineClient
               medicine={medicine}
               categories={categories}
          />
     )
}
