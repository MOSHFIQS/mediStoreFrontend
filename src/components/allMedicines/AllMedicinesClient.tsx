"use client";

import { useState, useMemo } from "react";
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
import { createReviewAction } from "@/actions/review.action";
import { useAuth } from "@/context/AuthProvider";

export default function AllMedicinesClient({ initialMedicines, categories }: any) {
     const router = useRouter();
     const pathname = usePathname();
     const searchParams = useSearchParams();
     const queryClient = useQueryClient();

     const [reviewOpen, setReviewOpen] = useState<string | null>(null);
     const [rating, setRating] = useState(5);
     const [comment, setComment] = useState("");
     const [isSubmitting, setIsSubmitting] = useState(false);

     // Filters only for /medicines
     const [search, setSearch] = useState("");
     const [selectedCategory, setSelectedCategory] = useState<string>("all");
     const [selectedPrice, setSelectedPrice] = useState<string>("all");
     const { user } = useAuth()

     const { data: cart = [] } = useQuery({
          queryKey: ["cart"],
          queryFn: () => Promise.resolve(getCart()),
     });

     const handleReviewSubmit = async (medicineId: string) => {

          if (!user) {
               router.push('/login')
               return
          }

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

     // Price ranges for dropdown
     const priceRanges = [
          { label: "All", value: "all" },
          { label: "0 - 100 tk", value: "0-100" },
          { label: "101 - 500 tk", value: "101-500" },
          { label: "501+ tk", value: "501+" },
     ];

     const filteredMedicines = useMemo(() => {
          return initialMedicines.filter((med: any) => {
               const matchesSearch = med.name.toLowerCase().includes(search.toLowerCase());

               const matchesCategory = selectedCategory === "all" || med.categoryId === selectedCategory;

               let matchesPrice = true;
               if (selectedPrice !== "all") {
                    const [min, max] = selectedPrice.split("-").map(Number);
                    if (max) {
                         matchesPrice = med.price >= min && med.price <= max;
                    } else {
                         matchesPrice = med.price >= min;
                    }
               }

               return matchesSearch && matchesCategory && matchesPrice;
          });
     }, [initialMedicines, search, selectedCategory, selectedPrice]);

     const medicinesToShow = pathname === "/" ? filteredMedicines.slice(0, 8) : filteredMedicines;

     return (
          <div className="p-4">
               {
                    pathname === '/' &&
                    <div>
                         <h2 className="text-3xl font-bold mb-2 text-center">Wellness at Your Fingertips</h2>
                              <p className="text-gray-600 text-center mb-6"> Simple steps you can take today to improve your wellness and feel your best.</p>
                    </div>


               }
               {pathname === "/medicines" && (
                    <div className="mb-4 flex flex-wrap gap-4 items-end">
                         {/* Search */}
                         <div className="flex flex-col gap-2">
                              <Label>Search by name</Label>
                              <input
                                   type="text"
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                                   className="border rounded px-2 py-1"
                                   placeholder="Search..."
                              />
                         </div>

                         <div className="flex flex-col gap-2">
                              <Label>Category</Label>
                              <select
                                   value={selectedCategory}
                                   onChange={(e) => setSelectedCategory(e.target.value)}
                                   className="border rounded px-2 py-1"
                              >
                                   <option value="all">All</option>
                                   {categories?.map((cat: any) => (
                                        <option key={cat.id} value={cat.id}>
                                             {cat.name}
                                        </option>
                                   ))}
                              </select>
                         </div>

                         <div className="flex flex-col gap-2">
                              <Label>Price</Label>
                              <select
                                   value={selectedPrice}
                                   onChange={(e) => setSelectedPrice(e.target.value)}
                                   className="border rounded px-2 py-1"
                              >
                                   {priceRanges.map((range) => (
                                        <option key={range.value} value={range.value}>
                                             {range.label}
                                        </option>
                                   ))}
                              </select>
                         </div>

                         <Button onClick={() => { setSearch(""); setSelectedCategory("all"); setSelectedPrice("all"); }}>
                              Reset
                         </Button>
                    </div>
               )}

               <div
                    className={"grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"}
               >
                    {medicinesToShow.map((med: any) => {
                         const itemInCart = cart.find((i: any) => i.medicineId === med.id);

                         return (
                              <Card key={med.id} className="  overflow-hidden border border-gray-300 flex flex-col">


                                   <CardHeader className="px-4 ">
                                        <CardTitle className="text-lg font-semibold">{med.name}</CardTitle>
                                   </CardHeader>

                                   <div className="w-full h-48 flex justify-center items-center ">
                                        <img
                                             src={med.image || "https://i.ibb.co/gLGN1DHh/360-F-434728286-OWQQv-AFo-XZLd-GHl-Obozsol-Neu-Sxhpr84.jpg"}
                                             alt={med.name}
                                             className="max-h-full object-contain"
                                             onError={(e) => {
                                                  (e.currentTarget as HTMLImageElement).src =
                                                       "https://i.ibb.co/gLGN1DHh/360-F-434728286-OWQQv-AFo-XZLd-GHl-Obozsol-Neu-Sxhpr84.jpg";
                                             }}
                                        />
                                   </div>

                                   <CardContent className="px-4 pt-2 flex-1">
                                        <p className="text-sm text-gray-700 mb-2 line-clamp-3">{med.description}</p>
                                        <p className="font-medium text-gray-900">Price: {med.price} tk</p>
                                        <p className="text-sm text-gray-500">Stock: {med.stock}</p>
                                   </CardContent>

                                   <CardFooter className="px-4 py-3 flex gap-2 flex-wrap">
                                        <Button
                                             onClick={() => router.push(`/medicines/${med.id}`)}
                                             className="flex-1"
                                        >
                                             BUY
                                        </Button>

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
                                             className="flex-1"
                                        >
                                             Add To Cart {itemInCart ? `(${itemInCart.quantity})` : ""}
                                        </Button>

                                        <Dialog open={reviewOpen === med.id} onOpenChange={(o) => setReviewOpen(o ? med.id : null)}>
                                             <DialogTrigger asChild>
                                                  {user ? (
                                                       <Button variant="secondary" className="flex-1">
                                                            <MessageSquareText />
                                                       </Button>
                                                  ) : (
                                                       <Button
                                                            variant="secondary"
                                                            className="flex-1"
                                                            onClick={() => {
                                                                 router.push('/login');
                                                                 toast.error("Please Login to Submit a Review");
                                                            }}
                                                       >
                                                            <MessageSquareText />
                                                       </Button>
                                                  )}
                                             </DialogTrigger>


                                             <DialogContent>
                                                  <DialogHeader>
                                                       <DialogTitle>Review for {med.name}</DialogTitle>
                                                  </DialogHeader>

                                                  <Label>Rating</Label>
                                                  <div className="flex gap-1 mb-2">
                                                       {[1, 2, 3, 4, 5].map((star) => (
                                                            <button key={star} onClick={() => setRating(star)}>
                                                                 <Star
                                                                      className={
                                                                           star <= rating
                                                                                ? "fill-yellow-400 text-yellow-400"
                                                                                : "text-gray-300"
                                                                      }
                                                                 />
                                                            </button>
                                                       ))}
                                                  </div>

                                                  <Textarea
                                                       value={comment}
                                                       onChange={(e) => setComment(e.target.value)}
                                                       placeholder="Write your review..."
                                                       className="mb-2"
                                                  />

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
