"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { medicineService } from "@/service/medicine.service";
import { orderService } from "@/service/order.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthProvider";

interface Medicine {
     id: string;
     name: string;
     description: string;
     price: number;
     stock: number;
     image?: string;
}

export default function MedicineDetailsPage() {
     const { id } = useParams();
     const router = useRouter();
     const medicineId = id as string
     const {user} = useAuth()

     const [quantity, setQuantity] = useState(1);
     const [address, setAddress] = useState("");

     const pathname = usePathname()
     console.log(pathname);





     const { data: medicine, isLoading } = useQuery<Medicine>({
          queryKey: ["medicine", id],
          queryFn: async () => {
               const res = await medicineService.getById(id as string);
               if (!res.ok) throw new Error(res.message);
               return res.data.data;
          },
          enabled: !!id,
     });


     const { mutate: createOrder, isPending } = useMutation({
          mutationFn: async () => {
               if (!user) throw new Error("Login required to create an order");

               if (!address) throw new Error("Address is required");

               const res = await orderService.create({
                    address,
                    items: [
                         {
                              medicineId, 
                              quantity,
                         },
                    ],
               });

               if (!res.ok) throw new Error(res.message);

               return res;
          },

          onSuccess: () => {
               toast.success("Order placed successfully!");
               router.push("/medicines");
          },

          onError: (err: any) => {
               toast.error(err.message || "Order failed");
          },
     });

     if (isLoading) return <p className="p-4">Loading...</p>;
     if (!medicine) return <p className="p-4">Medicine not found</p>;

     return (
          <div className="max-w-5xl mx-auto p-6">
               <Card className="grid md:grid-cols-2 gap-6 p-4">
                    {/* Image */}
                    <img
                         src={
                              medicine.image ||
                              "https://i.ibb.co/whX8gJjd/medicine-capsule-medical-pills-illustration-png.png"
                         }
                         alt={medicine.name}
                         className="w-full h-80 object-contain rounded-lg"
                    />

                    {/* Info */}
                    <div>
                         <CardHeader>
                              <CardTitle className="text-2xl">{medicine.name}</CardTitle>
                         </CardHeader>

                         <CardContent className="space-y-3">
                              <p className="text-gray-600">{medicine.description}</p>
                              <p className="text-lg font-semibold">Price: {medicine.price} tk</p>
                              <p className="text-sm text-gray-500">
                                   Available Stock: {medicine.stock}
                              </p>

                              {/* Quantity */}
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

                              {/* Address */}
                              <div>
                                   <label className="text-sm font-medium">Delivery Address</label>
                                   <Input
                                        placeholder="Enter delivery address"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                   />
                              </div>

                              {/* Total */}
                              <p className="font-bold text-lg">
                                   Total: {medicine.price * quantity} tk
                              </p>

                              <Button
                                   className="w-full mt-2"
                                   disabled={!address || quantity < 1 || quantity > medicine.stock || isPending}
                                   onClick={() => createOrder()}
                              >
                                   {isPending ? "Placing Order..." : "Place Order"}
                              </Button>
                         </CardContent>
                    </div>
               </Card>
          </div>
     );
}
