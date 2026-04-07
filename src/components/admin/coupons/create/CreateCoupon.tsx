"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
     TicketPercent, ArrowLeft, Loader2,
     Tag, Percent, BadgeDollarSign,
     ShoppingCart, Infinity, Clock, Hash
} from "lucide-react";
import { createCouponAction } from "@/actions/coupon.action";

const INITIAL_FORM = {
     code: "",
     discountType: "PERCENTAGE",
     discountValue: "",
     minOrderAmount: "",
     maxDiscount: "",
     usageLimit: "",
     expiresAt: "",
     description: "",
};

export default function CreateCoupon() {
     const router = useRouter();
     const [isPending, startTransition] = useTransition();
     const [form, setForm] = useState(INITIAL_FORM);

     const set = (key: string, value: string) =>
          setForm((prev) => ({ ...prev, [key]: value }));

     const handleSubmit = (e: React.FormEvent) => {
          e.preventDefault();
          if (!form.code.trim()) return toast.error("Coupon code is required");
          if (!form.discountValue) return toast.error("Discount value is required");

          startTransition(async () => {
               const res = await createCouponAction({
                    code: form.code.toUpperCase().trim(),
                    discountType: form.discountType as "PERCENTAGE" | "FIXED",
                    discountValue: parseFloat(form.discountValue),
                    description: form.description || undefined,
                    minOrderAmount: form.minOrderAmount ? parseFloat(form.minOrderAmount) : undefined,
                    maxDiscount: form.maxDiscount ? parseFloat(form.maxDiscount) : undefined,
                    usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
                    expiresAt: form.expiresAt || undefined,
               });

               if (res.ok) {
                    toast.success("Coupon created successfully!");
                    router.push("/admin-dashboard/coupons");
                    router.refresh();
               } else {
                    toast.error(res.message || "Failed to create coupon");
               }
          });
     };

     return (
          <div className="max-w-6xl mx-auto w-full px-4 py-6 space-y-6">

               {/* Header */}
               <div className="flex items-center gap-3">
                    <Button
                         variant="ghost" size="icon"
                         onClick={() => router.back()}
                         className="rounded-full"
                    >
                         <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                              <TicketPercent className="w-5 h-5 text-purple-600" />
                         </div>
                         <div>
                              <h1 className="text-2xl font-bold">Create Coupon</h1>
                              <p className="text-sm text-muted-foreground">Add a new discount coupon</p>
                         </div>
                    </div>
               </div>

               <form onSubmit={handleSubmit}>
                    <Card>
                         <CardHeader className="border-b">
                              <CardTitle className="text-base flex items-center gap-2">
                                   <Tag className="w-4 h-4 text-purple-500" /> Coupon Details
                              </CardTitle>
                              <CardDescription>Fill in the coupon configuration below</CardDescription>
                         </CardHeader>

                         <CardContent className="space-y-5 pt-6">

                              {/* Code */}
                              <div className="space-y-1.5">
                                   <Label className="flex items-center gap-1.5">
                                        <Hash className="w-3.5 h-3.5 text-muted-foreground" />
                                        Coupon Code <span className="text-red-400">*</span>
                                   </Label>
                                   <Input
                                        value={form.code}
                                        onChange={(e) => set("code", e.target.value.toUpperCase())}
                                        placeholder="e.g. SAVE20, WELCOME10"
                                        className="font-mono font-bold tracking-widest uppercase"
                                        required
                                   />
                                   <p className="text-xs text-muted-foreground">
                                        Customers will enter this code at checkout
                                   </p>
                              </div>

                              {/* Description */}
                              <div className="space-y-1.5">
                                   <Label>Description <span className="text-muted-foreground font-normal">(optional)</span></Label>
                                   <Input
                                        value={form.description}
                                        onChange={(e) => set("description", e.target.value)}
                                        placeholder="e.g. 20% off for new customers"
                                   />
                              </div>

                              {/* Discount type + value */}
                              <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1.5">
                                        <Label className="flex items-center gap-1.5">
                                             <Percent className="w-3.5 h-3.5 text-muted-foreground" />
                                             Discount Type <span className="text-red-400">*</span>
                                        </Label>
                                        <Select
                                             value={form.discountType}
                                             onValueChange={(v) => set("discountType", v)}
                                        >
                                             <SelectTrigger>
                                                  <SelectValue />
                                             </SelectTrigger>
                                             <SelectContent>
                                                  <SelectItem value="PERCENTAGE">
                                                       <span className="flex items-center gap-2">
                                                            <Percent className="w-3.5 h-3.5" /> Percentage (%)
                                                       </span>
                                                  </SelectItem>
                                                  <SelectItem value="FIXED">
                                                       <span className="flex items-center gap-2">
                                                            <BadgeDollarSign className="w-3.5 h-3.5" /> Fixed Amount (৳)
                                                       </span>
                                                  </SelectItem>
                                             </SelectContent>
                                        </Select>
                                   </div>

                                   <div className="space-y-1.5">
                                        <Label>
                                             Discount Value <span className="text-red-400">*</span>
                                        </Label>
                                        <div className="relative">
                                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                                                  {form.discountType === "PERCENTAGE" ? "%" : "৳"}
                                             </span>
                                             <Input
                                                  type="number"
                                                  min="0"
                                                  max={form.discountType === "PERCENTAGE" ? "100" : undefined}
                                                  step="0.01"
                                                  className="pl-8"
                                                  value={form.discountValue}
                                                  onChange={(e) => set("discountValue", e.target.value)}
                                                  placeholder="0"
                                                  required
                                             />
                                        </div>
                                   </div>
                              </div>

                              {/* Min order + max discount */}
                              <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1.5">
                                        <Label className="flex items-center gap-1.5">
                                             <ShoppingCart className="w-3.5 h-3.5 text-muted-foreground" />
                                             Min Order Amount
                                        </Label>
                                        <div className="relative">
                                             <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">৳</span>
                                             <Input
                                                  type="number" min="0" step="0.01"
                                                  className="pl-8"
                                                  value={form.minOrderAmount}
                                                  onChange={(e) => set("minOrderAmount", e.target.value)}
                                                  placeholder="No minimum"
                                             />
                                        </div>
                                   </div>

                                   {form.discountType === "PERCENTAGE" && (
                                        <div className="space-y-1.5">
                                             <Label>Max Discount Cap</Label>
                                             <div className="relative">
                                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">৳</span>
                                                  <Input
                                                       type="number" min="0" step="0.01"
                                                       className="pl-8"
                                                       value={form.maxDiscount}
                                                       onChange={(e) => set("maxDiscount", e.target.value)}
                                                       placeholder="No cap"
                                                  />
                                             </div>
                                             <p className="text-xs text-muted-foreground">
                                                  Maximum discount regardless of order value
                                             </p>
                                        </div>
                                   )}
                              </div>

                              {/* Usage limit + expiry */}
                              <div className="grid grid-cols-2 gap-4">
                                   <div className="space-y-1.5">
                                        <Label className="flex items-center gap-1.5">
                                             <Infinity className="w-3.5 h-3.5 text-muted-foreground" />
                                             Usage Limit
                                        </Label>
                                        <Input
                                             type="number" min="1"
                                             value={form.usageLimit}
                                             onChange={(e) => set("usageLimit", e.target.value)}
                                             placeholder="Unlimited"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                             Leave empty for unlimited uses
                                        </p>
                                   </div>

                                   <div className="space-y-1.5">
                                        <Label className="flex items-center gap-1.5">
                                             <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                                             Expiry Date
                                        </Label>
                                        <Input
                                             type="datetime-local"
                                             value={form.expiresAt}
                                             onChange={(e) => set("expiresAt", e.target.value)}
                                             min={new Date().toISOString().slice(0, 16)}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                             Leave empty — never expires
                                        </p>
                                   </div>
                              </div>

                              {/* Preview pill */}
                              {form.code && (
                                   <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-center gap-4">
                                        <TicketPercent className="w-8 h-8 text-purple-400 flex-shrink-0" />
                                        <div>
                                             <p className="text-xs text-muted-foreground">Preview</p>
                                             <p className="font-mono font-bold text-purple-700 text-lg">{form.code}</p>
                                             <p className="text-sm text-muted-foreground">
                                                  {form.discountValue
                                                       ? form.discountType === "PERCENTAGE"
                                                            ? `${form.discountValue}% off`
                                                            : `৳${form.discountValue} off`
                                                       : "No discount set"
                                                  }
                                                  {form.minOrderAmount && ` on orders over ৳${form.minOrderAmount}`}
                                             </p>
                                        </div>
                                   </div>
                              )}

                         </CardContent>

                         {/* Footer */}
                         <div className="flex items-center justify-end gap-3 px-6 py-4 border-t">
                              <Button
                                   type="button" variant="outline"
                                   onClick={() => router.back()}
                                   className="rounded-full"
                              >
                                   Cancel
                              </Button>
                              <Button
                                   type="submit"
                                   disabled={isPending}
                                   className="rounded-full bg-purple-600 hover:bg-purple-700 gap-1.5 min-w-[140px]"
                              >
                                   {isPending ? (
                                        <>
                                             <Loader2 className="w-4 h-4 animate-spin" /> Creating...
                                        </>
                                   ) : (
                                        <>
                                             <TicketPercent className="w-4 h-4" /> Create Coupon
                                        </>
                                   )}
                              </Button>
                         </div>
                    </Card>
               </form>
          </div>
     );
}