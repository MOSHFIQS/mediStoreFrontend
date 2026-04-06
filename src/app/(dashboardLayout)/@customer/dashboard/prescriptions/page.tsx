import { getMyPrescriptionsAction } from "@/actions/prescription.action";
import PrescriptionsClient from "@/components/prescriptions/PrescriptionsClient";
import { prescriptionServiceServer } from "@/service/prescription.server.service";

export default async function PrescriptionsPage() {
     const res = await getMyPrescriptionsAction();
     if (!res.ok) {
          return (
               <p className="p-6 text-red-600">
                    Failed to load your prescriptions
               </p>
          );
     }
     return <PrescriptionsClient prescriptions={res.data} />;
}