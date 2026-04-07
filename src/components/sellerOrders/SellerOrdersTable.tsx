"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
     Table, TableBody, TableCell,
     TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
     Select, SelectContent, SelectItem,
     SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
     ShoppingBag, User, Phone, MapPin, Package,
     Truck, BadgeCheck, PackageCheck, PackageX,
     Hourglass, Loader2, CreditCard, CheckCircle2,
     XCircle, Clock
} from "lucide-react";
import { updateOrderStatusAction } from "@/actions/order.action";
import { cn } from "@/lib/utils";

// ── Status config ──────────────────────────────────────────
const STATUS_CONFIG: Record<string, {
     label: string;
     icon: React.ReactNode;
     className: string;
}> = {
     PLACED: { label: "Placed", icon: <Hourglass className="w-3 h-3" />, className: "bg-blue-50 text-blue-600 border border-blue-200" },
     CONFIRMED: { label: "Confirmed", icon: <BadgeCheck className="w-3 h-3" />, className: "bg-cyan-50 text-cyan-700 border border-cyan-200" },
     PROCESSING: { label: "Processing", icon: <Loader2 className="w-3 h-3 animate-spin" />, className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
     SHIPPED: { label: "Shipped", icon: <Truck className="w-3 h-3" />, className: "bg-purple-50 text-purple-700 border border-purple-200" },
     DELIVERED: { label: "Delivered", icon: <PackageCheck className="w-3 h-3" />, className: "bg-green-50 text-green-700 border border-green-200" },
     CANCELLED: { label: "Cancelled", icon: <PackageX className="w-3 h-3" />, className: "bg-red-50 text-red-600 border border-red-200" },
};

const PAYMENT_CONFIG: Record<string, { icon: React.ReactNode; className: string }> = {
     SUCCESS: { icon: <CheckCircle2 className="w-3 h-3" />, className: "bg-green-50 text-green-700 border border-green-200" },
     PENDING: { icon: <Clock className="w-3 h-3" />, className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
     FAILED: { icon: <XCircle className="w-3 h-3" />, className: "bg-red-50 text-red-600 border border-red-200" },
     CANCELLED: { icon: <XCircle className="w-3 h-3" />, className: "bg-gray-50 text-gray-500 border border-gray-200" },
     INITIATED: { icon: <Loader2 className="w-3 h-3" />, className: "bg-blue-50 text-blue-600 border border-blue-200" },
};

// Valid next transitions per status
const NEXT_STATUSES: Record<string, string[]> = {
     PLACED: ["CONFIRMED", "CANCELLED"],
     CONFIRMED: ["PROCESSING", "CANCELLED"],
     PROCESSING: ["SHIPPED", "CANCELLED"],
     SHIPPED: ["DELIVERED"],        // too late to cancel once shipped
     DELIVERED: [],
     CANCELLED: [],
};

function StatusPill({ status }: { status: string }) {
     const cfg = STATUS_CONFIG[status];
     if (!cfg) return <span className="text-xs text-muted-foreground">{status}</span>;
     return (
          <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap", cfg.className)}>
               {cfg.icon} {cfg.label}
          </span>
     );
}

function PaymentPill({ status }: { status: string }) {
     const cfg = PAYMENT_CONFIG[status] ?? PAYMENT_CONFIG["PENDING"];
     return (
          <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap", cfg.className)}>
               {cfg.icon} {status}
          </span>
     );
}

export default function SellerOrdersTable({ orders }: { orders: any[] }) {
     const router = useRouter();
     const [isPending, startTransition] = useTransition();
     const [loadingId, setLoadingId] = useState<string | null>(null);
     const [selectKeys, setSelectKeys] = useState<Record<string, number>>({});

     const handleStatusChange = (orderId: string, status: string) => {
          setLoadingId(orderId);
          startTransition(async () => {
               const res = await updateOrderStatusAction(orderId, status);
               console.log(res);
               if (res.ok) {
                    toast.success(`Order marked as ${status}`);
                    router.refresh();
               } else {
                    toast.error(res.message || "Failed to update status");
               }
               setLoadingId(null);
               // Force the Select to remount so it shows the placeholder cleanly
               setSelectKeys((prev) => ({ ...prev, [orderId]: (prev[orderId] ?? 0) + 1 }));
          });
     };

     return (
          <div className="space-y-6">

               {/* Header */}
               <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                         <ShoppingBag className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                         <h1 className="text-2xl font-bold">Customer Orders</h1>
                         <p className="text-sm text-muted-foreground">
                              {orders.length} order{orders.length !== 1 ? "s" : ""} received
                         </p>
                    </div>
               </div>

               {/* Table */}
               <Card>
                    <CardContent>
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                        <TableHead>Shipping</TableHead>
                                        <TableHead>Total</TableHead>
                                        <TableHead>Payment</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Update</TableHead>
                                   </TableRow>
                              </TableHeader>

                              <TableBody>
                                   {orders.length === 0 ? (
                                        <TableRow>
                                             <TableCell colSpan={11} className="py-16 text-center">
                                                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                       <Package className="w-10 h-10 opacity-20" />
                                                       <p>No orders received yet.</p>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ) : (
                                        orders.map((order) => {
                                             const nextStatuses = NEXT_STATUSES[order.status] ?? [];

                                             // Resolve address — either from Address relation or addressSnapshot
                                             const addressText = order.address
                                                  ? `${order.address.line1}${order.address.city ? `, ${order.address.city}` : ""}`
                                                  : order.addressSnapshot?.line1 ?? "—";

                                             return (
                                                  <TableRow key={order.id}>

                                                       {/* Order ID */}
                                                       <TableCell>
                                                            <span className="font-mono text-xs font-semibold text-muted-foreground bg-gray-100 px-2 py-0.5 rounded">
                                                                 #{order.id.slice(0, 8).toUpperCase()}
                                                            </span>
                                                       </TableCell>

                                                       {/* Customer */}
                                                       <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                 <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                                      {order.customer?.name?.charAt(0).toUpperCase()}
                                                                 </div>
                                                                 <div className="min-w-0">
                                                                      <p className="text-sm font-medium leading-none truncate">
                                                                           {order.customer?.name}
                                                                      </p>
                                                                      {order.customer?.phone && (
                                                                           <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                                                <Phone className="w-2.5 h-2.5" />
                                                                                {order.customer.phone}
                                                                           </p>
                                                                      )}
                                                                 </div>
                                                            </div>
                                                       </TableCell>

                                                       {/* Address */}
                                                       <TableCell className="max-w-[140px]">
                                                            <p className="text-xs text-muted-foreground flex items-start gap-1 truncate">
                                                                 <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0 text-purple-400" />
                                                                 <span className="truncate">{addressText}</span>
                                                            </p>
                                                       </TableCell>

                                                       {/* Items */}
                                                       <TableCell>
                                                            <div className="space-y-0.5 max-w-[160px]">
                                                                 {order.items?.slice(0, 2).map((item: any) => (
                                                                      <p key={item.id} className="text-xs text-muted-foreground truncate">
                                                                           <span className="font-medium text-foreground">
                                                                                {item.medicineName ?? item.medicine?.name}
                                                                           </span>
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
                                                            <span className="text-sm tabular-nums">
                                                                 ৳{order.subtotal?.toFixed(2)}
                                                            </span>
                                                       </TableCell>

                                                       {/* Shipping */}
                                                       <TableCell>
                                                            {order.shippingFee === 0 ? (
                                                                 <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                                                      <CheckCircle2 className="w-3 h-3" /> Free
                                                                 </span>
                                                            ) : (
                                                                 <span className="text-sm tabular-nums">
                                                                      ৳{order.shippingFee?.toFixed(2)}
                                                                 </span>
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
                                                                 <div className="space-y-1">
                                                                      <PaymentPill status={order.payment.status} />
                                                                      {order.payment.cardType && (
                                                                           <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                                                                                <CreditCard className="w-2.5 h-2.5" />
                                                                                {order.payment.cardType}
                                                                           </p>
                                                                      )}
                                                                      {order.payment.paidAt && (
                                                                           <p className="text-[10px] text-muted-foreground">
                                                                                {new Date(order.payment.paidAt).toLocaleDateString("en-GB")}
                                                                           </p>
                                                                      )}
                                                                 </div>
                                                            ) : (
                                                                 <span className="text-xs text-muted-foreground">—</span>
                                                            )}
                                                       </TableCell>

                                                       {/* Order status */}
                                                       <TableCell>
                                                            <StatusPill status={order.status} />
                                                       </TableCell>

                                                       {/* Date */}
                                                       <TableCell>
                                                            <p className="text-xs text-muted-foreground whitespace-nowrap">
                                                                 {new Date(order.createdAt).toLocaleDateString("en-GB", {
                                                                      day: "2-digit", month: "short", year: "numeric",
                                                                 })}
                                                            </p>
                                                            <p className="text-[10px] text-muted-foreground">
                                                                 {new Date(order.createdAt).toLocaleTimeString("en-GB", {
                                                                      hour: "2-digit", minute: "2-digit",
                                                                 })}
                                                            </p>
                                                       </TableCell>

                                                       {/* Update status */}
                                                       <TableCell className="text-right items-end justify-end flex w-full">
                                                            {nextStatuses.length > 0 ? (
                                                                 <Select
                                                                      key={selectKeys[order.id] ?? 0}
                                                                      onValueChange={(val) => handleStatusChange(order.id, val)}
                                                                      disabled={loadingId === order.id || isPending}
                                                                 >
                                                                      <SelectTrigger className=" text-xs">
                                                                           {loadingId === order.id ? (
                                                                                <span className="flex items-center gap-1.5 text-muted-foreground">
                                                                                     <Loader2 className="w-3 h-3 animate-spin" /> Updating...
                                                                                </span>
                                                                           ) : (
                                                                                <SelectValue placeholder="Move to..." />
                                                                           )}
                                                                      </SelectTrigger>
                                                                      <SelectContent>
                                                                           {nextStatuses.map((s) => {
                                                                                const cfg = STATUS_CONFIG[s];
                                                                                return (
                                                                                     <SelectItem key={s} value={s} className="text-xs">
                                                                                          <span className="flex items-center gap-1.5">
                                                                                               {cfg?.icon} {cfg?.label ?? s}
                                                                                          </span>
                                                                                     </SelectItem>
                                                                                );
                                                                           })}
                                                                      </SelectContent>
                                                                 </Select>
                                                            ) : (
                                                                 <span className="text-xs text-muted-foreground">—</span>
                                                            )}
                                                       </TableCell>

                                                  </TableRow>
                                             );
                                        })
                                   )}
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>
          </div>
     );
}