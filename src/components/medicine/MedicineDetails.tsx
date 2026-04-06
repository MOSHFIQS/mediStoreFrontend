"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { createOrderAction, initiatePaymentForOrderAction } from "@/actions/order.action";
import { addToCart, getCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
     ShoppingCart, Zap, Star, BadgeCheck, Package,
     FlaskConical, Building2, Pill, Layers, Tag,
     AlertTriangle, ChevronLeft, Plus, Minus
} from "lucide-react";
import Image from "next/image";

interface Review {
     id: string;
     rating: number;
     title?: string;
     comment: string;
     isVerifiedPurchase: boolean;
     createdAt: string;
     user: { id: string; name: string; image?: string };
}

interface Medicine {
     id: string;
     name: string;
     genericName?: string;
     slug: string;
     description: string;
     price: number;
     discountPrice?: number;
     stock: number;
     image?: string;
     images?: string[];
     manufacturer?: string;
     brand?: string;
     dosageForm?: string;
     strength?: string;
     unit?: string;
     requiresPrescription: boolean;
     sku?: string;
     category: { id: string; name: string };
     seller: { id: string; name: string; phone?: string };
     reviews: Review[];
}

export default function MedicineDetails({ medicine }: { medicine: Medicine }) {
     const router = useRouter();
     const queryClient = useQueryClient();
     const { user } = useAuth();

     const [quantity, setQuantity] = useState(1);
     const [address, setAddress] = useState("");
     const [activeImage, setActiveImage] = useState(medicine.image || "");
     const [isOrdering, setIsOrdering] = useState(false);

     const unitPrice = medicine.discountPrice ?? medicine.price;
     const discount = medicine.discountPrice
          ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100)
          : 0;
     const total = unitPrice * quantity;
     const outOfStock = medicine.stock === 0;

     const allImages = [
          ...(medicine.image ? [medicine.image] : []),
          ...(medicine.images?.filter((img) => img !== medicine.image) ?? []),
     ];

     const changeQty = (delta: number) => {
          setQuantity((q) => Math.min(medicine.stock, Math.max(1, q + delta)));
     };

     // ── Add to cart ────────────────────────────────────────
     const handleAddToCart = () => {
          if (!user) { router.push("/login"); return; }
          addToCart({
               medicineId: medicine.id,
               quantity,
               price: unitPrice,
               image: medicine.image as string,
               name: medicine.name,
          });
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.success(`${medicine.name} added to cart`);
     };

     // ── Buy now (order + SSLCommerz) ───────────────────────
     const handleBuyNow = async () => {
          if (!user) { router.push("/login"); return; }
          if (user.role !== "CUSTOMER") {
               toast.error("Only customers can place orders");
               return;
          }
          if (!address.trim()) {
               toast.error("Please enter a delivery address");
               return;
          }
          if (medicine.requiresPrescription) {
               toast.error("This medicine requires a prescription. Please upload one first.");
               router.push("/dashboard/prescriptions");
               return;
          }

          setIsOrdering(true);
          try {
               // Step 1 — create order
               const order = await createOrderAction({
                    medicineId: medicine.id,
                    quantity,
                    address,
               });

               toast.loading("Redirecting to payment...");

               // Step 2 — initiate SSLCommerz
               const payment = await initiatePaymentForOrderAction(order.data?.id ?? order.data.id);

               // Step 3 — redirect
               window.location.href = payment.data.gatewayUrl;
          } catch (err: any) {
               toast.error(err.message || "Order failed");
               setIsOrdering(false);
          }
     };

     // ── Average rating ─────────────────────────────────────
     const avgRating = medicine.reviews.length
          ? medicine.reviews.reduce((s, r) => s + r.rating, 0) / medicine.reviews.length
          : null;

     return (
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">

               {/* Back */}
               <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
               >
                    <ChevronLeft className="w-4 h-4" /> Back
               </button>

               {/* ── Top section ─────────────────────────────────── */}
               <div className="grid md:grid-cols-2 gap-8">

                    {/* Images */}
                    <div className="space-y-3">
                         <div className="relative w-full h-80 rounded-2xl overflow-hidden border bg-gray-50">
                              <Image
                                   src={activeImage || "https://i.ibb.co/whX8gJjd/medicine-capsule-medical-pills-illustration-png.png"}
                                   alt={medicine.name}
                                   fill
                                   className="object-contain p-4"
                                   sizes="(max-width: 768px) 100vw, 50vw"
                              />
                              {discount > 0 && (
                                   <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        -{discount}%
                                   </span>
                              )}
                              {medicine.requiresPrescription && (
                                   <span className="absolute top-3 right-3 bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" /> Rx Required
                                   </span>
                              )}
                         </div>

                         {/* Thumbnail strip */}
                         {allImages.length > 1 && (
                              <div className="flex gap-2 overflow-x-auto pb-1">
                                   {allImages.map((img, i) => (
                                        <button
                                             key={i}
                                             onClick={() => setActiveImage(img)}
                                             className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition
                    ${activeImage === img ? "border-purple-500" : "border-transparent hover:border-gray-300"}`}
                                        >
                                             <Image src={img} alt={`thumb-${i}`} fill className="object-cover" />
                                        </button>
                                   ))}
                              </div>
                         )}
                    </div>

                    {/* Info */}
                    <div className="space-y-4">
                         {/* Name + badges */}
                         <div>
                              <div className="flex flex-wrap gap-2 mb-2">
                                   <Badge variant="secondary">{medicine.category.name}</Badge>
                                   {medicine.dosageForm && (
                                        <Badge variant="outline">{medicine.dosageForm}</Badge>
                                   )}
                                   {outOfStock ? (
                                        <Badge variant="destructive">Out of Stock</Badge>
                                   ) : (
                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">In Stock</Badge>
                                   )}
                              </div>
                              <h1 className="text-2xl font-bold leading-tight">{medicine.name}</h1>
                              {medicine.genericName && (
                                   <p className="text-sm text-purple-600 font-medium mt-0.5">{medicine.genericName}</p>
                              )}
                         </div>

                         {/* Rating */}
                         {avgRating !== null && (
                              <div className="flex items-center gap-2">
                                   <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                             <Star
                                                  key={s}
                                                  className={`w-4 h-4 ${s <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                             />
                                        ))}
                                   </div>
                                   <span className="text-sm text-muted-foreground">
                                        {avgRating.toFixed(1)} ({medicine.reviews.length} review{medicine.reviews.length !== 1 ? "s" : ""})
                                   </span>
                              </div>
                         )}

                         {/* Price */}
                         <div className="flex items-baseline gap-3">
                              <span className="text-3xl font-bold text-gray-900">৳{unitPrice}</span>
                              {medicine.discountPrice && (
                                   <span className="text-lg text-gray-400 line-through">৳{medicine.price}</span>
                              )}
                              <span className="text-sm text-muted-foreground">/ {medicine.unit || "piece"}</span>
                         </div>

                         <p className="text-sm text-muted-foreground leading-relaxed">{medicine.description}</p>

                         <Separator />

                         {/* Specs grid */}
                         <div className="grid grid-cols-2 gap-3 text-sm">
                              {medicine.brand && (
                                   <div className="flex items-center gap-2 text-muted-foreground">
                                        <Tag className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span><span className="font-medium text-foreground">Brand:</span> {medicine.brand}</span>
                                   </div>
                              )}
                              {medicine.manufacturer && (
                                   <div className="flex items-center gap-2 text-muted-foreground">
                                        <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span><span className="font-medium text-foreground">Mfr:</span> {medicine.manufacturer}</span>
                                   </div>
                              )}
                              {medicine.strength && (
                                   <div className="flex items-center gap-2 text-muted-foreground">
                                        <FlaskConical className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span><span className="font-medium text-foreground">Strength:</span> {medicine.strength}</span>
                                   </div>
                              )}
                              {medicine.dosageForm && (
                                   <div className="flex items-center gap-2 text-muted-foreground">
                                        <Pill className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span><span className="font-medium text-foreground">Form:</span> {medicine.dosageForm}</span>
                                   </div>
                              )}
                              <div className="flex items-center gap-2 text-muted-foreground">
                                   <Layers className="w-3.5 h-3.5 flex-shrink-0" />
                                   <span><span className="font-medium text-foreground">Stock:</span> {medicine.stock} {medicine.unit || "units"}</span>
                              </div>
                              {medicine.sku && (
                                   <div className="flex items-center gap-2 text-muted-foreground">
                                        <Package className="w-3.5 h-3.5 flex-shrink-0" />
                                        <span><span className="font-medium text-foreground">SKU:</span> {medicine.sku}</span>
                                   </div>
                              )}
                         </div>

                         <Separator />

                         {/* Prescription warning */}
                         {medicine.requiresPrescription && (
                              <div className="flex items-start gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2.5">
                                   <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                                   <p className="text-sm text-orange-700">
                                        This medicine requires a valid prescription.{" "}
                                        <button
                                             onClick={() => router.push("/dashboard/prescriptions")}
                                             className="underline font-medium hover:text-orange-900"
                                        >
                                             Upload prescription
                                        </button>
                                   </p>
                              </div>
                         )}

                         {/* Quantity + address */}
                         {!outOfStock && user?.role === "CUSTOMER" && (
                              <div className="space-y-3">
                                   {/* Quantity picker */}
                                   <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium w-20">Quantity</span>
                                        <div className="flex items-center border rounded-full overflow-hidden">
                                             <button
                                                  onClick={() => changeQty(-1)}
                                                  disabled={quantity <= 1}
                                                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40 transition"
                                             >
                                                  <Minus className="w-3.5 h-3.5" />
                                             </button>
                                             <span className="px-4 py-2 font-semibold text-sm min-w-[2.5rem] text-center">{quantity}</span>
                                             <button
                                                  onClick={() => changeQty(1)}
                                                  disabled={quantity >= medicine.stock}
                                                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40 transition"
                                             >
                                                  <Plus className="w-3.5 h-3.5" />
                                             </button>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                             Total: <span className="font-bold text-foreground">৳{total}</span>
                                        </span>
                                   </div>

                                   {/* Address */}
                                   <div className="space-y-1">
                                        <label className="text-sm font-medium">Delivery Address</label>
                                        <Input
                                             value={address}
                                             onChange={(e) => setAddress(e.target.value)}
                                             placeholder="House 12, Road 3, Gulshan, Dhaka 1212"
                                        />
                                   </div>
                              </div>
                         )}

                         {/* Action buttons */}
                         <div className="flex gap-3 pt-1">
                              {user?.role === "CUSTOMER" && !outOfStock && (
                                   <>
                                        <Button
                                             variant="outline"
                                             className="flex-1 rounded-full gap-2"
                                             onClick={handleAddToCart}
                                        >
                                             <ShoppingCart className="w-4 h-4" /> Add to Cart
                                        </Button>

                                        <Button
                                             className="flex-1 rounded-full gap-2 bg-purple-600 hover:bg-purple-700"
                                             onClick={handleBuyNow}
                                             disabled={isOrdering || !address.trim()}
                                        >
                                             {isOrdering ? (
                                                  <>
                                                       <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                       Processing...
                                                  </>
                                             ) : (
                                                  <>
                                                       <Zap className="w-4 h-4" /> Buy Now
                                                  </>
                                             )}
                                        </Button>
                                   </>
                              )}

                              {!user && (
                                   <Button className="w-full rounded-full" onClick={() => router.push("/login")}>
                                        Log in to Order
                                   </Button>
                              )}

                              {outOfStock && (
                                   <Button disabled className="w-full rounded-full opacity-60">
                                        Out of Stock
                                   </Button>
                              )}
                         </div>

                         {/* Seller info */}
                         <p className="text-xs text-muted-foreground">
                              Sold by <span className="font-medium text-foreground">{medicine.seller.name}</span>
                              {medicine.seller.phone && ` · ${medicine.seller.phone}`}
                         </p>
                    </div>
               </div>

               {/* ── Reviews section ──────────────────────────────── */}
               <div className="space-y-4">
                    <h2 className="text-xl font-bold">
                         Customer Reviews
                         {medicine.reviews.length > 0 && (
                              <span className="text-base font-normal text-muted-foreground ml-2">
                                   ({medicine.reviews.length})
                              </span>
                         )}
                    </h2>

                    {medicine.reviews.length === 0 ? (
                         <div className="text-center py-12 text-muted-foreground border rounded-xl">
                              <Star className="w-10 h-10 mx-auto opacity-20 mb-2" />
                              <p>No reviews yet for this medicine.</p>
                         </div>
                    ) : (
                         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {medicine.reviews.map((review) => (
                                   <div key={review.id} className="border rounded-xl p-4 space-y-2 hover:shadow-sm transition">
                                        <div className="flex items-center justify-between">
                                             <div className="flex items-center gap-2">
                                                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-semibold text-sm flex items-center justify-center flex-shrink-0">
                                                       {review.user.name?.charAt(0).toUpperCase()}
                                                  </div>
                                                  <div>
                                                       <p className="text-sm font-medium leading-none flex items-center gap-1">
                                                            {review.user.name}
                                                            {review.isVerifiedPurchase && (
                                                                 <BadgeCheck className="w-3.5 h-3.5 text-green-500" />
                                                            )}
                                                       </p>
                                                       <p className="text-xs text-muted-foreground mt-0.5">
                                                            {new Date(review.createdAt).toLocaleDateString("en-GB", {
                                                                 day: "numeric", month: "short", year: "numeric",
                                                            })}
                                                       </p>
                                                  </div>
                                             </div>
                                             <div className="flex gap-0.5">
                                                  {[1, 2, 3, 4, 5].map((s) => (
                                                       <Star
                                                            key={s}
                                                            className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`}
                                                       />
                                                  ))}
                                             </div>
                                        </div>

                                        {review.title && (
                                             <p className="font-semibold text-sm">{review.title}</p>
                                        )}
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                             "{review.comment}"
                                        </p>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>
          </div>
     );
}