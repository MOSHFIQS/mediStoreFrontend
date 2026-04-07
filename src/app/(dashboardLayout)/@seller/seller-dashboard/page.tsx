import { getSellerStatisticsAction } from "@/actions/user.action";
import SellerStats from "@/components/seller/stats/SellerStats";

export default async function AdminPage() {
  const res = await getSellerStatisticsAction();

  if (!res?.ok) {
    return <p className="p-6 text-red-600">Failed to load statistics</p>;
  }

  return <SellerStats stats={res.data} />;
}