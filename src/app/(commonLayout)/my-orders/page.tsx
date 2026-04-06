import MyOrdersClient from "@/components/orders/MyOrdersClient";
import { orderServiceServer } from "@/service/order.server.service";

export default async function MyOrdersPage() {
     const res = await orderServiceServer.getMyOrders();
     if (!res.ok) return <p className="p-4 text-red-500">Failed to load orders</p>;
     return <MyOrdersClient orders={res.data.data} />;
}