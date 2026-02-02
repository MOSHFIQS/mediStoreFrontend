"use client";

import { useTransition } from "react";
import { cancelOrderAction } from "@/actions/order.action";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EmptyPage from "../emptyPage/EmptyPage";

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

export default function MyOrdersClient({ initialOrders }: { initialOrders: Order[] }) {
     const router = useRouter();
     const [isPending, startTransition] = useTransition();

     const handleCancel = (orderId: string) => {
          startTransition(async () => {
               try {
                    await cancelOrderAction(orderId);
                    toast.success("Order cancelled");
                    router.refresh(); 
               } catch (err: any) {
                    toast.error(err.message);
               }
          });
     };

     if (!initialOrders.length) return <EmptyPage />

     const statusClasses: Record<string, string> = {
          CANCELLED: "bg-red-100 text-red-600",
          DELIVERED: "bg-green-100 text-green-600",
          default: "bg-yellow-100 text-yellow-700",
     };

     return (
          <div className="p-6 space-y-4">
               <h1 className="text-2xl font-bold">My Orders</h1>

               {initialOrders.map((order) => (
                    <Card key={order.id} className="border">
                         <CardHeader className="flex justify-between items-start">
                              <CardTitle className="text-sm font-medium">Order ID: {order.id}</CardTitle>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${statusClasses[order.status] || statusClasses.default}`}>
                                   {order.status}
                              </span>
                         </CardHeader>

                         <CardContent className="space-y-2">
                              <div><strong>Address:</strong> {order.address}</div>
                              <div><strong>Total Price:</strong> {order.totalPrice} tk</div>

                              <div>
                                   <strong>Ordered Items:</strong>
                                   <ul className="list-disc list-inside mt-1">
                                        {order.items.map((item) => (
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
                                        onClick={() => handleCancel(order.id)}
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
