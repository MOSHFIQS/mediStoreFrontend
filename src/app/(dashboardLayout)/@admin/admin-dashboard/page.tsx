import AdminStats from "@/components/adminStats/AdminStats";
import { adminServiceServer } from "@/service/admin.server.service";


export default async function AdminPage() {
     const res = await adminServiceServer.getStatistics();
     console.log(res.data.data);

     if (!res.ok) {
          return <p className="p-6 text-red-600">Failed to load statistics</p>;
     }

     return <AdminStats stats={res.data.data} />;
}
