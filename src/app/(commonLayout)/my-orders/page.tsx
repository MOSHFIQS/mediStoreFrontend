import { getMyOrdersAction } from "@/actions/order.action";
import MyOrdersClient from "@/components/orders/MyOrdersClient";
import { orderServiceServer } from "@/service/order.server.service";

export default async function MyOrdersPage() {
     const res = await getMyOrdersAction();
     if (!res.ok) return <p className="p-4 text-red-500">Failed to load orders</p>;
     return <MyOrdersClient orders={res.data} />;
}