"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { CartItem, getCart, saveCart, clearCart } from "@/lib/cart";
import { createCartOrderAction, initiatePaymentForOrderAction } from "@/actions/order.action";
import { validateCouponAction } from "@/actions/coupon.action";
import { createAddressAction } from "@/actions/address.action";
import EmptyPage from "../emptyPage/EmptyPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AppImage } from "../shared/image/AppImage";
import {
     Tag, X, Plus, Minus, ShoppingBag, MapPin,
     CreditCard, Trash2, CheckCircle2, Package,
     AlertCircle, Star, PlusCircle
} from "lucide-react";

export interface Address {
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

export default function Cart({ addresses }: { addresses: Address[] }) {
     const queryClient = useQueryClient();
     const { user } = useAuth();
     const router = useRouter();

     // ── Step ──────────────────────────────────────────────
     const [step, setStep] = useState<"cart" | "checkout">("cart");

     // ── Coupon ────────────────────────────────────────────
     const [couponCode, setCouponCode] = useState("");
     const [couponDiscount, setCouponDiscount] = useState(0);
     const [couponApplied, setCouponApplied] = useState(false);
     const [couponLoading, setCouponLoading] = useState(false);

     // ── Address ───────────────────────────────────────────
     const defaultAddr = addresses.find((a) => a.isDefault) ?? addresses[0] ?? null;
     const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
          defaultAddr?.id ?? null
     );
     const [useNewAddress, setUseNewAddress] = useState(addresses.length === 0);
     const [newAddress, setNewAddress] = useState<NewAddressForm>({
          label: "",
          line1: "",
          line2: "",
          city: "",
          district: "",
          postalCode: "",
     });
     const [saveNewAddress, setSaveNewAddress] = useState(false);

     // ── Misc ──────────────────────────────────────────────
     const [notes, setNotes] = useState("");
     const [isPlacing, setIsPlacing] = useState(false);

     // ── Cart data ─────────────────────────────────────────
     const { data: cart = [] } = useQuery<CartItem[]>({
          queryKey: ["cart"],
          queryFn: () => Promise.resolve(getCart()),
     });

     // ── Cart helpers ──────────────────────────────────────
     const updateCart = (next: CartItem[]) => {
          saveCart(next);
          queryClient.invalidateQueries({ queryKey: ["cart"] });
     };

     const increment = (id: string) =>
          updateCart(cart.map((i) => i.medicineId === id ? { ...i, quantity: i.quantity + 1 } : i));

     const decrement = (id: string) =>
          updateCart(cart.map((i) => i.medicineId === id ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i));

     const handleRemove = (id: string) =>
          updateCart(cart.filter((i) => i.medicineId !== id));

     // ── Totals ────────────────────────────────────────────
     const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
     const shippingFee = subtotal >= 500 ? 0 : 60;
     const total = Math.max(0, subtotal + shippingFee - couponDiscount);
     const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

     // ── Coupon ────────────────────────────────────────────
     const handleApplyCoupon = async () => {
          if (!couponCode.trim()) return;
          setCouponLoading(true);
          try {
               const result = await validateCouponAction(couponCode.trim(), subtotal);
               if (!result.ok) throw new Error(result.message);
               setCouponDiscount(result.data.discount);
               setCouponApplied(true);
               toast.success(`Coupon applied! You save ৳${result.data.discount.toFixed(2)}`);
          } catch (err: any) {
               toast.error(err.message || "Invalid coupon");
               setCouponDiscount(0);
               setCouponApplied(false);
          } finally {
               setCouponLoading(false);
          }
     };

     const removeCoupon = () => {
          setCouponCode("");
          setCouponDiscount(0);
          setCouponApplied(false);
     };

