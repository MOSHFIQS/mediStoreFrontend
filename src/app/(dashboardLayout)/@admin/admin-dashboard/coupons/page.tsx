import { getAllCouponsAction } from "@/actions/coupon.action";
import AllCoupons from "@/components/admin/coupons/AllCoupons";
import GlobalPagination from "@/components/shared/pagination/GlobalPagination";

export default async function CouponsPage({ searchParams }: { searchParams: Promise<{ page?: number; limit?: number }> }) {
  const { page, limit } = await searchParams
  const res = await getAllCouponsAction(page, limit);
  return (
    <div className="space-y-6 h-full flex flex-col justify-between py-2">
      <AllCoupons coupons={res.data?.data || []} />;
      <GlobalPagination
        page={res.data?.meta?.page}
        totalPages={res?.data?.meta?.totalPages}
        limit={res.data?.meta?.limit}
      />
    </div>
  )
}