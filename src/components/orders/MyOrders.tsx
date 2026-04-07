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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
     AlertDialog, AlertDialogContent, AlertDialogDescription,
     AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
     AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
     Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
     ShoppingBag, CreditCard, XCircle,
     Clock, CheckCircle2, Truck, PackageCheck,
     PackageX, Loader2, BadgeCheck, Hourglass,
     MessageSquareText, Star,
} from "lucide-react";
import { cancelOrderAction, initiatePaymentForOrderAction } from "@/actions/order.action";
import { createReviewAction } from "@/actions/review.action";
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

const RATING_LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

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

// ── Per-order review dialog ────────────────────────────────
function ReviewDialog({ order }: { order: any }) {
     const [open, setOpen] = useState(false);

     // Each order may have multiple items — track which medicine is being reviewed
     const [selectedMedicineId, setSelectedMedicineId] = useState<string>(
          order.items?.[0]?.medicineId ?? ""
     );
     const [rating, setRating] = useState(5);
     const [reviewTitle, setReviewTitle] = useState("");
     const [comment, setComment] = useState("");
     const [isSubmitting, setIsSubmitting] = useState(false);

     const handleClose = (isOpen: boolean) => {
          setOpen(isOpen);
          if (!isOpen) {
               setRating(5);
               setReviewTitle("");
               setComment("");
               setSelectedMedicineId(order.items?.[0]?.medicineId ?? "");
          }
     };

     const handleSubmit = async () => {
          if (!comment.trim()) { toast.error("Please write a comment"); return; }
          if (!selectedMedicineId) { toast.error("Please select a medicine to review"); return; }

          setIsSubmitting(true);
          try {
               await createReviewAction({
                    medicineId: selectedMedicineId,
                    rating,
                    title: reviewTitle,
                    comment,
               });
               toast.success("Review submitted!");
               setOpen(false);
          } catch (err: any) {
               toast.error(err.message || "Failed to submit review");
          } finally {
               setIsSubmitting(false);
          }
     };

     return (
          <Dialog open={open} onOpenChange={handleClose}>
               <DialogTrigger asChild>
                    <Button
                         size="sm"
                         variant="outline"
                         className="gap-1.5 rounded-full text-purple-600 border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                    >
                         <MessageSquareText className="w-3.5 h-3.5" />
                         Review
                    </Button>
               </DialogTrigger>

               <DialogContent className="max-w-md">
                    <DialogHeader>
                         <DialogTitle>Review Order #{order.id.slice(0, 8).toUpperCase()}</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 pt-1">
                         {/* Medicine selector (if order has multiple items) */}
                         {order.items?.length > 1 && (
                              <div className="space-y-1">
                                   <Label>Select medicine to review</Label>
                                   <select
                                        value={selectedMedicineId}
                                        onChange={(e) => setSelectedMedicineId(e.target.value)}
                                        className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-300"
                                   >
                                        {order.items.map((item: any) => (
                                             <option key={item.medicineId} value={item.medicineId}>
                                                  {item.medicineName}
                                             </option>
                                        ))}
                                   </select>
                              </div>
                         )}

                         {/* Stars */}
                         <div className="space-y-1">
                              <Label>Rating</Label>
                              <div className="flex items-center gap-1">
                                   {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                             key={star}
                                             type="button"
                                             onClick={() => setRating(star)}
                                             className="transition hover:scale-110"
                                        >
                                             <Star
                                                  className={`w-7 h-7 transition-colors ${star <= rating
                                                       ? "fill-yellow-400 text-yellow-400"
                                                       : "text-gray-200 hover:text-yellow-200"
                                                       }`}
                                             />
                                        </button>
                                   ))}
                                   <span className="ml-2 text-sm text-muted-foreground">
                                        {RATING_LABELS[rating]}
                                   </span>
                              </div>
                         </div>

                         {/* Title */}
                         <div className="space-y-1">
                              <Label>
                                   Title{" "}
                                   <span className="text-muted-foreground font-normal">(optional)</span>
                              </Label>
                              <Input
                                   value={reviewTitle}
                                   onChange={(e) => setReviewTitle(e.target.value)}
                                   placeholder="Summarise your experience..."
                                   maxLength={80}
                              />
                         </div>

                         {/* Comment */}
                         <div className="space-y-1">
                              <Label>
                                   Comment <span className="text-red-400">*</span>
                              </Label>
                              <Textarea
                                   value={comment}
                                   onChange={(e) => setComment(e.target.value)}
                                   placeholder="Share details about your experience..."
                                   rows={3}
                              />
                         </div>

                         <Button
                              onClick={handleSubmit}
                              disabled={isSubmitting || !comment.trim()}
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                         >
                              {isSubmitting ? "Submitting..." : "Submit Review"}
                         </Button>
                    </div>
               </DialogContent>
          </Dialog>
     );
}

// ── Main component ─────────────────────────────────────────
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

                                                            {/* Review — only when payment is SUCCESS */}
                                                            {order.payment?.status === "SUCCESS" && (
                                                                 <ReviewDialog order={order} />
                                                            )}

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
                                                            {order.payment?.status !== "SUCCESS" &&
                                                                 order.status !== "PLACED" &&
                                                                 order.payment?.status !== "PENDING" && (
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