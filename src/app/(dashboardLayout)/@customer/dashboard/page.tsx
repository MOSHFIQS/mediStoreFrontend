import { getCustomerStatisticsAction } from "@/actions/user.action";
import CustomerStats from "@/components/customer/stats/CustomerStats";

export default async function CustomerPage() {
  const res = await getCustomerStatisticsAction();

  if (!res?.ok) {
    return <p className="p-6 text-red-600">Failed to load statistics</p>;
  }

  return <CustomerStats stats={res.data} />;
}