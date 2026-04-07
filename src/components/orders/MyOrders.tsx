"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
     Table, TableBody, TableCell,
     TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
     AlertDialog, AlertDialogContent, AlertDialogDescription,
     AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
     AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
     ShoppingBag, CreditCard, XCircle,
     Clock, CheckCircle2, Truck, PackageCheck,
     PackageX, Loader2, BadgeCheck, Hourglass
} from "lucide-react";
import { cancelOrderAction, initiatePaymentForOrderAction } from "@/actions/order.action";
import { cn } from "@/lib/utils";

// ── Status config ──────────────────────────────────────────
const STATUS_CONFIG: Record<string, {
     label: string;
     icon: React.ReactNode;
     className: string;
}> = {
     PLACED: {
          label: "Placed",
          icon: <Hourglass className="w-3 h-3" />,
          className: "bg-blue-50 text-blue-600 border border-blue-200",
     },
     CONFIRMED: {
          label: "Confirmed",
          icon: <BadgeCheck className="w-3 h-3" />,
          className: "bg-cyan-50 text-cyan-700 border border-cyan-200",
     },
     PROCESSING: {
          label: "Processing",
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
          className: "bg-yellow-50 text-yellow-700 border border-yellow-200",
     },
     SHIPPED: {
          label: "Shipped",
          icon: <Truck className="w-3 h-3" />,
          className: "bg-purple-50 text-purple-700 border border-purple-200",
     },
     DELIVERED: {
          label: "Delivered",
          icon: <PackageCheck className="w-3 h-3" />,
          className: "bg-green-50 text-green-700 border border-green-200",
     },
     CANCELLED: {
          label: "Cancelled",
          icon: <PackageX className="w-3 h-3" />,
          className: "bg-red-50 text-red-600 border border-red-200",
     },
};

