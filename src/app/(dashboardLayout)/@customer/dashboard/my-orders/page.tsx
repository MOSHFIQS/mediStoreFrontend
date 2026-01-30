"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService } from "@/service/order.service";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OrderItem {
     id: string;
     quantity: number;
     price: number;
     medicine: { name: string };
}

interface Order {
     id: string;
     address: string;
     totalPrice: number;
     status: string;
     createdAt: string;
     items: OrderItem[];
}

export default function MyOrdersPage() {
     const queryClient = useQueryClient();

     const { data: orders = [], isLoading } = useQuery<Order[]>({
          queryKey: ["my-orders"],
          queryFn: async () => {
               const res = await orderService.getMyOrders();
               if (!res.ok) throw new Error(res.message);
               return res.data.data;
          },
     });

     const { mutate: cancelOrder, isPending } = useMutation({
          mutationFn: async (orderId: string) => {
               const res = await orderService.cancel(orderId);
               if (!res.ok) throw new Error(res.message);
               return res;
          },
          onSuccess: () => {
               toast.success("Order cancelled");
               queryClient.invalidateQueries({ queryKey: ["my-orders"] as const });
          },
          onError: (err: any) => toast.error(err.message || "Cancel failed"),
     });


     if (isLoading) return <p className="p-6">Loading orders...</p>;
     if (!orders.length) return <p className="p-6">No orders found.</p>;

     const statusClasses: Record<string, string> = {
          CANCELLED: "bg-red-100 text-red-600",
          DELIVERED: "bg-green-100 text-green-600",
          default: "bg-yellow-100 text-yellow-700",
     };

     return (
          <div className="p-6 space-y-4">
               <h1 className="text-2xl font-bold">My Orders</h1>

               {orders.map((order: Order) => (
                    <Card key={order.id} className="border">
                         <CardHeader className="flex justify-between items-start">
                              <CardTitle className="text-sm font-medium">Order ID: {order.id}</CardTitle>
                              <span
                                   className={`px-2 py-1 rounded text-xs font-medium ${statusClasses[order.status] || statusClasses.default
                                        }`}
                              >
                                   {order.status}
                              </span>
                         </CardHeader>

                         <CardContent className="space-y-2">
                              <div>
                                   <strong>Address:</strong> {order.address}
                              </div>
                              <div>
                                   <strong>Total Price:</strong> {order.totalPrice} tk
                              </div>
                              <div>
                                   <strong>Ordered Items:</strong>
                                   <ul className="list-disc list-inside mt-1">
                                        {order.items.map((item: OrderItem) => (
                                             <li key={item.id}>
                                                  {item.medicine.name} × {item.quantity} ({item.price * item.quantity} tk)
                                             </li>
                                        ))}
                                   </ul>
                              </div>
                              <div>
                                   <strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}
                              </div>
                         </CardContent>

                         {(order.status === "PLACED" || order.status === "PROCESSING") && (
                              <CardFooter>
                                   <Button
                                        variant="destructive"
                                        size="sm"
                                        disabled={isPending}
                                        onClick={() => cancelOrder(order.id)}
                                   >
                                        Cancel Order
                                   </Button>
                              </CardFooter>
                         )}
                    </Card>
               ))}
          </div>
     );
}
