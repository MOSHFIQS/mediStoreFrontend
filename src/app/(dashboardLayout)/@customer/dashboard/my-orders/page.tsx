import MyOrdersClient from "@/components/myOrders/MyOrdersClient";
import { orderServiceServer } from "@/service/order.server.service";


export default async function MyOrdersPage() {

     const res = await orderServiceServer.getMyOrders()
     if (!res.ok) return <p className="p-6">Failed to load orders</p>;

     return <MyOrdersClient initialOrders={res?.data?.data} />;
}
