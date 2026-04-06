"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cancelOrderAction, initiatePaymentForOrderAction } from "@/actions/order.action";
import { useRouter } from "next/navigation";

const statusColors: Record<string, string> = {
     PLACED: "bg-blue-100 text-blue-700",
     CONFIRMED: "bg-cyan-100 text-cyan-700",
     PROCESSING: "bg-yellow-100 text-yellow-700",
     SHIPPED: "bg-purple-100 text-purple-700",
     DELIVERED: "bg-green-100 text-green-700",
     CANCELLED: "bg-red-100 text-red-700",
};

export default function MyOrdersClient({ orders }: { orders: any[] }) {
     console.log(orders);
     const router = useRouter();
     const [loadingId, setLoadingId] = useState<string | null>(null);

     const handlePay = async (orderId: string) => {
          setLoadingId(orderId);
          try {
               const payment = await initiatePaymentForOrderAction(orderId);
               window.location.href = payment.gatewayUrl;
          } catch (err: any) {
               toast.error(err.message || "Payment initiation failed");
               setLoadingId(null);
          }
     };

     const handleCancel = async (orderId: string) => {
          setLoadingId(orderId);
          try {
               const res =  await cancelOrderAction(orderId);
               console.log(res);
               toast.success("Order cancelled");
               router.refresh();
          } catch (err: any) {
               toast.error(err.message);
          } finally {
               setLoadingId(null);
          }
     };

     if (!orders.length) {
          return <p className="p-6 text-center text-muted-foreground">No orders yet.</p>;
     }

     return (
          <div className="max-w-3xl mx-auto p-4 space-y-4">
               <h1 className="text-2xl font-bold">My Orders</h1>
               {orders.map((order) => (
                    <Card key={order.id}>
                         <CardHeader className="flex flex-row items-center justify-between">
                              <CardTitle className="text-sm font-mono text-muted-foreground">
                                   #{order.id.slice(0, 8).toUpperCase()}
                              </CardTitle>
                              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[order.status] || "bg-gray-100"}`}>
                                   {order.status}
                              </span>
                         </CardHeader>
                         <CardContent className="space-y-3">
                              {/* Items */}
                              <div className="space-y-1">
                                   {order.items.map((item: any) => (
                                        <div key={item.id} className="flex justify-between text-sm">
                                             <span>{item.medicineName} × {item.quantity}</span>
                                             <span>৳{item.totalPrice.toFixed(2)}</span>
                                        </div>
                                   ))}
                              </div>

                              <div className="border-t pt-2 flex justify-between font-semibold">
                                   <span>Total</span>
                                   <span>৳{order.totalPrice.toFixed(2)}</span>
                              </div>

                              {/* Payment status */}
                              {order.payment && (
                                   <p className="text-xs text-muted-foreground">
                                        Payment: <span className="font-medium">{order.payment.status}</span>
                                        {order.payment.paidAt && ` · ${new Date(order.payment.paidAt).toLocaleDateString()}`}
                                   </p>
                              )}

                              {/* Actions */}
                              <div className="flex gap-2 pt-1">
                                   {/* Show Pay Now if payment pending */}
                                   {order.payment?.status === "PENDING" && order.status !== "CANCELLED" && (
                                        <Button
                                             size="sm"
                                             onClick={() => handlePay(order.id)}
                                             disabled={loadingId === order.id}
                                             className="bg-green-600 hover:bg-green-700 text-white"
                                        >
                                             {loadingId === order.id ? "Redirecting..." : "Pay Now"}
                                        </Button>
                                   )}
                                   {/* Cancel if cancellable */}
                                   {order.status === "PLACED" && order.payment?.status !== "SUCCESS" && (
                                        <Button
                                             size="sm"
                                             variant="destructive"
                                             onClick={() => handleCancel(order.id)}
                                             disabled={loadingId === order.id}
                                        >
                                             Cancel
                                        </Button>
                                   )}
                              </div>
                         </CardContent>
                    </Card>
               ))}
          </div>
     );
}