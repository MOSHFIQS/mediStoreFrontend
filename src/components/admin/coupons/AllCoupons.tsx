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
     Tag, Plus, Trash2, CheckCircle2,
     XCircle, Infinity, Loader2, TicketPercent
} from "lucide-react";
import { deleteCouponAction, updateCouponAction } from "@/actions/coupon.action";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export default function AllCoupons({ coupons }: { coupons: any[] }) {
     const router = useRouter();
     const [isPending, startTransition] = useTransition();
     const [openDialogId, setOpenDialogId] = useState<string | null>(null);
     const [loadingId, setLoadingId] = useState<string | null>(null);

     const activeCoupons = coupons.filter((c) => c.isActive).length;
     const totalUsed = coupons.reduce((s, c) => s + c.usedCount, 0);
     const expiredCoupons = coupons.filter((c) => c.expiresAt && new Date(c.expiresAt) < new Date()).length;

     const handleDelete = (id: string) => {
          setLoadingId(id);
          startTransition(async () => {
               const res = await deleteCouponAction(id);
               if (res.ok) {
                    toast.success("Coupon deleted");
                    setOpenDialogId(null);
                    router.refresh();
               } else {
                    toast.error(res.message || "Failed to delete");
               }
               setLoadingId(null);
          });
     };

     const handleToggleActive = (id: string, current: boolean) => {
          setLoadingId(id);
          startTransition(async () => {
               const res = await updateCouponAction(id, { isActive: !current });
               if (res.ok) {
                    toast.success(`Coupon ${!current ? "activated" : "deactivated"}`);
                    router.refresh();
               } else {
                    toast.error(res.message || "Failed to update");
               }
               setLoadingId(null);
          });
     };

     const isExpired = (expiresAt: string | null) =>
          expiresAt ? new Date(expiresAt) < new Date() : false;

     return (
          <div className="px-4 py-6 space-y-6">

               {/* Header */}
               <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                              <TicketPercent className="w-5 h-5 text-purple-600" />
                         </div>
                         <div>
                              <h1 className="text-2xl font-bold">Coupons</h1>
                              <p className="text-sm text-muted-foreground">
                                   {coupons.length} coupon{coupons.length !== 1 ? "s" : ""} total
                              </p>
                         </div>
                    </div>
                    <Button
                         className="rounded-full bg-purple-600 hover:bg-purple-700 gap-1.5"
                         onClick={() => router.push("/admin-dashboard/coupons/create")}
                    >
                         <Plus className="w-4 h-4" /> New Coupon
                    </Button>
               </div>

               {/* Stats */}
               <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[
                         { label: "Active", value: activeCoupons, className: "text-green-600" },
                         { label: "Total Used", value: totalUsed, className: "text-purple-600" },
                         { label: "Expired", value: expiredCoupons, className: "text-red-500" },
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
                                        <TableHead>Code</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Value</TableHead>
                                        <TableHead>Min Order</TableHead>
                                        <TableHead>Max Discount</TableHead>
                                        <TableHead>Used / Limit</TableHead>
                                        <TableHead>Expires</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Active</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                   </TableRow>
                              </TableHeader>

                              <TableBody>
                                   {coupons.length === 0 ? (
                                        <TableRow>
                                             <TableCell colSpan={10} className="py-16 text-center">
                                                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                                       <Tag className="w-10 h-10 opacity-20" />
                                                       <p>No coupons yet.</p>
                                                       <Button
                                                            size="sm" variant="outline"
                                                            onClick={() => router.push("/admin-dashboard/coupons/create")}
                                                            className="rounded-full mt-1"
                                                       >
                                                            <Plus className="w-3.5 h-3.5 mr-1" /> Create your first coupon
                                                       </Button>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ) : (
                                        coupons.map((c) => {
                                             const expired = isExpired(c.expiresAt);
                                             return (
                                                  <TableRow key={c.id}>

                                                       {/* Code */}
                                                       <TableCell>
                                                            <span className="font-mono font-bold text-sm bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-lg">
                                                                 {c.code}
                                                            </span>
                                                       </TableCell>

                                                       {/* Type */}
                                                       <TableCell>
                                                            <span className={cn(
                                                                 "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                                                                 c.discountType === "PERCENTAGE"
                                                                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                                      : "bg-amber-50 text-amber-700 border border-amber-200"
                                                            )}>
                                                                 {c.discountType === "PERCENTAGE" ? "%" : "৳"} {c.discountType}
                                                            </span>
                                                       </TableCell>

                                                       {/* Value */}
                                                       <TableCell>
                                                            <span className="font-bold text-purple-600">
                                                                 {c.discountType === "PERCENTAGE"
                                                                      ? `${c.discountValue}%`
                                                                      : `৳${c.discountValue}`}
                                                            </span>
                                                       </TableCell>

                                                       {/* Min order */}
                                                       <TableCell>
                                                            <span className="text-sm text-muted-foreground">
                                                                 {c.minOrderAmount ? `৳${c.minOrderAmount}` : "—"}
                                                            </span>
                                                       </TableCell>

                                                       {/* Max discount */}
                                                       <TableCell>
                                                            <span className="text-sm text-muted-foreground">
                                                                 {c.maxDiscount ? `৳${c.maxDiscount}` : "—"}
                                                            </span>
                                                       </TableCell>

                                                       {/* Used / Limit */}
                                                       <TableCell>
                                                            <div className="flex items-center gap-1.5">
                                                                 <span className="text-sm font-medium">{c.usedCount}</span>
                                                                 <span className="text-muted-foreground text-xs">/</span>
                                                                 {c.usageLimit ? (
                                                                      <span className="text-sm text-muted-foreground">{c.usageLimit}</span>
                                                                 ) : (
                                                                      <Infinity className="w-3.5 h-3.5 text-muted-foreground" />
                                                                 )}
                                                            </div>
                                                            {/* Usage bar */}
                                                            {c.usageLimit && (
                                                                 <div className="mt-1 w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                                      <div
                                                                           className="h-full bg-purple-400 rounded-full"
                                                                           style={{ width: `${Math.min((c.usedCount / c.usageLimit) * 100, 100)}%` }}
                                                                      />
                                                                 </div>
                                                            )}
                                                       </TableCell>

                                                       {/* Expires */}
                                                       <TableCell>
                                                            {c.expiresAt ? (
                                                                 <span className={cn(
                                                                      "text-xs",
                                                                      expired ? "text-red-500 font-medium" : "text-muted-foreground"
                                                                 )}>
                                                                      {expired && "⚠ "}{new Date(c.expiresAt).toLocaleDateString("en-GB", {
                                                                           day: "2-digit", month: "short", year: "numeric",
                                                                      })}
                                                                 </span>
                                                            ) : (
                                                                 <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                                      <Infinity className="w-3 h-3" /> Never
                                                                 </span>
                                                            )}
                                                       </TableCell>

                                                       {/* Status pill */}
                                                       <TableCell>
                                                            {expired ? (
                                                                 <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
                                                                      <XCircle className="w-3 h-3" /> Expired
                                                                 </span>
                                                            ) : c.isActive ? (
                                                                 <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700 border border-green-200">
                                                                      <CheckCircle2 className="w-3 h-3" /> Active
                                                                 </span>
                                                            ) : (
                                                                 <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 border border-gray-200">
                                                                      <XCircle className="w-3 h-3" /> Inactive
                                                                 </span>
                                                            )}
                                                       </TableCell>

                                                       {/* Toggle active */}
                                                       <TableCell>
                                                            <Switch
                                                                 checked={c.isActive}
                                                                 disabled={loadingId === c.id || isPending || expired}
                                                                 onCheckedChange={() => handleToggleActive(c.id, c.isActive)}
                                                            />
                                                       </TableCell>

                                                       {/* Delete */}
                                                       <TableCell className="text-right">
                                                            <AlertDialog
                                                                 open={openDialogId === c.id}
                                                                 onOpenChange={(open) => !open && setOpenDialogId(null)}
                                                            >
                                                                 <AlertDialogTrigger asChild>
                                                                      <Button
                                                                           size="icon" variant="destructive"
                                                                           onClick={() => setOpenDialogId(c.id)}
                                                                           disabled={loadingId === c.id}
                                                                      >
                                                                           {loadingId === c.id
                                                                                ? <Loader2 className="w-4 h-4 animate-spin" />
                                                                                : <Trash2 className="w-4 h-4" />
                                                                           }
                                                                      </Button>
                                                                 </AlertDialogTrigger>

                                                                 <AlertDialogContent>
                                                                      <AlertDialogHeader>
                                                                           <AlertDialogTitle className="flex items-center gap-2">
                                                                                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                                                                     <Trash2 className="w-4 h-4 text-red-500" />
                                                                                </div>
                                                                                Delete Coupon?
                                                                           </AlertDialogTitle>
                                                                           <AlertDialogDescription>
                                                                                Are you sure you want to delete coupon{" "}
                                                                                <span className="font-mono font-bold text-foreground">{c.code}</span>?
                                                                                This cannot be undone.
                                                                           </AlertDialogDescription>
                                                                      </AlertDialogHeader>
                                                                      <AlertDialogFooter>
                                                                           <Button variant="outline" onClick={() => setOpenDialogId(null)}>
                                                                                Cancel
                                                                           </Button>
                                                                           <Button
                                                                                variant="destructive"
                                                                                onClick={() => handleDelete(c.id)}
                                                                                disabled={loadingId === c.id}
                                                                                className="gap-1.5"
                                                                           >
                                                                                {loadingId === c.id
                                                                                     ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                                     : <Trash2 className="w-3.5 h-3.5" />
                                                                                }
                                                                                Delete
                                                                           </Button>
                                                                      </AlertDialogFooter>
                                                                 </AlertDialogContent>
                                                            </AlertDialog>
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