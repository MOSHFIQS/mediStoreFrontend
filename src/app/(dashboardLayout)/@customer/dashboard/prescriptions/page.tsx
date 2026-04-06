import PrescriptionsClient from "@/components/prescriptions/PrescriptionsClient";
import { prescriptionServiceServer } from "@/service/prescription.server.service";

export default async function PrescriptionsPage() {
     const res = await prescriptionServiceServer.getMy();
     return <PrescriptionsClient prescriptions={res.ok ? res.data.data : []} />;
}