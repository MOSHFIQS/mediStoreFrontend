// import { medicineService } from "@/service/medicine.service";
import { sessionService } from "@/service/token.service";
import { medicineServiceServer } from "@/service/medicine.server.service";
import MedicineDetails from "@/components/medicine/MedicineDetails";
import { getMedicineByIdAction } from "@/actions/medicine.action";
import { getAddressesAction } from "@/actions/address.action";



export default async function MedicineDetailsPage({ params }: { params: Promise<{ id: string }> }) {

     const { id } = await params;
     console.log(id);

     const addressesRes = await getAddressesAction();
     
          if (!addressesRes?.ok) {
               return (
                    <p className="p-6 text-red-600">
                         Failed to load addresses
                    </p>
               );
          }

     const res = await getMedicineByIdAction(id);
     console.log(res);
     if (!res.ok) {
          return <p className="p-4">Medicine not found</p>;
     }


     return (
          <MedicineDetails
               medicine={res?.data}
               addresses={addressesRes.data}
          />
     );
}
