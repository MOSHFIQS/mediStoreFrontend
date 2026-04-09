import { getSellerOrdersAction } from "@/actions/order.action";
import SellerOrdersTable from "@/components/sellerOrders/SellerOrdersTable";
import GlobalPagination from "@/components/shared/pagination/GlobalPagination";

export default async function SellerOrdersPage({ searchParams }: { searchParams: Promise<{ page?: number; limit?: number }> }) {
     const { page, limit } = await searchParams
     const res = await getSellerOrdersAction(page, limit);
     console.log(res);
     if (!res.ok) return <p className="p-6 text-red-600">Failed to load orders</p>;

     return (
          <div className="space-y-6 h-full flex flex-col justify-between ">
               <SellerOrdersTable orders={res.data?.data ?? []} />
               <GlobalPagination
                    page={res.data?.meta?.page}
                    totalPages={res?.data?.meta?.totalPages}
                    limit={res.data?.meta?.limit}
               />
          </div>
     );
}