     // ── Place order ───────────────────────────────────────
     const handlePlaceOrder = async () => {
          if (!user) { toast.error("Please log in first"); router.push("/login"); return; }
          if (user.role !== "CUSTOMER") { toast.error("Only customers can place orders"); return; }
          if (!cart.length) { toast.error("Cart is empty"); return; }

          const isUsingNew = useNewAddress || addresses.length === 0;

          if (isUsingNew && !newAddress.line1.trim()) {
               toast.error("Please enter a delivery address");
               return;
          }
          if (!isUsingNew && !selectedAddressId) {
               toast.error("Please select a delivery address");
               return;
          }

          setIsPlacing(true);
          const toastId = toast.loading("Placing order...");

          try {
               // Optionally save new address first
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

               // Step 1 — create order
               const order = await createCartOrderAction({
                    items: cart.map((i) => ({ medicineId: i.medicineId, quantity: i.quantity })),
                    ...(isUsingNew
                         ? {
                              addressSnapshot: {
                                   label: newAddress.label || undefined,
                                   line1: newAddress.line1,
                                   line2: newAddress.line2 || undefined,
                                   city: newAddress.city,
                                   district: newAddress.district,
                                   postalCode: newAddress.postalCode || undefined,
                              },
                         }
                         : { addressId: selectedAddressId! }
                    ),
                    couponCode: couponApplied ? couponCode : undefined,
                    notes: notes.trim() || undefined,
                    shippingFee,
               });

               if (!order.ok) throw new Error(order.message);

               toast.loading("Redirecting to payment gateway...", { id: toastId });

               // Step 2 — initiate payment
               const payment = await initiatePaymentForOrderAction(order.data.id);

               if (!payment.ok) throw new Error(payment.message);

               // Step 3 — clear cart + redirect
               clearCart();
               queryClient.invalidateQueries({ queryKey: ["cart"] });
               toast.success("Redirecting to SSLCommerz...", { id: toastId });

               window.location.href = payment.data.gatewayUrl;
          } catch (err: any) {
               toast.error(err.message || "Order failed", { id: toastId });
               setIsPlacing(false);
          }
     };

     if (!cart.length) return <EmptyPage />;

     return (
          <div className="max-w-5xl mx-auto px-4 py-6">

               {/* ── Header ── */}
               <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                         <ShoppingBag className="w-6 h-6 text-purple-500" />
                         My Cart
                         <span className="text-base font-normal text-muted-foreground">
                              ({totalItems} item{totalItems !== 1 ? "s" : ""})
                         </span>
                    </h1>
                    <Button
                         variant="ghost" size="sm"
                         className="text-red-500 hover:text-red-700 hover:bg-red-50"
                         onClick={() => { clearCart(); queryClient.invalidateQueries({ queryKey: ["cart"] }); }}
                    >
                         <Trash2 className="w-4 h-4 mr-1" /> Clear all
                    </Button>
               </div>

               {/* ── Step tabs ── */}
               <div className="flex items-center gap-2 mb-6 text-sm">
                    <button
                         onClick={() => setStep("cart")}
                         className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition font-medium
            ${step === "cart" ? "bg-purple-100 text-purple-700" : "text-muted-foreground hover:text-foreground"}`}
                    >
                         <Package className="w-3.5 h-3.5" /> Review Cart
                    </button>
                    <span className="text-muted-foreground">→</span>
                    <button
                         onClick={() => cart.length && setStep("checkout")}
                         className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition font-medium
            ${step === "checkout" ? "bg-purple-100 text-purple-700" : "text-muted-foreground hover:text-foreground"}`}
                    >
                         <CreditCard className="w-3.5 h-3.5" /> Checkout
                    </button>
               </div>

               <div className="grid lg:grid-cols-3 gap-6">

                    {/* ── Left column ── */}
                    <div className="lg:col-span-2 space-y-3">

