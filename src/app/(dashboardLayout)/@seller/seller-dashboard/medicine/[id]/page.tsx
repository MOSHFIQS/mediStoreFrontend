import { medicineServiceServer } from "@/service/medicine.server.service";
import { getMedicineByIdAction } from "@/actions/medicine.action";
import { getAddressesAction } from "@/actions/address.action";
import MedicineDetails from "@/components/seller/medicine/MedicineDetails";

export default async function SellerMedicineDetailsPage({ params }: { params: Promise<{ id: string }> }) {

     const { id } = await params;

     const res = await getMedicineByIdAction(id)
     


     if (!res.ok) {
          return <p className="p-4">Medicine not found</p>;
     }

     return (
          <MedicineDetails
               medicine={res?.data}
          />
     );
}