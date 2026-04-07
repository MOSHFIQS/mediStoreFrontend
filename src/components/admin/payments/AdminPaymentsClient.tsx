"use client";

import { useState, useTransition } from "react";
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
     CreditCard, CheckCircle2, XCircle, Clock,
     Loader2, Wallet, Shield, Phone, RotateCcw
} from "lucide-react";
import { refundPaymentAction } from "@/actions/payment.action";
import { cn } from "@/lib/utils";

const PAYMENT_CONFIG: Record<string, { icon: React.ReactNode; className: string }> = {
     SUCCESS: { icon: <CheckCircle2 className="w-3 h-3" />, className: "bg-green-50 text-green-700 border border-green-200" },
     PENDING: { icon: <Clock className="w-3 h-3" />, className: "bg-yellow-50 text-yellow-700 border border-yellow-200" },
     FAILED: { icon: <XCircle className="w-3 h-3" />, className: "bg-red-50 text-red-600 border border-red-200" },
     CANCELLED: { icon: <XCircle className="w-3 h-3" />, className: "bg-gray-50 text-gray-500 border border-gray-200" },
     REFUNDED: { icon: <Wallet className="w-3 h-3" />, className: "bg-blue-50 text-blue-600 border border-blue-200" },
     INITIATED: { icon: <Loader2 className="w-3 h-3" />, className: "bg-blue-50 text-blue-600 border border-blue-200" },
};

function PaymentPill({ status }: { status: string }) {
     const cfg = PAYMENT_CONFIG[status] ?? PAYMENT_CONFIG["PENDING"];
     return (
          <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full", cfg.className)}>
               {cfg.icon} {status}
          </span>
     );
}

