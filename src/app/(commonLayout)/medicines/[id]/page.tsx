// import { medicineService } from "@/service/medicine.service";
import { sessionService } from "@/service/token.service";
import { medicineServiceServer } from "@/service/medicine.server.service";
import MedicineDetails from "@/components/medicine/MedicineDetails";



export default async function MedicineDetailsPage({ params }: { params: Promise<{ id: string }> }) {

     const { id } = await params;
     console.log(id);

     const res = await medicineServiceServer.getById(id);
     if (!res.ok) {
          return <p className="p-4">Medicine not found</p>;
     }

     const user = await sessionService.getUserFromToken();

     return (
          <MedicineDetails
               medicine={res?.data?.data}
          />
     );
}
