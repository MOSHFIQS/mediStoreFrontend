"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { addToCart, getCart } from "@/lib/cart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquareText, Star } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createReviewAction } from "@/actions/review.server";

export default function AllMedicinesClient({ initialMedicines, categories }: any) {
     const router = useRouter();
     const pathname = usePathname();
     const searchParams = useSearchParams();
     const queryClient = useQueryClient();

     const [reviewOpen, setReviewOpen] = useState<string | null>(null);
     const [rating, setRating] = useState(5);
     const [comment, setComment] = useState("");
     const [isSubmitting, setIsSubmitting] = useState(false);

     const { data: cart = [] } = useQuery({
          queryKey: ["cart"],
          queryFn: () => Promise.resolve(getCart()),
     });

     const handleReviewSubmit = async (medicineId: string) => {
          setIsSubmitting(true);
          try {
               await createReviewAction({ medicineId, rating, comment });
               toast.success("Review submitted!");
               setComment("");
               setRating(5);
               setReviewOpen(null);
          } catch (err: any) {
               toast.error(err.message);
          } finally {
               setIsSubmitting(false);
          }
     };

     return (
          <div className="p-4">
               {/* CATEGORY FILTERS ONLY ON /medicines */}
               {pathname === "/medicines" && (
                    <div className="mb-4 flex flex-wrap gap-2">
                         <Button
                              variant={!searchParams.get("category") ? "default" : "outline"}
                              onClick={() => router.push("/medicines")}
                         >
                              All
                         </Button>

                         {categories?.map((cat: any) => (
                              <Button
                                   key={cat.id}
                                   variant={searchParams.get("category") === cat.id ? "default" : "outline"}
                                   onClick={() => router.push(`/medicines?category=${cat.id}`)}
                              >
                                   {cat.name}
                              </Button>
                         ))}
                    </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {initialMedicines?.map((med: any) => {
                         const itemInCart = cart.find((i: any) => i.medicineId === med.id);

                         return (
                              <Card key={med.id}>
                                   <CardHeader>
                                        <CardTitle>{med.name}</CardTitle>
                                   </CardHeader>

                                   <img src={med.image} alt={med.name} className="w-full h-48 object-contain" />

                                   <CardContent>
                                        <p>{med.description}</p>
                                        <p>Price: {med.price} tk</p>
                                        <p>Stock: {med.stock}</p>
                                   </CardContent>

                                   <CardFooter className="flex gap-2">
                                        <Button onClick={() => router.push(`/medicines/${med.id}`)}>BUY</Button>

                                        <Button
                                             onClick={() => {
                                                  addToCart({
                                                       medicineId: med.id,
                                                       quantity: 1,
                                                       price: med.price,
                                                       image: med.image,
                                                       name: med.name,
                                                  });
                                                  queryClient.invalidateQueries({ queryKey: ["cart"] });
                                                  toast.success("Added to cart");
                                             }}
                                             disabled={(itemInCart?.quantity as number) >= med.stock}
                                        >
                                             Add To Cart {itemInCart ? `(${itemInCart.quantity})` : ""}
                                        </Button>

                                        <Dialog open={reviewOpen === med.id} onOpenChange={(o) => setReviewOpen(o ? med.id : null)}>
                                             <DialogTrigger asChild>
                                                  <Button variant="secondary"><MessageSquareText /></Button>
                                             </DialogTrigger>

                                             <DialogContent>
                                                  <DialogHeader>
                                                       <DialogTitle>Review for {med.name}</DialogTitle>
                                                  </DialogHeader>

                                                  <Label>Rating</Label>
                                                  <div className="flex gap-1">
                                                       {[1, 2, 3, 4, 5].map((star) => (
                                                            <button key={star} onClick={() => setRating(star)}>
                                                                 <Star className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                                                            </button>
                                                       ))}
                                                  </div>

                                                  <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />

                                                  <Button
                                                       onClick={() => handleReviewSubmit(med.id)}
                                                       disabled={isSubmitting}
                                                       className="w-full"
                                                  >
                                                       Submit Review
                                                  </Button>
                                             </DialogContent>
                                        </Dialog>
                                   </CardFooter>
                              </Card>
                         );
                    })}
               </div>
          </div>
     );
}
