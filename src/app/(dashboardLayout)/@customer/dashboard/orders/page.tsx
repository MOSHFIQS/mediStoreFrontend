import { getMyOrdersAction } from "@/actions/order.action";
import MyOrders from "@/components/orders/MyOrders";
import GlobalPagination from "@/components/shared/pagination/GlobalPagination";


export default async function MyOrdersPage({ searchParams }: { searchParams: Promise<{ page?: number; limit?: number }> }) {
     const { page, limit } = await searchParams
     const res = await getMyOrdersAction(page, limit);
     if (!res.ok) return <p className="p-4 text-red-500">Failed to load orders</p>;

     console.log(res);
     return (
          <div className="space-y-6 h-full flex flex-col justify-between py-2">
               <MyOrders orders={res.data?.data || []} />
               <GlobalPagination
                    page={res.data?.meta?.page}
                    limit={res.data?.meta?.limit}
                    totalPages={res.data?.meta?.totalPages}
               />
          </div>
     );
}
