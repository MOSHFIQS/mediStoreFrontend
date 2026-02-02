import SellerOrdersTable from "@/components/sellerOrders/SellerOrdersTable";
import { orderServiceServer } from "@/service/order.server.service";


export default async function MyOrdersPage() {
     const res = await orderServiceServer.getSellerOrders();

     if (!res.ok) {
          return <p className="p-6 text-red-600">Failed to load orders</p>;
     }

     const orders = res?.data?.data;

     if (!orders.length) {
          return <p className="p-6">No orders found</p>;
     }

     return (
          <div className="p-6">
               <SellerOrdersTable orders={orders} />
          </div>
     );
}
