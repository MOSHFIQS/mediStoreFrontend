"use client";

import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { medicineService } from "@/service/medicine.service";
import { categoryService } from "@/service/category.service";
import { reviewService } from "@/service/review.service";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter } from "next/navigation";
import { Category } from "@/types/category.type";
import { addToCart, getCart } from "@/lib/cart";
import { toast } from "sonner";
import { MessageSquareText, Star } from "lucide-react";

export interface Medicine {
     id: string;
     name: string;
     description: string;
     price: number;
     stock: number;
     image?: string;
     categoryId?: string;
}

export default function AllMedicines() {
     const router = useRouter();
     const queryClient = useQueryClient();
     const pathname = usePathname();

     const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

     // ⭐ Review state
     const [reviewOpen, setReviewOpen] = useState<string | null>(null);
     const [rating, setRating] = useState(5);
     const [hover, setHover] = useState(0);
     const [comment, setComment] = useState("");

     const reviewMutation = useMutation({
          mutationFn: reviewService.create,
          onSuccess: () => {
               toast.success("Review submitted!");
               setComment("");
               setRating(5);
               setReviewOpen(null);
          },
          onError: () => toast.error("Failed to submit review"),
     });

     const { data: cart = [] } = useQuery({
          queryKey: ["cart"],
          queryFn: () => Promise.resolve(getCart()),
     });

     const { data: categories = [] } = useQuery<Category[], Error>({
          queryKey: ["categories"],
          queryFn: async () => {
               const res = await categoryService.getAll();
               if (!res.ok) throw new Error(res.message);
               return res.data.data;
          },
     });

     const { data: medicines = [], isLoading } = useQuery<Medicine[], Error>({
          queryKey: ["medicines", selectedCategory],
          queryFn: async () => {
               const params = selectedCategory ? { categoryId: selectedCategory } : {};
               const res = await medicineService.getAll(params);
               if (!res.ok) throw new Error(res.message);
               return res.data.data;
          },
     });

     if (isLoading) return <p>Loading...</p>;

     return (
          <div className="p-4">
               {pathname === "/medicines" && (
                    <div className="mb-4 flex flex-wrap gap-2">
                         <Button
                              variant={selectedCategory === null ? "default" : "outline"}
                              onClick={() => setSelectedCategory(null)}
                         >
                              All
                         </Button>
                         {categories.map((cat) => (
                              <Button
                                   key={cat.id}
                                   variant={selectedCategory === cat.id ? "default" : "outline"}
                                   onClick={() => setSelectedCategory(cat.id)}
                              >
                                   {cat.name}
                              </Button>
                         ))}
                    </div>
               )}

               {medicines.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                         {medicines.map((med) => {
                              const itemInCart = cart.find((i: any) => i.medicineId === med.id);

                              return (
                                   <Card key={med.id} className="shadow-md hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                             <CardTitle>{med.name}</CardTitle>
                                        </CardHeader>

                                        <img
                                             src={
                                                  med.image ||
                                                  "https://i.ibb.co.com/gLGN1DHh/360-F-434728286-OWQQv-AFo-XZLd-GHl-Obozsol-Neu-Sxhpr84.jpg"
                                             }
                                             alt={med.name}
                                             className="w-full h-48 object-contain rounded-md"
                                        />

                                        <CardContent>
                                             <p className="text-sm text-gray-600 mb-2">{med.description}</p>
                                             <p className="font-semibold">Price: {med.price}tk</p>
                                             <p className="text-gray-500">Stock: {med.stock} items</p>
                                        </CardContent>

                                        <CardFooter className="flex  gap-2">
                                             <Button
                                                  onClick={() => router.push(`/medicines/${med.id}`)}
                                                  variant="outline"
                                                  
                                             >
                                                  BUY
                                             </Button>

                                             <Button
                                                  onClick={() => {
                                                       addToCart({
                                                            medicineId: med.id,
                                                            quantity: 1,
                                                            price: med.price,
                                                            image:
                                                                 med.image ||
                                                                 "https://i.ibb.co.com/gLGN1DHh/360-F-434728286-OWQQv-AFo-XZLd-GHl-Obozsol-Neu-Sxhpr84.jpg",
                                                            name: med.name,
                                                       });
                                                       queryClient.invalidateQueries({ queryKey: ["cart"] });
                                                  }}
                                                  variant="outline"
                                                  disabled={(itemInCart?.quantity as number) >= med.stock}
                                             >
                                                  Add To Cart {itemInCart ? `(${itemInCart.quantity})` : ""}
                                             </Button>

                                             {/* ⭐ REVIEW DIALOG */}
                                             <Dialog open={reviewOpen === med.id} onOpenChange={(o) => setReviewOpen(o ? med.id : null)}>
                                                  <DialogTrigger asChild>
                                                       <Button variant="secondary" >
                                                            <MessageSquareText />
                                                       </Button>
                                                  </DialogTrigger>

                                                  <DialogContent>
                                                       <DialogHeader>
                                                            <DialogTitle>Review for {med.name}</DialogTitle>
                                                       </DialogHeader>

                                                       <div className="space-y-4">
                                                            <div>
                                                                 <Label className="mb-2 block">Rating</Label>
                                                                 <div className="flex gap-1">
                                                                      {[1, 2, 3, 4, 5].map((star) => (
                                                                           <button
                                                                                key={star}
                                                                                type="button"
                                                                                onClick={() => setRating(star)}
                                                                                onMouseEnter={() => setHover(star)}
                                                                                onMouseLeave={() => setHover(0)}
                                                                           >
                                                                                <Star
                                                                                     className={`h-6 w-6 transition ${star <= (hover || rating)
                                                                                               ? "fill-yellow-400 text-yellow-400"
                                                                                               : "text-gray-300"
                                                                                          }`}
                                                                                />
                                                                           </button>
                                                                      ))}
                                                                 </div>
                                                            </div>

                                                            <div>
                                                                 <Label>Comment</Label>
                                                                 <Textarea
                                                                      placeholder="Share your experience..."
                                                                      value={comment}
                                                                      onChange={(e) => setComment(e.target.value)}
                                                                 />
                                                            </div>

                                                            <Button
                                                                 className="w-full"
                                                                 onClick={() =>
                                                                      reviewMutation.mutate({
                                                                           medicineId: med.id,
                                                                           rating,
                                                                           comment,
                                                                      })
                                                                 }
                                                                 disabled={reviewMutation.isPending}
                                                            >
                                                                 Submit Review
                                                            </Button>
                                                       </div>
                                                  </DialogContent>
                                             </Dialog>
                                        </CardFooter>
                                   </Card>
                              );
                         })}
                    </div>
               )}
          </div>
     );
}
