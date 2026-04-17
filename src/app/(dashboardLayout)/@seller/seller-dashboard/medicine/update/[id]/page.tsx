
import UpdateMedicineClient from "@/components/updateMedicine/UpdateMedicineClient"
import { getMedicineByIdAction } from "@/actions/medicine.action";
import { getAllCategoriesAction } from "@/actions/category.action";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
     const { id } = await params
     const [medRes, catRes] = await Promise.all([
          getMedicineByIdAction(id),
          getAllCategoriesAction(1, 1000),
     ]);
     console.log(medRes);
     console.log(catRes);

     const medicine = medRes.ok ? medRes.data: null
     const categories = catRes.ok ? catRes.data.data : []

     if (!medicine) return <p className="p-6">Medicine not found</p>

     return (
          <UpdateMedicineClient
               medicine={medicine}
               categories={categories}
          />
     )
}
