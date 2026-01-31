"use client";

import { Button } from "@/components/ui/button";
import {
     Card,
     CardHeader,
     CardTitle,
     CardContent,
     CardFooter,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "@tanstack/react-form";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { CartItem, getCart, saveCart, clearCart } from "@/lib/cart";
import { orderService } from "@/service/order.service";
import { toast } from "sonner";

export default function Cart() {
     const queryClient = useQueryClient();

     // Cart query
     const { data: cart = [] } = useQuery<CartItem[]>({
          queryKey: ["cart"],
          queryFn: () => Promise.resolve(getCart()),
     });

     const updateCart = (newCart: CartItem[]) => {
          saveCart(newCart);
          queryClient.invalidateQueries({ queryKey: ["cart"] });
     };

     const increment = (id: string, stock: number) => {
          const newCart = cart.map((item) =>
               item.medicineId === id
                    ? { ...item, quantity: Math.min(stock, item.quantity + 1) }
                    : item
          );
          updateCart(newCart);
     };

     const decrement = (id: string) => {
          const newCart = cart.map((item) =>
               item.medicineId === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
          );
          updateCart(newCart);
     };

     const handleRemove = (id: string) => {
          const newCart = cart.filter((item) => item.medicineId !== id);
          updateCart(newCart);
     };

     // TanStack Form for address
     const form = useForm({
          defaultValues: {
               address: "",
          },
          onSubmit: async ({ value }) => {
               if (cart.length === 0) return toast.error("Cart is empty!");

               const payload = {
                    address: value.address,
                    items: cart.map((item) => ({
                         medicineId: item.medicineId,
                         quantity: item.quantity,
                    })),
               };

               try {
                    const res = await orderService.create(payload);
                    if (!res.ok) throw new Error(res.message);

                    toast.success("Order placed successfully!");
                    clearCart();
                    queryClient.invalidateQueries({ queryKey: ["cart"] });
                    form.reset();
               } catch (err: any) {
                    toast.error(err.message || "Order failed");
               }
          },
     });

     const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

     return (
          <div className="p-4 space-y-6">
               <h2 className="text-2xl font-bold">Your Cart</h2>

               {cart.length === 0 ? (
                    <p>Your cart is empty</p>
               ) : (
                    <>
                         {/* Cart Items */}
                         {cart.map((item) => (
                              <Card key={item.medicineId}>
                                   <CardHeader>
                                        <CardTitle>{item.name}</CardTitle>
                                   </CardHeader>
                                   <CardContent className="flex gap-4 items-center">
                                        <img
                                             src={item.image}
                                             alt={item.name}
                                             className="w-20 h-20 object-contain rounded-md"
                                        />
                                        <div className="flex-1">
                                             <p>Price: {item.price} tk</p>
                                             <div className="flex items-center gap-2 mt-2">
                                                  <Button size="sm" onClick={() => decrement(item.medicineId)}>
                                                       -
                                                  </Button>
                                                  <span>{item.quantity}</span>
                                                  <Button
                                                       size="sm"
                                                       onClick={() => increment(item.medicineId, 100)} // Replace 100 with real stock
                                                       disabled={item.quantity >= 100}
                                                  >
                                                       +
                                                  </Button>
                                             </div>
                                        </div>
                                        <Button size="sm" variant="destructive" onClick={() => handleRemove(item.medicineId)}>
                                             Remove
                                        </Button>
                                   </CardContent>
                              </Card>
                         ))}

                         {/* Address form */}
                         <Card>
                              <CardHeader>
                                   <CardTitle>Delivery Address</CardTitle>
                              </CardHeader>
                              <CardContent>
                                   <form
                                        id="cart-form"
                                        onSubmit={(e) => {
                                             e.preventDefault();
                                             form.handleSubmit();
                                        }}
                                   >
                                        <FieldGroup>
                                             <form.Field
                                                  name="address"
                                                  children={(field) => {
                                                       const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
                                                       return (
                                                            <Field data-invalid={isInvalid}>
                                                                 <FieldLabel htmlFor={field.name}>Address</FieldLabel>
                                                                 <Input
                                                                      id={field.name}
                                                                      value={field.state.value}
                                                                      onChange={(e) => field.handleChange(e.target.value)}
                                                                      placeholder="Example : House 12, Road 3, Gulshan, Dhaka 1212, Bangladesh"
                                                                      required
                                                                 />
                                                                 {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                            </Field>
                                                       );
                                                  }}
                                             />
                                        </FieldGroup>
                                   </form>
                              </CardContent>
                              <CardFooter className="flex justify-between items-center">
                                   <p className="font-bold">Total: {totalPrice} tk</p>
                                   <div className="flex gap-2">
                                        <Button
                                             type="button"
                                             variant="outline"
                                             onClick={() => {
                                                  clearCart();
                                                  queryClient.invalidateQueries({ queryKey: ["cart"] });
                                             }}
                                        >
                                             Clear Cart
                                        </Button>
                                        <Button form="cart-form" type="submit">
                                             Place Order
                                        </Button>
                                   </div>
                              </CardFooter>
                         </Card>
                    </>
               )}
          </div>
     );
}
