"use client";

import {
     Table, TableBody, TableCell,
     TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import {
     CreditCard, CheckCircle2, XCircle,
     Clock, Loader2, Wallet
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

export default function MyPaymentsClient({ payments }: { payments: any[] }) {
     return (
          <div className="px-4 py-6 space-y-6">
               <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                         <CreditCard className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                         <h1 className="text-2xl font-bold">My Payments</h1>
                         <p className="text-sm text-muted-foreground">
                              {payments.length} transaction{payments.length !== 1 ? "s" : ""}
                         </p>
                    </div>
               </div>

               <Card>
                    <CardContent>
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Txn ID</TableHead>
                                        <TableHead>Order ID</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Method</TableHead>
                                        <TableHead>Card</TableHead>
                                        <TableHead>Amount</TableHead>
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
                                                            {p.tranId ? p.tranId.slice(0, 16) + "..." : "—"}
                                                       </span>
                                                  </TableCell>

                                                  <TableCell>
                                                       <span className="font-mono text-xs text-muted-foreground">
                                                            #{p.order?.id?.slice(0, 8).toUpperCase()}
                                                       </span>
                                                  </TableCell>

                                                  <TableCell>
                                                       <div className="space-y-0.5 max-w-[160px]">
                                                            {p.order?.items?.slice(0, 2).map((item: any, i: number) => (
                                                                 <p key={i} className="text-xs text-muted-foreground truncate">
                                                                      <span className="font-medium text-foreground">{item.medicineName}</span> ×{item.quantity}
                                                                 </p>
                                                            ))}
                                                            {p.order?.items?.length > 2 && (
                                                                 <p className="text-xs text-purple-500 font-medium">
                                                                      +{p.order.items.length - 2} more
                                                                 </p>
                                                            )}
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
                                                       <div>
                                                            <p className="font-bold text-purple-600 tabular-nums">৳{p.amount?.toFixed(2)}</p>
                                                            {p.storeAmount && (
                                                                 <p className="text-[10px] text-muted-foreground">
                                                                      Net: ৳{p.storeAmount?.toFixed(2)}
                                                                 </p>
                                                            )}
                                                       </div>
                                                  </TableCell>

                                                  <TableCell>
                                                       <PaymentPill status={p.status} />
                                                       {p.refundedAt && (
                                                            <p className="text-[10px] text-muted-foreground mt-0.5">
                                                                 Refunded {new Date(p.refundedAt).toLocaleDateString("en-GB")}
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