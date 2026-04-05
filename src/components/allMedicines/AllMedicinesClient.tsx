"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { addToCart, getCart } from "@/lib/cart";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MessageSquareText, Star } from "lucide-react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { createReviewAction } from "@/actions/review.action";
import { useAuth } from "@/context/AuthProvider";
import { Textarea } from "../ui/textarea";

export default function AllMedicinesClient({ initialMedicines, categories }: any) {
     const router = useRouter();
     const pathname = usePathname();
     const searchParams = useSearchParams();
     const queryClient = useQueryClient();

     const { user } = useAuth();

     const [reviewOpen, setReviewOpen] = useState<string | null>(null);
     const [rating, setRating] = useState(5);
     const [comment, setComment] = useState("");
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [search, setSearch] = useState("");

     const categoryFromUrl = searchParams.get("category") || "all";

     // Fetch cart data
     const { data: cart = [] } = useQuery({
          queryKey: ["cart"],
          queryFn: () => Promise.resolve(getCart()),
     });

     // Submit review
     const handleReviewSubmit = async (medicineId: string) => {
          if (!user) {
               router.push("/login");
               return;
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

     // Debounced auto-search and category URL update
     useEffect(() => {
          const timer = setTimeout(() => {
               const query = new URLSearchParams();

               if (categoryFromUrl && categoryFromUrl !== "all") {
                    query.set("category", categoryFromUrl);
               }

               if (search.trim()) {
                    query.set("search", search.trim());
               }

               const queryString = query.toString();
               router.push(queryString ? `/medicines?${queryString}` : "/medicines");
          }, 500); // 500ms debounce

          return () => clearTimeout(timer);
     }, [search, categoryFromUrl]);

     // Handle category button click
     const handleCategoryClick = (id: string) => {
          router.push(id === "all" ? "/medicines" : `/medicines?category=${id}`);
     };

     return (
          <div className="px-4">
               {pathname === "/" && (
                    <div>
                         <h2 className="text-3xl font-bold mb-2 text-center">
                              Wellness at Your Fingertips
                         </h2>
                         <p className="text-gray-600 text-center mb-6">
                              Simple steps you can take today to improve your wellness.
                         </p>
                    </div>
               )}
               {/* Search Input */}
               {pathname === "/medicines" && (
                    <div className="mb-4 flex flex-wrap gap-4 items-end">
                         <div className="flex flex-col gap-2">
                              <input
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                                   placeholder="Search medicines..."
                                   className="border rounded px-2 py-1"
                              />
                         </div>

                         <Button
                              onClick={() => {
                                   setSearch("");
                                   router.push("/medicines"); // reset search
                              }}
                         >
                              Reset
                         </Button>
                    </div>
               )}


               {/* Category Buttons */}
               {pathname === "/medicines" && (
                    <div className="flex flex-wrap gap-3 mb-4">
                         <button
                              className={`px-4 py-2 rounded-full font-medium transition ${categoryFromUrl === "all"
                                        ? "bg-purple-500 text-white"
                                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                   }`}
                              onClick={() => handleCategoryClick("all")}
                         >
                              All
                         </button>
                         {categories.map((cat: any) => (
                              <button
                                   key={cat.id}
                                   className={`px-4 py-2 rounded-full font-medium transition ${categoryFromUrl === cat.id
                                             ? "bg-purple-500 text-white"
                                             : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                        }`}
                                   onClick={() => handleCategoryClick(cat.id)}
                              >
                                   {cat.name}
                              </button>
                         ))}
                    </div>
               )}

               
               {/* Medicine Cards */}
               <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {initialMedicines.map((med: any) => {
                         const itemInCart = cart.find((i: any) => i.medicineId === med.id);

                         return (
                              <Card
                                   key={med.id}
                                   className="p-3 rounded-3xl border shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-3"
                              >
                                   {/* Image */}
                                   <div className="relative h-52 w-full overflow-hidden rounded-2xl group">
                                        <img
                                             src={
                                                  med.image ||
                                                  "https://i.ibb.co/gLGN1DHh/360-F-434728286-OWQQv-AFo-XZLd-GHl-Obozsol-Neu-Sxhpr84.jpg"
                                             }
                                             className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                                        <span
                                             className="absolute top-3 left-3 bg-white/80 backdrop-blur px-3 py-1 text-xs rounded-full cursor-pointer hover:bg-white"
                                             onClick={() => handleCategoryClick(med.categoryId)}
                                        >
                                             {categories?.find((c: any) => c.id === med.categoryId)?.name ||
                                                  "General"}
                                        </span>
                                        <span className="absolute top-3 right-3 bg-white/80 backdrop-blur px-3 py-1 text-xs rounded-full">
                                             {med.stock > 0 ? "In Stock" : "Out"}
                                        </span>
                                        <div className="absolute bottom-3 left-3 text-white font-bold text-lg">
                                             {med.price} tk
                                        </div>
                                   </div>

                                   {/* Content */}
                                   <CardContent className="px-2">
                                        <h3 className="font-semibold line-clamp-1">{med.name}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                             {med.description}
                                        </p>
                                   </CardContent>

                                   {/* Footer */}
                                   <CardFooter className="mt-auto pt-3">
                                        <div className="w-full flex items-center justify-between gap-3">
                                             <div className="flex flex-col">
                                                  <span className="text-lg font-bold text-gray-900">
                                                       {med.price} tk
                                                  </span>
                                                  <span className="text-xs text-gray-500">
                                                       {med.stock > 0 ? `${med.stock} available` : "Out of stock"}
                                                  </span>
                                             </div>

                                             <div className="flex items-center gap-2">
                                                  {/* Review */}
                                                  <Dialog
                                                       open={reviewOpen === med.id}
                                                       onOpenChange={(o) => setReviewOpen(o ? med.id : null)}
                                                  >
                                                       <DialogTrigger asChild>
                                                            <button className="h-10 w-10 flex items-center justify-center rounded-full border border-gray-200 hover:bg-gray-100 transition">
                                                                 <MessageSquareText className="w-4 h-4 text-gray-600" />
                                                            </button>
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
                                                            />

                                                            <Button
                                                                 onClick={() => handleReviewSubmit(med.id)}
                                                                 disabled={isSubmitting}
                                                                 className="w-full mt-2"
                                                            >
                                                                 Submit Review
                                                            </Button>
                                                       </DialogContent>
                                                  </Dialog>

                                                  {/* Add to Cart */}
                                                  <button
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
                                                       className={`
                        h-10 min-w-[40px] px-3 flex items-center justify-center gap-1
                        rounded-full text-sm font-medium transition-all duration-200
                        ${itemInCart
                                                                 ? "bg-green-500 text-white hover:bg-green-600"
                                                                 : "bg-gray-700 text-white hover:bg-black"
                                                            }
                        ${(itemInCart?.quantity as number) >= med.stock
                                                                 ? "opacity-50 cursor-not-allowed"
                                                                 : "hover:scale-105 active:scale-95"
                                                            }
                      `}
                                                  >
                                                       {itemInCart ? (
                                                            <>
                                                                 <span className="text-xs">Added</span>
                                                                 <span className="bg-white text-green-600 text-xs px-2 py-[2px] rounded-full font-semibold">
                                                                      {itemInCart.quantity}
                                                                 </span>
                                                            </>
                                                       ) : (
                                                            "+"
                                                       )}
                                                  </button>

                                                  {/* View */}
                                                  <button
                                                       onClick={() => router.push(`/medicines/${med.id}`)}
                                                       className="h-10 px-4 rounded-full bg-gray-700 text-white text-sm font-medium hover:scale-105 active:scale-95 transition"
                                                  >
                                                       View
                                                  </button>
                                             </div>
                                        </div>
                                   </CardFooter>
                              </Card>
                         );
                    })}
               </div>
          </div>
     );
}