import { getMyPaymentsAction } from "@/actions/payment.action";
import MyPaymentsClient from "@/components/customer/payments/MyPaymentsClient";
import GlobalPagination from "@/components/shared/pagination/GlobalPagination";

export default async function MyPaymentsPage({ searchParams }: { searchParams: Promise<{ page?: number; limit?: number }> }) {
     const { page, limit } = await searchParams
     const res = await getMyPaymentsAction(page, limit);
     return (
          <div className="space-y-6 h-full flex flex-col justify-between py-2">
               <MyPaymentsClient payments={res.ok ? res.data?.data : []} />
               <GlobalPagination
                    page={res.data?.meta?.page}
                    limit={res.data?.meta?.limit}
                    totalPages={res.data?.meta?.totalPages}
               />
          </div>
     );
}