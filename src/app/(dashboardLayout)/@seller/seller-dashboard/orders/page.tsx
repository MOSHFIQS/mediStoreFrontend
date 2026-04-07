import { getSellerOrdersAction } from "@/actions/order.action";
import SellerOrdersTable from "@/components/sellerOrders/SellerOrdersTable";
import { orderServiceServer } from "@/service/order.server.service";

export default async function SellerOrdersPage() {
     const res = await getSellerOrdersAction();
     console.log(res);
     if (!res.ok) return <p className="p-6 text-red-600">Failed to load orders</p>;

     return (
          <div className="p-6">
               <SellerOrdersTable orders={res.data ?? []} />
          </div>
     );
}