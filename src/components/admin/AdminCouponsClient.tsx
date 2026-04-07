"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createCouponAction, deleteCouponAction } from "@/actions/coupon.action";
import { Trash2, Plus } from "lucide-react";

export default function AdminCouponsClient({ coupons }: { coupons: any[] }) {
     console.log(coupons);
     const router = useRouter();
     const [showForm, setShowForm] = useState(false);
     const [loading, setLoading] = useState(false);
     const [form, setForm] = useState({
          code: "", discountType: "PERCENTAGE", discountValue: "", minOrderAmount: "",
          maxDiscount: "", usageLimit: "", expiresAt: "",
     });

     const handleCreate = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!form.code || !form.discountValue) return toast.error("Code and discount value are required");
          setLoading(true);
          try {
               await createCouponAction({
                    ...form,
                    discountValue: parseFloat(form.discountValue),
                    minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : undefined,
                    maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
                    usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
                    expiresAt: form.expiresAt || undefined,
               });
               toast.success("Coupon created");
               setShowForm(false);
               router.refresh();
          } catch (err: any) {
               toast.error(err.message);
          } finally {
               setLoading(false);
          }
     };

     const handleDelete = async (id: string) => {
          try {
               await deleteCouponAction(id);
               toast.success("Coupon deleted");
               router.refresh();
          } catch (err: any) {
               toast.error(err.message);
          }
     };

     return (
          <div className="max-w-4xl mx-auto p-4 space-y-4">
               <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Coupons</h1>
                    <Button onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4 mr-1" />New Coupon</Button>
               </div>

               {showForm && (
                    <Card>
                         <CardContent className="p-4">
                              <form onSubmit={handleCreate} className="space-y-3">
                                   <div className="grid grid-cols-2 gap-3">
                                        <Input placeholder="Code (e.g. SAVE20)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} required />
                                        <select className="border rounded-md px-3 py-2 text-sm" value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}>
                                             <option value="PERCENTAGE">Percentage (%)</option>
                                             <option value="FIXED">Fixed (৳)</option>
                                        </select>
                                        <Input type="number" placeholder="Discount value" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} required />
                                        <Input type="number" placeholder="Min order amount" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} />
                                        <Input type="number" placeholder="Max discount (for %)" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} />
                                        <Input type="number" placeholder="Usage limit" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} />
                                        <Input type="datetime-local" placeholder="Expires at" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="col-span-2" />
                                   </div>
                                   <div className="flex gap-2">
                                        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
                                        <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                                   </div>
                              </form>
                         </CardContent>
                    </Card>
               )}

               {/* Coupon table */}
               <div className="overflow-x-auto">
                    <table className="w-full text-sm border rounded-xl overflow-hidden">
                         <thead className="bg-muted">
                              <tr>
                                   {["Code", "Type", "Value", "Min Order", "Used", "Limit", "Expires", "Status", ""].map((h) => (
                                        <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>
                                   ))}
                              </tr>
                         </thead>
                         <tbody className="divide-y">
                              {coupons.map((c) => (
                                   <tr key={c.id} className="hover:bg-muted/50">
                                        <td className="px-3 py-2 font-mono font-bold">{c.code}</td>
                                        <td className="px-3 py-2">{c.discountType}</td>
                                        <td className="px-3 py-2">{c.discountType === "PERCENTAGE" ? `${c.discountValue}%` : `৳${c.discountValue}`}</td>
                                        <td className="px-3 py-2">{c.minOrderAmount ? `৳${c.minOrderAmount}` : "—"}</td>
                                        <td className="px-3 py-2">{c.usedCount}</td>
                                        <td className="px-3 py-2">{c.usageLimit || "∞"}</td>
                                        <td className="px-3 py-2">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}</td>
                                        <td className="px-3 py-2">
                                             <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${c.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                  {c.isActive ? "Active" : "Inactive"}
                                             </span>
                                        </td>
                                        <td className="px-3 py-2">
                                             <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(c.id)}>
                                                  <Trash2 className="w-4 h-4" />
                                             </Button>
                                        </td>
                                   </tr>
                              ))}
                         </tbody>
                    </table>
               </div>
          </div>
     );
}