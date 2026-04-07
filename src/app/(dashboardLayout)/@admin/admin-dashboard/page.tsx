import { getAdminStatisticsAction } from "@/actions/user.action";
import AdminStats from "@/components/admin/stats/AdminStats";

export default async function AdminPage() {
     const res = await getAdminStatisticsAction();

     console.log(res);

     if (!res?.ok) {
          return <p className="p-6 text-red-600">Failed to load statistics</p>;
     }

     return <AdminStats stats={res.data} />;
}