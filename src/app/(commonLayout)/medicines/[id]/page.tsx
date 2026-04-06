import { medicineServiceServer } from "@/service/medicine.server.service";
import MedicineDetails from "@/components/medicine/MedicineDetails";
import { getMedicineByIdAction } from "@/actions/medicine.action";
import { getAddressesAction } from "@/actions/address.action";
import { getMyPrescriptionsAction } from "@/actions/prescription.action";

export default async function MedicineDetailsPage({ params }: { params: Promise<{ id: string }> }) {

     const { id } = await params;

     const [addressesRes, res, prescriptionsRes] = await Promise.all([
          getAddressesAction(),
          getMedicineByIdAction(id),
          getMyPrescriptionsAction(),
     ]);

     if (!addressesRes?.ok) {
          return <p className="p-6 text-red-600">Failed to load addresses</p>;
     }

     if (!res.ok) {
          return <p className="p-4">Medicine not found</p>;
     }

     return (
          <MedicineDetails
               medicine={res?.data}
               addresses={addressesRes.data}
               prescriptions={prescriptionsRes.data ?? []}
          />
     );
}