// ── Payment config ─────────────────────────────────────────
const PAYMENT_CONFIG: Record<string, {
     icon: React.ReactNode;
     className: string;
}> = {
     SUCCESS: { icon: <CheckCircle2 className="w-3 h-3" />, className: "bg-green-50 text-green-700 border border-green-200" },
     PENDING: { icon: <Clock className="w-3 h-3" />, className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
     FAILED: { icon: <XCircle className="w-3 h-3" />, className: "bg-red-50 text-red-600 border border-red-200" },
     CANCELLED: { icon: <XCircle className="w-3 h-3" />, className: "bg-gray-50 text-gray-500 border border-gray-200" },
     INITIATED: { icon: <Loader2 className="w-3 h-3" />, className: "bg-blue-50 text-blue-600 border border-blue-200" },
};

function StatusBadge({ status }: { status: string }) {
     const cfg = STATUS_CONFIG[status];
     if (!cfg) return <span className="text-xs text-muted-foreground">{status}</span>;
     return (
          <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full", cfg.className)}>
               {cfg.icon} {cfg.label}
          </span>
     );
}

function PaymentBadge({ status }: { status: string }) {
     const cfg = PAYMENT_CONFIG[status] ?? PAYMENT_CONFIG["PENDING"];
     return (
          <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full", cfg.className)}>
               {cfg.icon} {status}
          </span>
     );
}

export default function MyOrders({ orders }: { orders: any[] }) {
     const router = useRouter();
     const [loadingId, setLoadingId] = useState<string | null>(null);
     const [openDialogId, setOpenDialogId] = useState<string | null>(null);

     const handlePay = async (orderId: string) => {
          setLoadingId(orderId);
          try {
               const payment = await initiatePaymentForOrderAction(orderId);
               if (!payment.ok) throw new Error(payment.message);
               window.location.href = payment.data.gatewayUrl;
          } catch (err: any) {
               toast.error(err.message || "Payment initiation failed");
               setLoadingId(null);
          }
     };

     const handleCancel = async (orderId: string) => {
          setLoadingId(orderId);
          try {
               const res = await cancelOrderAction(orderId);
               if (!res.ok) throw new Error(res.message);
               toast.success("Order cancelled successfully");
               setOpenDialogId(null);
               router.refresh();
          } catch (err: any) {
               toast.error(err.message || "Failed to cancel order");
          } finally {
               setLoadingId(null);
          }
     };

     return (
          <div className="px-4 py-6 space-y-6">

               {/* ── Header ── */}
               <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                         <ShoppingBag className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                         <h1 className="text-2xl font-bold">My Orders</h1>
                         <p className="text-sm text-muted-foreground">
                              {orders.length} order{orders.length !== 1 ? "s" : ""} placed
                         </p>
                    </div>
               </div>

               {/* ── Table ── */}
               <Card>
                    <CardContent>
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                        <TableHead>Shipping</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                   </TableRow>
                              </TableHeader>

                              <TableBody>
                                   {orders.length === 0 ? (
                                        <TableRow>
                                             <TableCell colSpan={9} className="py-16 text-center">
                                                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                       <ShoppingBag className="w-10 h-10 opacity-20" />
                                                       <p>No orders yet.</p>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ) : (
                                        orders.map((order) => (
                                             <TableRow key={order.id}>

                                                  {/* Order ID */}
                                                  <TableCell>
                                                       <span className="font-mono text-xs font-semibold text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
                                                            #{order.id.slice(0, 8).toUpperCase()}
                                                       </span>
                                                  </TableCell>

                                                  {/* Items */}
                                                  <TableCell>
                                                       <div className="space-y-0.5 max-w-[160px]">
                                                            {order.items?.slice(0, 2).map((item: any) => (
                                                                 <p key={item.id} className="text-xs text-muted-foreground truncate">
                                                                      <span className="font-medium text-foreground">{item.medicineName}</span>
                                                                      {" "}×{item.quantity}
                                                                 </p>
                                                            ))}
                                                            {order.items?.length > 2 && (
                                                                 <p className="text-xs text-purple-500 font-medium">
                                                                      +{order.items.length - 2} more
                                                                 </p>
                                                            )}
                                                       </div>
                                                  </TableCell>

                                                  {/* Subtotal */}
                                                  <TableCell>
                                                       <span className="text-sm tabular-nums">৳{order.subtotal?.toFixed(2)}</span>
                                                  </TableCell>

                                                  {/* Shipping */}
                                                  <TableCell>
                                                       {order.shippingFee === 0 ? (
                                                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                                                 <CheckCircle2 className="w-3 h-3" /> Free
                                                            </span>
                                                       ) : (
                                                            <span className="text-sm tabular-nums">৳{order.shippingFee?.toFixed(2)}</span>
                                                       )}
                                                  </TableCell>

                                                  {/* Total */}
                                                  <TableCell>
                                                       <span className="font-bold tabular-nums text-purple-600">
                                                            ৳{order.totalPrice?.toFixed(2)}
                                                       </span>
                                                  </TableCell>

                                                  {/* Payment */}
                                                  <TableCell>
                                                       {order.payment ? (
                                                            <PaymentBadge status={order.payment.status} />
                                                       ) : (
                                                            <span className="text-xs text-muted-foreground">—</span>
                                                       )}
                                                  </TableCell>

                                                  {/* Order status */}
                                                  <TableCell>
                                                       <StatusBadge status={order.status} />
                                                  </TableCell>

                                                  {/* Date */}
                                                  <TableCell>
                                                       <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                            {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                                                 day: "2-digit", month: "short", year: "numeric",
                                                            })}
                                                       </p>
                                                  </TableCell>

                                                  {/* Actions */}
                                                  <TableCell className="text-right">
                                                       <div className="flex items-center justify-end gap-2">

                                                            {/* Pay Now */}
                                                            {order.payment?.status === "PENDING" && order.status !== "CANCELLED" && (
                                                                 <Button
                                                                      size="sm"
                                                                      onClick={() => handlePay(order.id)}
                                                                      disabled={loadingId === order.id}
                                                                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-sm gap-1.5 rounded-full px-4"
                                                                 >
                                                                      {loadingId === order.id ? (
                                                                           <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                      ) : (
                                                                           <CreditCard className="w-3.5 h-3.5" />
                                                                      )}
                                                                      {loadingId === order.id ? "Redirecting..." : "Pay Now"}
                                                                 </Button>
                                                            )}

                                                            {/* Cancel */}
                                                            {order.status === "PLACED" && order.payment?.status !== "SUCCESS" && (
                                                                 <AlertDialog
                                                                      open={openDialogId === order.id}
                                                                      onOpenChange={(open) => !open && setOpenDialogId(null)}
                                                                 >
                                                                      <AlertDialogTrigger asChild>
                                                                           <Button
                                                                                size="sm"
                                                                                variant="outline"
                                                                                onClick={() => setOpenDialogId(order.id)}
                                                                                disabled={loadingId === order.id}
                                                                                className="text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 rounded-full gap-1.5"
                                                                           >
                                                                                <XCircle className="w-3.5 h-3.5" />
                                                                                Cancel
                                                                           </Button>
                                                                      </AlertDialogTrigger>

                                                                      <AlertDialogContent>
                                                                           <AlertDialogHeader>
                                                                                <AlertDialogTitle className="flex items-center gap-2">
                                                                                     <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                                                          <XCircle className="w-4 h-4 text-red-500" />
                                                                                     </div>
                                                                                     Cancel Order?
                                                                                </AlertDialogTitle>
                                                                                <AlertDialogDescription>
                                                                                     Are you sure you want to cancel order{" "}
                                                                                     <span className="font-mono font-semibold text-foreground">
                                                                                          #{order.id.slice(0, 8).toUpperCase()}
                                                                                     </span>?{" "}
                                                                                     Stock will be restored but this action cannot be undone.
                                                                                </AlertDialogDescription>
                                                                           </AlertDialogHeader>
                                                                           <AlertDialogFooter>
                                                                                <Button
                                                                                     variant="outline"
                                                                                     onClick={() => setOpenDialogId(null)}
                                                                                >
                                                                                     Keep Order
                                                                                </Button>
                                                                                <Button
                                                                                     variant="destructive"
                                                                                     onClick={() => handleCancel(order.id)}
                                                                                     disabled={loadingId === order.id}
                                                                                     className="gap-1.5"
                                                                                >
                                                                                     {loadingId === order.id ? (
                                                                                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                                     ) : (
                                                                                          <XCircle className="w-3.5 h-3.5" />
                                                                                     )}
                                                                                     {loadingId === order.id ? "Cancelling..." : "Yes, Cancel"}
                                                                                </Button>
                                                                           </AlertDialogFooter>
                                                                      </AlertDialogContent>
                                                                 </AlertDialog>
                                                            )}

                                                            {/* Nothing to do */}
                                                            {order.status !== "PLACED" && order.payment?.status !== "PENDING" && (
                                                                 <span className="text-xs text-muted-foreground">—</span>
                                                            )}
                                                       </div>
                                                  </TableCell>

                                             </TableRow>
                                        ))
                                   )}
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>
          </div>
     );
}