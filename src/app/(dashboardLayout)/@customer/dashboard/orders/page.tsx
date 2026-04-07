import { getMyOrdersAction } from "@/actions/order.action";
import MyOrders from "@/components/orders/MyOrders";


export default async function MyOrdersPage() {

     const res = await getMyOrdersAction();
     if (!res.ok) return <p className="p-4 text-red-500">Failed to load orders</p>;

     console.log(res);
     return <MyOrders orders={res.data} />;
}
