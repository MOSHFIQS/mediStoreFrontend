import { getAllPaymentsAction } from "@/actions/payment.action";
import AdminPaymentsClient from "@/components/admin/payments/AdminPaymentsClient";
import GlobalPagination from "@/components/shared/pagination/GlobalPagination";

export default async function AdminPaymentsPage({ searchParams }: { searchParams: Promise<{ page?: number; limit?: number }> }) {
     const { page, limit } = await searchParams
     const res = await getAllPaymentsAction(page, limit);
     if (!res.ok) {
          return <div>Something went wrong</div>;
     }
     return (
          <div className="space-y-6 h-full flex flex-col justify-between py-2">
               <AdminPaymentsClient payments={res.data?.data || []} />
               <GlobalPagination
                    page={res.data?.meta?.page}
                    limit={res.data?.meta?.limit}
                    totalPages={res.data?.meta?.totalPages}
               />
          </div>
     );
}