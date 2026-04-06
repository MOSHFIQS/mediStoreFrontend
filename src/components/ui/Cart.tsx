"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CartItem, getCart, saveCart, clearCart } from "@/lib/cart";
import { toast } from "sonner";
import { createCartOrderAction, initiatePaymentForOrderAction } from "@/actions/order.action";
import { validateCouponAction } from "@/actions/coupon.action";
import EmptyPage from "../emptyPage/EmptyPage";
import { useAuth } from "@/context/AuthProvider";
import { useState } from "react";
import Image from "next/image";
import { Tag, X } from "lucide-react";

export default function Cart() {
     const queryClient = useQueryClient();
     const { user } = useAuth();
     const [couponCode, setCouponCode] = useState("");
     const [couponDiscount, setCouponDiscount] = useState(0);
     const [couponApplied, setCouponApplied] = useState(false);
     const [couponLoading, setCouponLoading] = useState(false);
     const [isPlacing, setIsPlacing] = useState(false);

     const { data: cart = [] } = useQuery<CartItem[]>({
          queryKey: ["cart"],
          queryFn: () => Promise.resolve(getCart()),
     });

     const updateCart = (newCart: CartItem[]) => {
          saveCart(newCart);
          queryClient.invalidateQueries({ queryKey: ["cart"] });
     };

     const increment = (id: string) => {
          updateCart(cart.map((item) =>
               item.medicineId === id ? { ...item, quantity: item.quantity + 1 } : item
          ));
     };

     const decrement = (id: string) => {
          updateCart(cart.map((item) =>
               item.medicineId === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
          ));
     };

     const handleRemove = (id: string) => {
          updateCart(cart.filter((item) => item.medicineId !== id));
     };

     const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
     const total = Math.max(0, subtotal - couponDiscount);

     const handleApplyCoupon = async () => {
          if (!couponCode.trim()) return;
          setCouponLoading(true);
          try {
               const result = await validateCouponAction(couponCode.trim(), subtotal);
               setCouponDiscount(result.discount);
               setCouponApplied(true);
               toast.success(`Coupon applied! You save ৳${result.discount.toFixed(2)}`);
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

     const form = useForm({
          defaultValues: { address: "" },
          onSubmit: async ({ value }) => {
               if (!user) return toast.error("Please log in first");
               if (user.role !== "CUSTOMER") return toast.error("Only customers can place orders");
               if (!cart.length) return toast.error("Cart is empty");
               if (!value.address.trim()) return toast.error("Address is required");

               setIsPlacing(true);
               try {
                    // Step 1: Create order
                    const order = await createCartOrderAction({
                         address: value.address,
                         items: cart.map((item) => ({ medicineId: item.medicineId, quantity: item.quantity })),
                         couponCode: couponApplied ? couponCode : undefined,
                    });

                    toast.loading("Redirecting to payment...");

                    // Step 2: Initiate SSLCommerz payment
                    const payment = await initiatePaymentForOrderAction(order.id);

                    // Step 3: Clear cart and redirect
                    clearCart();
                    queryClient.invalidateQueries({ queryKey: ["cart"] });

                    // Redirect to SSLCommerz gateway
                    window.location.href = payment.gatewayUrl;
               } catch (err: any) {
                    toast.error(err.message || "Order failed");
                    setIsPlacing(false);
               }
          },
     });

     return (
          <div className="p-4 space-y-6 max-w-3xl mx-auto">
               <h2 className="text-2xl font-bold">My Cart</h2>

               {cart.length === 0 ? (
                    <EmptyPage />
               ) : (
                    <>
                         {/* Cart Items */}
                         {cart.map((item) => (
                              <Card key={item.medicineId}>
                                   <CardContent className="flex gap-4 items-center p-4">
                                        <div className="relative w-20 h-20 flex-shrink-0">
                                             <Image
                                                  src={item.image || "/placeholder.png"}
                                                  alt={item.name}
                                                  fill
                                                  className="object-contain rounded-md"
                                             />
                                        </div>
                                        <div className="flex-1">
                                             <p className="font-semibold">{item.name}</p>
                                             <p className="text-sm text-muted-foreground">৳{item.price} each</p>
                                             <div className="flex items-center gap-2 mt-2">
                                                  <Button size="sm" variant="outline" onClick={() => decrement(item.medicineId)}>−</Button>
                                                  <span className="w-8 text-center font-medium">{item.quantity}</span>
                                                  <Button size="sm" variant="outline" onClick={() => increment(item.medicineId)}>+</Button>
                                             </div>
                                        </div>
                                        <div className="text-right">
                                             <p className="font-semibold">৳{(item.price * item.quantity).toFixed(2)}</p>
                                             <Button
                                                  size="sm"
                                                  variant="ghost"
                                                  className="text-red-500 hover:text-red-700 mt-1"
                                                  onClick={() => handleRemove(item.medicineId)}
                                             >
                                                  <X className="w-4 h-4" />
                                             </Button>
                                        </div>
                                   </CardContent>
                              </Card>
                         ))}

                         {/* Coupon */}
                         <Card>
                              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Tag className="w-4 h-4" />Apply Coupon</CardTitle></CardHeader>
                              <CardContent>
                                   {couponApplied ? (
                                        <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
                                             <span className="text-green-700 font-medium">
                                                  "{couponCode}" applied — you save ৳{couponDiscount.toFixed(2)}
                                             </span>
                                             <Button size="sm" variant="ghost" onClick={removeCoupon}>
                                                  <X className="w-4 h-4" />
                                             </Button>
                                        </div>
                                   ) : (
                                        <div className="flex gap-2">
                                             <Input
                                                  placeholder="Enter coupon code"
                                                  value={couponCode}
                                                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                  className="flex-1"
                                             />
                                             <Button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()}>
                                                  {couponLoading ? "Checking..." : "Apply"}
                                             </Button>
                                        </div>
                                   )}
                              </CardContent>
                         </Card>

                         {/* Address + Summary */}
                         <Card>
                              <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                              <CardContent className="space-y-4">
                                   {/* Price breakdown */}
                                   <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                             <span className="text-muted-foreground">Subtotal</span>
                                             <span>৳{subtotal.toFixed(2)}</span>
                                        </div>
                                        {couponDiscount > 0 && (
                                             <div className="flex justify-between text-green-600">
                                                  <span>Coupon discount</span>
                                                  <span>− ৳{couponDiscount.toFixed(2)}</span>
                                             </div>
                                        )}
                                        <div className="flex justify-between font-bold text-base border-t pt-2">
                                             <span>Total</span>
                                             <span>৳{total.toFixed(2)}</span>
                                        </div>
                                   </div>

                                   {/* Address */}
                                   <form
                                        id="cart-form"
                                        onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
                                   >
                                        <FieldGroup>
                                             <form.Field name="address">
                                                  {(field) => {
                                                       const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                                       return (
                                                            <Field data-invalid={isInvalid}>
                                                                 <FieldLabel htmlFor={field.name}>Delivery Address</FieldLabel>
                                                                 <Input
                                                                      id={field.name}
                                                                      value={field.state.value}
                                                                      onChange={(e) => field.handleChange(e.target.value)}
                                                                      placeholder="House 12, Road 3, Gulshan, Dhaka 1212"
                                                                      required
                                                                 />
                                                                 {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                            </Field>
                                                       );
                                                  }}
                                             </form.Field>
                                        </FieldGroup>
                                   </form>
                              </CardContent>
                              <CardFooter className="flex justify-between items-center gap-3">
                                   <Button
                                        variant="outline"
                                        onClick={() => { clearCart(); queryClient.invalidateQueries({ queryKey: ["cart"] }); }}
                                   >
                                        Clear Cart
                                   </Button>
                                   <Button form="cart-form" type="submit" disabled={isPlacing} className="flex-1">
                                        {isPlacing ? "Processing..." : `Pay ৳${total.toFixed(2)} via SSLCommerz`}
                                   </Button>
                              </CardFooter>
                         </Card>
                    </>
               )}
          </div>
     );
}