                         {step === "cart" ? (
                              <>
                                   {/* Cart items */}
                                   {cart.map((item) => (
                                        <Card key={item.medicineId} className="overflow-hidden">
                                             <CardContent className="p-4 flex gap-4 items-center">
                                                  <div className="w-20 h-20 rounded-xl border overflow-hidden flex-shrink-0 bg-gray-50">
                                                       <AppImage
                                                            src={item.image} alt={item.name}
                                                            width={80} height={80}
                                                            className="object-cover w-full h-full"
                                                       />
                                                  </div>
                                                  <div className="flex-1 min-w-0">
                                                       <p className="font-semibold truncate">{item.name}</p>
                                                       <p className="text-sm text-muted-foreground">৳{item.price} each</p>
                                                       <div className="flex items-center gap-1 mt-2">
                                                            <button
                                                                 onClick={() => decrement(item.medicineId)}
                                                                 disabled={item.quantity <= 1}
                                                                 className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100 disabled:opacity-40 transition"
                                                            >
                                                                 <Minus className="w-3 h-3" />
                                                            </button>
                                                            <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                                            <button
                                                                 onClick={() => increment(item.medicineId)}
                                                                 className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100 transition"
                                                            >
                                                                 <Plus className="w-3 h-3" />
                                                            </button>
                                                       </div>
                                                  </div>
                                                  <div className="text-right flex-shrink-0">
                                                       <p className="font-bold">৳{(item.price * item.quantity).toFixed(2)}</p>
                                                       <button
                                                            onClick={() => handleRemove(item.medicineId)}
                                                            className="mt-2 text-red-400 hover:text-red-600 transition"
                                                       >
                                                            <X className="w-4 h-4" />
                                                       </button>
                                                  </div>
                                             </CardContent>
                                        </Card>
                                   ))}

                                   {/* Shipping nudge */}
                                   {subtotal < 500 ? (
                                        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700">
                                             <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                             Add ৳{(500 - subtotal).toFixed(2)} more for free shipping!
                                        </div>
                                   ) : (
                                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700">
                                             <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                             You qualify for free shipping!
                                        </div>
                                   )}

                                   <Button
                                        className="w-full rounded-full bg-purple-600 hover:bg-purple-700 h-11"
                                        onClick={() => setStep("checkout")}
                                   >
                                        Proceed to Checkout →
                                   </Button>
                              </>

                         ) : (
                              /* ── Checkout step ── */
                              <Card>
                                   <CardHeader>
                                        <CardTitle className="flex items-center gap-2 text-base">
                                             <MapPin className="w-4 h-4 text-purple-500" /> Delivery Address
                                        </CardTitle>
                                   </CardHeader>

                                   <CardContent className="space-y-4">

                                        {/* Saved addresses */}
                                        {addresses.length > 0 && (
                                             <div className="space-y-2">
                                                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                                                       Saved addresses
                                                  </p>
                                                  {addresses.map((addr) => (
                                                       <div
                                                            key={addr.id}
                                                            onClick={() => { setSelectedAddressId(addr.id); setUseNewAddress(false); }}
                                                            className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition
                          ${selectedAddressId === addr.id && !useNewAddress
                                                                      ? "border-purple-400 bg-purple-50"
                                                                      : "border-gray-200 hover:border-gray-300"
                                                                 }`}
                                                       >
                                                            {/* Radio dot */}
                                                            <div className={`w-4 h-4 rounded-full border-2 mt-0.5 flex-shrink-0 transition
                          ${selectedAddressId === addr.id && !useNewAddress
                                                                      ? "border-purple-500 bg-purple-500"
                                                                      : "border-gray-300"
                                                                 }`}
                                                            />
                                                            <div className="flex-1 min-w-0">
                                                                 <div className="flex items-center gap-2 flex-wrap">
                                                                      {addr.label && (
                                                                           <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded">
                                                                                {addr.label}
                                                                           </span>
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
                                                       </div>
                                                  ))}

                                                  {/* Toggle new address */}
                                                  <button
                                                       onClick={() => {
                                                            setUseNewAddress(!useNewAddress);
                                                            setSelectedAddressId(null);
                                                       }}
                                                       className={`flex items-center gap-2 w-full p-3 rounded-xl border-2 text-sm transition
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

                                        {/* New address fields */}
                                        {(useNewAddress || addresses.length === 0) && (
                                             <div className="space-y-3 border p-3 rounded">
                                                  <Input
                                                       placeholder="Label (Home, Office)"
                                                       value={newAddress.label}
                                                       onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                                  />
                                                  <Input
                                                       placeholder="Address Line 1 *"
                                                       value={newAddress.line1}
                                                       onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                                                  />
                                                  <Input
                                                       placeholder="Address Line 2"
                                                       value={newAddress.line2}
                                                       onChange={(e) => setNewAddress({ ...newAddress, line2: e.target.value })}
                                                  />
                                                  <Input
                                                       placeholder="City"
                                                       value={newAddress.city}
                                                       onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                  />
                                                  <Input
                                                       placeholder="District"
                                                       value={newAddress.district}
                                                       onChange={(e) => setNewAddress({ ...newAddress, district: e.target.value })}
                                                  />
                                                  <Input
                                                       placeholder="Postal Code"
                                                       value={newAddress.postalCode}
                                                       onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                                  />

                                                  <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                                                       <input
                                                            type="checkbox"
                                                            checked={saveNewAddress}
                                                            onChange={(e) => setSaveNewAddress(e.target.checked)}
                                                            className="w-4 h-4 rounded accent-purple-600"
                                                       />
                                                       Save this address for future orders
                                                  </label>
                                             </div>
                                        )}

                                        {/* Notes */}
                                        <div className="space-y-1">
                                             <label className="text-sm font-medium">
                                                  Order Notes{" "}
                                                  <span className="text-muted-foreground font-normal">(optional)</span>
                                             </label>
                                             <Input
                                                  value={notes}
                                                  onChange={(e) => setNotes(e.target.value)}
                                                  placeholder="Any special delivery instructions..."
                                             />
                                        </div>

                                        {/* Payment info box */}
                                        <div className="bg-gray-50 rounded-xl p-4 space-y-1.5">
                                             <p className="text-sm font-medium flex items-center gap-1.5">
                                                  <CreditCard className="w-4 h-4 text-purple-500" />
                                                  Payment via SSLCommerz
                                             </p>
                                             <p className="text-xs text-muted-foreground">
                                                  Accepts bKash, Nagad, Rocket, VISA, Mastercard, and all major banks.
                                                  You'll be redirected to the secure gateway after placing your order.
                                             </p>
                                        </div>
                                   </CardContent>

                                   <CardFooter className="gap-3 border-t pt-4">
                                        <Button
                                             variant="outline"
                                             onClick={() => setStep("cart")}
                                             className="rounded-full"
                                        >
                                             ← Back
                                        </Button>
                                        <Button
                                             onClick={handlePlaceOrder}
                                             disabled={isPlacing}
                                             className="flex-1 rounded-full bg-purple-600 hover:bg-purple-700 h-11"
                                        >
                                             {isPlacing ? (
                                                  <span className="flex items-center gap-2">
                                                       <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                       Processing...
                                                  </span>
                                             ) : (
                                                  <span className="flex items-center gap-2">
                                                       <CreditCard className="w-4 h-4" />
                                                       Pay ৳{total.toFixed(2)} via SSLCommerz
                                                  </span>
                                             )}
                                        </Button>
                                   </CardFooter>
                              </Card>
                         )}
                    </div>

                    {/* ── Right: order summary ── */}
                    <div className="space-y-4">

                         {/* Coupon */}
                         <Card>
                              <CardHeader className="pb-3">
                                   <CardTitle className="text-sm flex items-center gap-2">
                                        <Tag className="w-4 h-4 text-purple-500" /> Coupon Code
                                   </CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0">
                                   {couponApplied ? (
                                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-3 py-2.5">
                                             <div>
                                                  <p className="text-xs font-bold text-green-700">{couponCode}</p>
                                                  <p className="text-xs text-green-600">−৳{couponDiscount.toFixed(2)} saved</p>
                                             </div>
                                             <button onClick={removeCoupon} className="text-green-600 hover:text-green-800">
                                                  <X className="w-4 h-4" />
                                             </button>
                                        </div>
                                   ) : (
                                        <div className="flex gap-2">
                                             <Input
                                                  placeholder="SAVE20"
                                                  value={couponCode}
                                                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                  className="flex-1 text-sm h-9"
                                             />
                                             <Button
                                                  size="sm"
                                                  onClick={handleApplyCoupon}
                                                  disabled={couponLoading || !couponCode.trim()}
                                                  className="h-9"
                                             >
                                                  {couponLoading ? "..." : "Apply"}
                                             </Button>
                                        </div>
                                   )}
                              </CardContent>
                         </Card>

                         {/* Price summary */}
                         <Card>
                              <CardHeader className="pb-3">
                                   <CardTitle className="text-sm">Order Summary</CardTitle>
                              </CardHeader>
                              <CardContent className="pt-0 space-y-2.5 text-sm">

                                   {/* Line items */}
                                   <div className="space-y-1 pb-2 border-b">
                                        {cart.map((item) => (
                                             <div key={item.medicineId} className="flex justify-between text-muted-foreground">
                                                  <span className="truncate flex-1 pr-2">
                                                       {item.name}
                                                       <span className="text-xs ml-1">×{item.quantity}</span>
                                                  </span>
                                                  <span>৳{(item.price * item.quantity).toFixed(2)}</span>
                                             </div>
                                        ))}
                                   </div>

                                   <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span>৳{subtotal.toFixed(2)}</span>
                                   </div>

                                   <div className="flex justify-between text-muted-foreground">
                                        <span>Shipping</span>
                                        <span className={shippingFee === 0 ? "text-green-600 font-medium" : ""}>
                                             {shippingFee === 0 ? "Free" : `৳${shippingFee}`}
                                        </span>
                                   </div>

                                   {couponDiscount > 0 && (
                                        <div className="flex justify-between text-green-600">
                                             <span>Coupon ({couponCode})</span>
                                             <span>−৳{couponDiscount.toFixed(2)}</span>
                                        </div>
                                   )}

                                   <Separator />

                                   <div className="flex justify-between font-bold text-base">
                                        <span>Total</span>
                                        <span className="text-purple-600">৳{total.toFixed(2)}</span>
                                   </div>

                                   <p className="text-xs text-muted-foreground text-center pt-1">
                                        Inclusive of all taxes
                                   </p>
                              </CardContent>
                         </Card>

                         {/* Security note */}
                         <div className="text-xs text-center text-muted-foreground space-y-1">
                              <p>🔒 Secured by SSLCommerz</p>
                              <p>Your payment info is encrypted and never stored</p>
                         </div>
                    </div>
               </div>
          </div>
     );
}