"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";
import { createOrderAction, initiatePaymentForOrderAction } from "@/actions/order.action";
import { createAddressAction } from "@/actions/address.action";
import { addToCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
     ShoppingCart, Zap, Star, BadgeCheck, Package,
     FlaskConical, Building2, Pill, Layers, Tag,
     AlertTriangle, ChevronLeft, Plus, Minus,
     MapPin, PlusCircle, FileText, CheckCircle
} from "lucide-react";
import Image from "next/image";
import { Card } from "../ui/card";

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
     sku?: string;
     category: { id: string; name: string };
     seller: { id: string; name: string; phone?: string };
     reviews: Review[];
}

interface Address {
     id: string;
     label?: string;
     line1: string;
     line2?: string;
     city: string;
     district: string;
     postalCode?: string;
     isDefault: boolean;
}


interface NewAddressForm {
     label: string;
     line1: string;
     line2: string;
     city: string;
     district: string;
     postalCode: string;
}
const FALLBACK_IMAGE = "https://i.ibb.co/whX8gJjd/medicine-capsule-medical-pills-illustration-png.png";
export default function MedicineDetails({
     medicine,
     addresses,
}: {
     medicine: Medicine;
     addresses: Address[];
}) {
     const router = useRouter();
     const queryClient = useQueryClient();
     const { user } = useAuth();

     const [quantity, setQuantity] = useState(1);
     const images = medicine.images?.length ? medicine.images : [FALLBACK_IMAGE];
     const [activeImage, setActiveImage] = useState(images[0]);
     const [isOrdering, setIsOrdering] = useState(false);

     // ── Address ───────────────────────────────────────────
     const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;
     const [selectedAddressId, setSelectedAddressId] = useState<string | null>(defaultAddr?.id ?? null);
     const [useNewAddress, setUseNewAddress] = useState(addresses.length === 0);
     const [newAddress, setNewAddress] = useState<NewAddressForm>({
          label: "", line1: "", line2: "", city: "", district: "", postalCode: "",
     });
     const [saveNewAddress, setSaveNewAddress] = useState(false);


     const unitPrice = medicine.discountPrice ?? medicine.price;
     const discount = medicine.discountPrice
          ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100)
          : 0;
     const total = unitPrice * quantity;
     const outOfStock = medicine.stock === 0;

     const allImages = medicine.images ?? [];

     const changeQty = (delta: number) =>
          setQuantity((q) => Math.min(medicine.stock, Math.max(1, q + delta)));

     // ── Add to cart ────────────────────────────────────────
     const handleAddToCart = () => {
          if (!user) { router.push("/login"); return; }
          addToCart({
               medicineId: medicine.id,
               quantity,
               price: unitPrice,
               image: images[0],
               name: medicine.name,
          });
          queryClient.invalidateQueries({ queryKey: ["cart"] });
          toast.success(`${medicine.name} added to cart`);
     };

     // ── Buy now ────────────────────────────────────────────
     const handleBuyNow = async () => {
          if (!user) { router.push("/login"); return; }
          if (user.role !== "CUSTOMER") { toast.error("Only customers can place orders"); return; }



          const isUsingNew = useNewAddress || addresses.length === 0;
          if (isUsingNew && !newAddress.line1.trim()) { toast.error("Please enter a delivery address"); return; }
          if (!isUsingNew && !selectedAddressId) { toast.error("Please select a delivery address"); return; }

          setIsOrdering(true);
          const toastId = toast.loading("Placing order...");

          try {
               if (isUsingNew && saveNewAddress && newAddress.line1.trim()) {
                    await createAddressAction({
                         label: newAddress.label || undefined,
                         line1: newAddress.line1,
                         line2: newAddress.line2 || undefined,
                         city: newAddress.city,
                         district: newAddress.district,
                         postalCode: newAddress.postalCode || undefined,
                         isDefault: addresses.length === 0,
                    });
               }

               const order = await createOrderAction({
                    medicineId: medicine.id,
                    quantity,
                    ...(isUsingNew
                         ? { addressSnapshot: { line1: newAddress.line1, city: newAddress.city || undefined, district: newAddress.district || undefined } }
                         : { addressId: selectedAddressId! }
                    ),
               });

               console.log(order);


               if (!order.ok) throw new Error(order.message);

               toast.loading("Redirecting to payment...", { id: toastId });

               const payment = await initiatePaymentForOrderAction(order.data.id);
               console.log(payment);
               if (!payment.ok) throw new Error(payment.message);

               toast.success("Redirecting to SSLCommerz...", { id: toastId });
               window.location.href = payment.data.gatewayUrl;
          } catch (err: any) {
               toast.error(err.message || "Order failed", { id: toastId });
               setIsOrdering(false);
          }
     };

     const avgRating = medicine.reviews.length
          ? medicine.reviews.reduce((s, r) => s + r.rating, 0) / medicine.reviews.length
          : null;

     const isAddressValid = (useNewAddress || addresses.length === 0)
          ? newAddress.line1.trim().length > 0
          : !!selectedAddressId;


     return (
          <div className="max-w-6xl mx-auto px-4 py-6 space-y-10">

               {/* Back */}
               <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition"
               >
                    <ChevronLeft className="w-4 h-4" /> Back
               </button>

               {/* ── Top section ── */}
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
                         </div>
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
                         <div>
                              <div className="flex flex-wrap gap-2 mb-2">
                                   <Badge variant="secondary">{medicine.category.name}</Badge>
                                   {medicine.dosageForm && <Badge variant="outline">{medicine.dosageForm}</Badge>}
                                   {outOfStock
                                        ? <Badge variant="destructive">Out of Stock</Badge>
                                        : <Badge className="bg-green-100 text-green-700 hover:bg-green-100">In Stock</Badge>
                                   }
                              </div>
                              <h1 className="text-2xl font-bold leading-tight">{medicine.name}</h1>
                              {medicine.genericName && (
                                   <p className="text-sm text-purple-600 font-medium mt-0.5">{medicine.genericName}</p>
                              )}
                         </div>

                         {avgRating !== null && (
                              <div className="flex items-center gap-2">
                                   <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                             <Star key={s} className={`w-4 h-4 ${s <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                                        ))}
                                   </div>
                                   <span className="text-sm text-muted-foreground">
                                        {avgRating.toFixed(1)} ({medicine.reviews.length} review{medicine.reviews.length !== 1 ? "s" : ""})
                                   </span>
                              </div>
                         )}

                         <div className="flex items-baseline gap-3">
                              <span className="text-3xl font-bold text-gray-900">৳{unitPrice}</span>
                              {medicine.discountPrice && <span className="text-lg text-gray-400 line-through">৳{medicine.price}</span>}
                              <span className="text-sm text-muted-foreground">/ {medicine.unit || "piece"}</span>
                         </div>

                         <p className="text-sm text-muted-foreground leading-relaxed">{medicine.description}</p>

                         <Separator />

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



                         {/* Quantity + address — only shown when Rx is satisfied or not required */}
                         {!outOfStock && user?.role === "CUSTOMER" && (
                              <div className="space-y-4">

                                   {/* Quantity picker */}
                                   <div className="flex items-center gap-3">
                                        <span className="text-sm font-medium w-20">Quantity</span>
                                        <div className="flex items-center border rounded-full overflow-hidden">
                                             <button onClick={() => changeQty(-1)} disabled={quantity <= 1}
                                                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40 transition">
                                                  <Minus className="w-3.5 h-3.5" />
                                             </button>
                                             <span className="px-4 py-2 font-semibold text-sm min-w-[2.5rem] text-center">{quantity}</span>
                                             <button onClick={() => changeQty(1)} disabled={quantity >= medicine.stock}
                                                  className="px-3 py-2 hover:bg-gray-100 disabled:opacity-40 transition">
                                                  <Plus className="w-3.5 h-3.5" />
                                             </button>
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                             Total: <span className="font-bold text-foreground">৳{total}</span>
                                        </span>
                                   </div>

                                   {/* Delivery Address */}
                                   <div className="space-y-2">
                                        <p className="text-sm font-medium flex items-center gap-1.5">
                                             <MapPin className="w-3.5 h-3.5 text-purple-500" /> Delivery Address
                                        </p>

                                        {addresses.length > 0 && (
                                             <div className="space-y-2">
                                                  {addresses.map((addr) => (
                                                       <Card
                                                            key={addr.id}
                                                            onClick={() => { setSelectedAddressId(addr.id); setUseNewAddress(false); }}
                                                            className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition
                                                            ${selectedAddressId === addr.id && !useNewAddress
                                                                      ? "border-purple-400 bg-purple-50"
                                                                      : "border-gray-200 hover:border-gray-300"
                                                                 }`}
                                                       >
                                                            <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 transition
                                                                 ${selectedAddressId === addr.id && !useNewAddress
                                                                      ? "border-purple-500 bg-purple-500"
                                                                      : "border-gray-300"
                                                                 }`}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                 <div className="flex items-center gap-2 flex-wrap">
                                                                      {addr.label && (
                                                                           <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded">{addr.label}</span>
                                                                      )}
                                                                      {addr.isDefault && (
                                                                           <span className="text-xs text-purple-600 font-medium flex items-center gap-1">
                                                                                <Star className="w-3 h-3 fill-purple-500 text-purple-500" /> Default
                                                                           </span>
                                                                      )}
                                                                 </div>
                                                                 <p className="text-sm mt-0.5">
                                                                      {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}
                                                                 </p>
                                                                 <p className="text-xs text-muted-foreground">
                                                                      {addr.city}, {addr.district}
                                                                      {addr.postalCode ? ` - ${addr.postalCode}` : ""}
                                                                 </p>
                                                            </div>
                                                       </Card>
                                                  ))}

                                                  <button
                                                       onClick={() => { setUseNewAddress(!useNewAddress); setSelectedAddressId(null); }}
                                                       className={`flex items-center gap-2 w-full p-3 rounded-xl border-2 text-sm transition bg-white
                                                       ${useNewAddress
                                                                 ? "border-purple-400 bg-purple-50 text-purple-700"
                                                                 : "border-dashed border-gray-300 text-muted-foreground hover:border-purple-300"
                                                            }`}
                                                  >
                                                       <PlusCircle className="w-4 h-4 flex-shrink-0" />
                                                       Use a different address
                                                  </button>
                                             </div>
                                        )}

                                        {(useNewAddress || addresses.length === 0) && (
                                             <div className="space-y-2 border p-3 rounded-xl bg-white">
                                                  <Input placeholder="Label (Home, Office)" value={newAddress.label}
                                                       onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })} />
                                                  <Input placeholder="Address Line 1 *" value={newAddress.line1}
                                                       onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
                                                  <Input placeholder="Address Line 2" value={newAddress.line2}
                                                       onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })} />
                                                  <div className="grid grid-cols-2 gap-2">
                                                       <Input placeholder="City" value={newAddress.city}
                                                            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                                                       <Input placeholder="District" value={newAddress.district}
                                                            onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })} />
                                                  </div>
                                                  <Input placeholder="Postal Code" value={newAddress.postalCode}
                                                       onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} />
                                                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none pt-1">
                                                       <input type="checkbox" checked={saveNewAddress}
                                                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                                                            className="w-4 h-4 rounded accent-purple-600" />
                                                       Save this address for future orders
                                                  </label>
                                             </div>
                                        )}
                                   </div>
                              </div>
                         )}

                         {/* Action buttons */}
                         <div className="flex gap-3 pt-1">
                              {user?.role === "CUSTOMER" && !outOfStock && (
                                   <>
                                        <Button variant="outline" className="flex-1 rounded-full gap-2" onClick={handleAddToCart}>
                                             <ShoppingCart className="w-4 h-4" /> Add to Cart
                                        </Button>
                                        <Button
                                             className="flex-1 rounded-full gap-2 bg-purple-600 hover:bg-purple-700"
                                             onClick={handleBuyNow}
                                             disabled={isOrdering || !isAddressValid}
                                        >
                                             {isOrdering ? (
                                                  <>
                                                       <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                       Processing...
                                                  </>
                                             ) : (
                                                  <><Zap className="w-4 h-4" /> Buy Now</>
                                             )}
                                        </Button>
                                   </>
                              )}
                              {!user && (
                                   <Button className="w-full rounded-full" onClick={() => router.push(`/login?redirect=/medicines/${medicine.id}`)}>
                                        Log in to Order
                                   </Button>
                              )}
                              {outOfStock && (
                                   <Button disabled className="w-full rounded-full opacity-60">Out of Stock</Button>
                              )}
                         </div>

                         <p className="text-xs text-muted-foreground">
                              Sold by <span className="font-medium text-foreground">{medicine.seller.name}</span>
                              {medicine.seller.phone && ` · ${medicine.seller.phone}`}
                         </p>
                    </div>
               </div>

               {/* ── Reviews ── */}
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
                         <Card className="text-center py-12 text-muted-foreground border rounded-xl">
                              <Star className="w-10 h-10 mx-auto opacity-20 mb-2" />
                              <p>No reviews yet for this medicine.</p>
                         </Card>
                    ) : (
                         <Card className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
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
                                                            {review.isVerifiedPurchase && <BadgeCheck className="w-3.5 h-3.5 text-green-500" />}
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
                                                       <Star key={s} className={`w-3.5 h-3.5 ${s <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"}`} />
                                                  ))}
                                             </div>
                                        </div>
                                        {review.title && <p className="font-semibold text-sm">{review.title}</p>}
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">"{review.comment}"</p>
                                   </div>
                              ))}
                         </Card>
                    )}
               </div>
          </div>
     );
}