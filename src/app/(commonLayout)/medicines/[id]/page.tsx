// import { medicineService } from "@/service/medicine.service";
import { sessionService } from "@/service/token.service";
import MedicineDetailsClient from "./MedicineDetailsClient";
import { medicineServiceServer } from "@/service/medicine.server.service";



export default async function MedicineDetailsPage({ params }: { params: Promise<{ id: string }> }) {
     // const medicineId = await params.id;
     const { id } = await params;
     console.log(id);

     // ✅ Fetch medicine on server
     const res = await medicineServiceServer.getById(id);
     if (!res.ok) {
          return <p className="p-4">Medicine not found</p>;
     }

     // ✅ Get logged-in user from cookie (SERVER ONLY)
     const user = await sessionService.getUserFromToken();

     return (
          <MedicineDetailsClient
               medicine={res?.data?.data}
          />
     );
}
