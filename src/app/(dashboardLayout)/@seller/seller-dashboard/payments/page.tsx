import { getSellerPaymentsAction } from "@/actions/payment.action";
import SellerPaymentsClient from "@/components/seller/payments/SellerPaymentsClient";
import GlobalPagination from "@/components/shared/pagination/GlobalPagination";

export default async function SellerPaymentsPage({ searchParams }: { searchParams: Promise<{ page?: number; limit?: number }> }) {
  const { page, limit } = await searchParams
  const res = await getSellerPaymentsAction(page, limit);
  console.log(res);
  if (!res.ok) return <p className="p-4 text-red-500">Failed to load payments</p>;
  return (
    <div className="space-y-6 h-full flex flex-col justify-between py-2">
      <SellerPaymentsClient payments={res.data?.data || []} />
      <GlobalPagination
        page={res.data?.meta?.page}
        totalPages={res?.data?.meta?.totalPages}
        limit={res.data?.meta?.limit}
      />
    </div>
  )

} 