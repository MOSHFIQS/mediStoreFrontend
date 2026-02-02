"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createOrderAction } from "@/actions/order.action";

interface Medicine {
     id: string;
     name: string;
     description: string;
     price: number;
     stock: number;
     image?: string;
}

export default function MedicineDetailsClient({ medicine }: { medicine: Medicine }) {
     const router = useRouter();
     const [quantity, setQuantity] = useState(1);
     const [address, setAddress] = useState("");
     const [isPending, setIsPending] = useState(false);

     const handlePlaceOrder = async () => {
          setIsPending(true);
          try {
               await createOrderAction({
                    medicineId: medicine.id,
                    quantity,
                    address,
               });
               toast.success("Order placed successfully!");
               router.push("/medicines");
          } catch (err: any) {
               toast.error(err.message || "Order failed");
          } finally {
               setIsPending(false);
          }
     };

     return (
          <div className="max-w-5xl mx-auto p-6">
               <Card className="grid md:grid-cols-2 gap-6 p-4">
                    <img
                         src={
                              medicine.image ||
                              "https://i.ibb.co/whX8gJjd/medicine-capsule-medical-pills-illustration-png.png"
                         }
                         alt={medicine.name}
                         className="w-full h-80 object-contain rounded-lg"
                    />

                    <div>
                         <CardHeader>
                              <CardTitle className="text-2xl">{medicine.name}</CardTitle>
                         </CardHeader>

                         <CardContent className="space-y-3">
                              <p className="text-gray-600">{medicine.description}</p>
                              <p className="text-lg font-semibold">Price: {medicine.price} tk</p>
                              <p className="text-sm text-gray-500">Available Stock: {medicine.stock}</p>

                              <div>
                                   <label className="text-sm font-medium">Quantity</label>
                                   <Input
                                        type="number"
                                        min={1}
                                        max={medicine.stock}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                   />
                              </div>

                              <div>
                                   <label className="text-sm font-medium">Delivery Address</label>
                                   <Input
                                        placeholder="Enter delivery address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                   />
                              </div>

                              <p className="font-bold text-lg">Total: {medicine.price * quantity} tk</p>

                              <Button
                                   className="w-full mt-2"
                                   disabled={!address || quantity < 1 || quantity > medicine.stock || isPending}
                                   onClick={handlePlaceOrder}
                              >
                                   {isPending ? "Placing Order..." : "Place Order"}
                              </Button>
                         </CardContent>
                    </div>
               </Card>
          </div>
     );
}