export default function AdminPaymentsClient({ payments }: { payments: any[] }) {
     const router = useRouter();
     const [isPending, startTransition] = useTransition();
     const [openDialogId, setOpenDialogId] = useState<string | null>(null);
     const [loadingId, setLoadingId] = useState<string | null>(null);

     const totalRevenue = payments.filter((p) => p.status === "SUCCESS").reduce((s, p) => s + (p.storeAmount ?? p.amount), 0);
     const totalRefunded = payments.filter((p) => p.status === "REFUNDED").reduce((s, p) => s + (p.refundAmount ?? 0), 0);
     const successCount = payments.filter((p) => p.status === "SUCCESS").length;
     const pendingCount = payments.filter((p) => p.status === "PENDING").length;

     const handleRefund = (paymentId: string) => {
          setLoadingId(paymentId);
          startTransition(async () => {
               const res = await refundPaymentAction(paymentId);
               if (res.ok) {
                    toast.success("Payment refunded successfully");
                    setOpenDialogId(null);
                    router.refresh();
               } else {
                    toast.error(res.message || "Refund failed");
               }
               setLoadingId(null);
          });
     };

     return (
          <div className="px-4 py-6 space-y-6">

               {/* Header */}
               <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                         <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                         <h1 className="text-2xl font-bold">All Payments</h1>
                         <p className="text-sm text-muted-foreground">
                              {payments.length} transaction{payments.length !== 1 ? "s" : ""}
                         </p>
                    </div>
               </div>

               {/* Stats */}
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                         { label: "Total Revenue", value: `৳${totalRevenue.toFixed(2)}`, className: "text-purple-600" },
                         { label: "Successful", value: successCount, className: "text-green-600" },
                         { label: "Pending", value: pendingCount, className: "text-yellow-600" },
                         { label: "Total Refunded", value: `৳${totalRefunded.toFixed(2)}`, className: "text-blue-600" },
                    ].map((s) => (
                         <Card key={s.label} className="border-0 shadow-sm">
                              <CardContent className="p-4">
                                   <p className={cn("text-2xl font-bold", s.className)}>{s.value}</p>
                                   <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                              </CardContent>
                         </Card>
                    ))}
               </div>

               {/* Table */}
               <Card>
                    <CardContent>
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Txn ID</TableHead>
                                        <TableHead>Customer</TableHead>
                                        <TableHead>Order</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Card</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Net</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Paid At</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {payments.length === 0 ? (
                                        <TableRow>
                                             <TableCell colSpan={10} className="py-16 text-center">
                                                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                       <CreditCard className="w-10 h-10 opacity-20" />
                                                       <p>No payments found.</p>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ) : (
                                        payments.map((p) => (
                                             <TableRow key={p.id}>

                                                  <TableCell>
                                                       <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-muted-foreground">
                                                            {p.tranId ? p.tranId.slice(0, 12) + "..." : "—"}
                                                       </span>
                                                  </TableCell>

                                                  <TableCell>
                                                       {p.order?.customer ? (
                                                            <div className="flex items-center gap-2">
                                                                 <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                                                      {p.order.customer.name?.charAt(0).toUpperCase()}
                                                                 </div>
                                                                 <div>
                                                                      <p className="text-sm font-medium leading-none">{p.order.customer.name}</p>
                                                                      {p.order.customer.phone && (
                                                                           <p className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                                                                <Phone className="w-2.5 h-2.5" /> {p.order.customer.phone}
                                                                           </p>
                                                                      )}
                                                                 </div>
                                                            </div>
                                                       ) : (
                                                            <span className="text-xs text-muted-foreground">—</span>
                                                       )}
                                                  </TableCell>

                                                  <TableCell>
                                                       <div>
                                                            <span className="font-mono text-xs text-muted-foreground">
                                                                 #{p.order?.id?.slice(0, 8).toUpperCase()}
                                                            </span>
                                                            <div className="space-y-0.5 mt-0.5">
                                                                 {p.order?.items?.slice(0, 1).map((item: any, i: number) => (
                                                                      <p key={i} className="text-xs text-muted-foreground truncate max-w-[120px]">
                                                                           {item.medicineName} ×{item.quantity}
                                                                      </p>
                                                                 ))}
                                                                 {p.order?.items?.length > 1 && (
                                                                      <p className="text-xs text-purple-500">+{p.order.items.length - 1} more</p>
                                                                 )}
                                                            </div>
                                                       </div>
                                                  </TableCell>

                                                  <TableCell>
                                                       <span className="text-xs font-medium">{p.method ?? "—"}</span>
                                                  </TableCell>

                                                  <TableCell>
                                                       {p.cardType ? (
                                                            <div>
                                                                 <p className="text-xs font-medium">{p.cardType}</p>
                                                                 {p.cardNo && (
                                                                      <p className="text-[10px] text-muted-foreground font-mono">{p.cardNo}</p>
                                                                 )}
                                                            </div>
                                                       ) : (
                                                            <span className="text-xs text-muted-foreground">—</span>
                                                       )}
                                                  </TableCell>

                                                  <TableCell>
                                                       <p className="font-bold text-purple-600 tabular-nums">৳{p.amount?.toFixed(2)}</p>
                                                  </TableCell>

                                                  <TableCell>
                                                       {p.storeAmount ? (
                                                            <p className="font-semibold text-green-600 tabular-nums">৳{p.storeAmount?.toFixed(2)}</p>
                                                       ) : (
                                                            <span className="text-xs text-muted-foreground">—</span>
                                                       )}
                                                  </TableCell>

                                                  <TableCell>
                                                       <PaymentPill status={p.status} />
                                                       {p.refundedAt && (
                                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                                 {new Date(p.refundedAt).toLocaleDateString("en-GB")}
                                                            </p>
                                                       )}
                                                  </TableCell>

                                                  <TableCell>
                                                       {p.paidAt ? (
                                                            <div>
                                                                 <p className="text-xs text-muted-foreground">
                                                                      {new Date(p.paidAt).toLocaleDateString("en-GB", {
                                                                           day: "2-digit", month: "short", year: "numeric",
                                                                      })}
                                                                 </p>
                                                                 <p className="text-[10px] text-muted-foreground">
                                                                      {new Date(p.paidAt).toLocaleTimeString("en-GB", {
                                                                           hour: "2-digit", minute: "2-digit",
                                                                      })}
                                                                 </p>
                                                            </div>
                                                       ) : (
                                                            <span className="text-xs text-muted-foreground">—</span>
                                                       )}
                                                  </TableCell>

                                                  {/* Refund action — only for SUCCESS payments */}
                                                  <TableCell className="text-right">
                                                       {p.status === "SUCCESS" ? (
                                                            <AlertDialog
                                                                 open={openDialogId === p.id}
                                                                 onOpenChange={(open) => !open && setOpenDialogId(null)}
                                                            >
                                                                 <AlertDialogTrigger asChild>
                                                                      <Button
                                                                           size="sm"
                                                                           variant="outline"
                                                                           onClick={() => setOpenDialogId(p.id)}
                                                                           className="text-blue-600 border-blue-200 hover:bg-blue-50 rounded-full gap-1.5"
                                                                      >
                                                                           <RotateCcw className="w-3.5 h-3.5" />
                                                                           Refund
                                                                      </Button>
                                                                 </AlertDialogTrigger>

                                                                 <AlertDialogContent>
                                                                      <AlertDialogHeader>
                                                                           <AlertDialogTitle className="flex items-center gap-2">
                                                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                                                     <RotateCcw className="w-4 h-4 text-blue-600" />
                                                                                </div>
                                                                                Issue Refund?
                                                                           </AlertDialogTitle>
                                                                           <AlertDialogDescription>
                                                                                This will refund{" "}
                                                                                <span className="font-bold text-foreground">৳{p.amount?.toFixed(2)}</span>{" "}
                                                                                to <span className="font-semibold text-foreground">{p.order?.customer?.name}</span>.
                                                                                The order will be marked as refunded. This cannot be undone.
                                                                           </AlertDialogDescription>
                                                                      </AlertDialogHeader>
                                                                      <AlertDialogFooter>
                                                                           <Button variant="outline" onClick={() => setOpenDialogId(null)}>
                                                                                Cancel
                                                                           </Button>
                                                                           <Button
                                                                                onClick={() => handleRefund(p.id)}
                                                                                disabled={loadingId === p.id || isPending}
                                                                                className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                                                                           >
                                                                                {loadingId === p.id ? (
                                                                                     <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                                ) : (
                                                                                     <RotateCcw className="w-3.5 h-3.5" />
                                                                                )}
                                                                                {loadingId === p.id ? "Processing..." : "Yes, Refund"}
                                                                           </Button>
                                                                      </AlertDialogFooter>
                                                                 </AlertDialogContent>
                                                            </AlertDialog>
                                                       ) : (
                                                            <span className="text-xs text-muted-foreground">—</span>
                                                       )}
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