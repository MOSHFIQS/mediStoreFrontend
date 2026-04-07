"use client";

import {
     Table, TableBody, TableCell,
     TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
     CreditCard, CheckCircle2, XCircle,
     Clock, Loader2, Wallet, TrendingUp, Phone
} from "lucide-react";
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

export default function SellerPaymentsClient({ payments }: { payments: any[] }) {
     const totalRevenue = payments
          .filter((p) => p.status === "SUCCESS")
          .reduce((s, p) => s + (p.storeAmount ?? p.amount), 0);

     const successCount = payments.filter((p) => p.status === "SUCCESS").length;

     return (
          <div className="px-4 py-6 space-y-6">

               {/* Header */}
               <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                         <TrendingUp className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                         <h1 className="text-2xl font-bold">Payment History</h1>
                         <p className="text-sm text-muted-foreground">
                              {payments.length} transaction{payments.length !== 1 ? "s" : ""}
                         </p>
                    </div>
               </div>

               {/* Stats */}
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                         { label: "Total Revenue", value: `৳${totalRevenue.toFixed(2)}`, className: "text-purple-600" },
                         { label: "Successful", value: successCount, className: "text-green-600" },
                         { label: "Total Orders", value: payments.length, className: "text-blue-600" },
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
                                        <TableHead>Items</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Net Received</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Paid At</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {payments.length === 0 ? (
                                        <TableRow>
                                             <TableCell colSpan={8} className="py-16 text-center">
                                                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                       <CreditCard className="w-10 h-10 opacity-20" />
                                                       <p>No payments yet.</p>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ) : (
                                        payments.map((p) => (
                                             <TableRow key={p.id}>

                                                  <TableCell>
                                                       <span className="font-mono text-xs bg-gray-100 px-2 py-0.5 rounded text-muted-foreground">
                                                            {p.tranId ? p.tranId.slice(0, 14) + "..." : "—"}
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
                                                       <div className="space-y-0.5 max-w-[160px]">
                                                            {p.order?.items?.slice(0, 2).map((item: any, i: number) => (
                                                                 <p key={i} className="text-xs text-muted-foreground truncate">
                                                                      <span className="font-medium text-foreground">{item.medicineName}</span> ×{item.quantity}
                                                                 </p>
                                                            ))}
                                                            {p.order?.items?.length > 2 && (
                                                                 <p className="text-xs text-purple-500 font-medium">+{p.order.items.length - 2} more</p>
                                                            )}
                                                       </div>
                                                  </TableCell>

                                                  <TableCell>
                                                       <div>
                                                            <p className="text-xs font-medium">{p.method ?? "—"}</p>
                                                            {p.cardType && (
                                                                 <p className="text-[10px] text-muted-foreground">{p.cardType}</p>
                                                            )}
                                                       </div>
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