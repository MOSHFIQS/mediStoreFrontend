"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, Trash2, BadgeCheck, ShieldAlert } from "lucide-react";
import { deleteReviewAction } from "@/actions/review.action";
import { useAuth } from "@/context/AuthProvider";

interface Review {
     id: string;
     rating: number;
     title?: string;
     comment: string;
     isVerifiedPurchase: boolean;
     createdAt: string;
     user: { id: string; name: string; image?: string };
     medicine: { id: string; name: string };
}

export default function AllReviews({ initialReviews }: { initialReviews: Review[] }) {
     const { user } = useAuth();
     const router = useRouter();
     const [reviews, setReviews] = useState<Review[]>(initialReviews);
     const [deletingId, setDeletingId] = useState<string | null>(null);
     const [filterRating, setFilterRating] = useState<number | "all">("all");

     const canDelete = (review: Review) =>
          user?.id === review.user.id || user?.role === "ADMIN";

     const handleDelete = async (id: string) => {
          if (!confirm("Delete this review? This cannot be undone.")) return;
          setDeletingId(id);
          try {
               await deleteReviewAction(id);             // ← server action, not service directly
               setReviews((prev) => prev.filter((r) => r.id !== id));
               toast.success("Review deleted");
          } catch (err: any) {
               toast.error(err.message || "Failed to delete");
          } finally {
               setDeletingId(null);
          }
     };

     const avgRating = reviews.length
          ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
          : 0;

     const ratingCounts = [5, 4, 3, 2, 1].map((star) => ({
          star,
          count: reviews.filter((r) => r.rating === star).length,
     }));

     const filtered =
          filterRating === "all"
               ? reviews
               : reviews.filter((r) => r.rating === filterRating);

     if (!reviews.length) {
          return (
               <div className="flex flex-col items-center justify-center py-24 text-muted-foreground gap-3">
                    <Star className="w-14 h-14 opacity-20" />
                    <p className="text-lg font-medium">No reviews yet</p>
                    <p className="text-sm">Be the first to share your experience!</p>
               </div>
          );
     }

     return (
          <div className="max-w-6xl mx-auto p-4 space-y-8">
               <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">All Reviews</h1>
                    <span className="text-sm text-muted-foreground">{reviews.length} total</span>
               </div>

               {/* ── Summary card ───────────────────────────────── */}
               <Card className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6 items-center">

                         {/* Average score */}
                         <div className="text-center flex-shrink-0">
                              <p className="text-6xl font-bold leading-none">{avgRating.toFixed(1)}</p>
                              <div className="flex gap-0.5 justify-center mt-2">
                                   {[1, 2, 3, 4, 5].map((s) => (
                                        <Star
                                             key={s}
                                             className={`w-5 h-5 ${s <= Math.round(avgRating)
                                                  ? "fill-yellow-400 text-yellow-400"
                                                  : "text-gray-200"
                                                  }`}
                                        />
                                   ))}
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                   {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                              </p>
                         </div>

                         {/* Clickable breakdown bars */}
                         <div className="flex-1 w-full space-y-2">
                              {ratingCounts.map(({ star, count }) => (
                                   <button
                                        key={star}
                                        onClick={() => setFilterRating(filterRating === star ? "all" : star)}
                                        className={`flex items-center gap-2 text-sm w-full rounded-md px-2 py-1 transition
                  ${filterRating === star
                                                  ? "bg-yellow-50 ring-1 ring-yellow-300"
                                                  : "hover:bg-gray-50"
                                             }`}
                                   >
                                        <span className="w-3 text-right text-muted-foreground">{star}</span>
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                             <div
                                                  className="bg-yellow-400 h-full rounded-full transition-all duration-500"
                                                  style={{
                                                       width: reviews.length
                                                            ? `${(count / reviews.length) * 100}%`
                                                            : "0%",
                                                  }}
                                             />
                                        </div>
                                        <span className="w-5 text-xs text-muted-foreground text-left">{count}</span>
                                   </button>
                              ))}
                         </div>
                    </div>

                    {/* Active filter pill */}
                    {filterRating !== "all" && (
                         <div className="mt-4 flex items-center gap-2 border-t pt-4">
                              <span className="text-sm text-muted-foreground">Filtered by:</span>
                              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
                                   {filterRating}
                                   <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                              </span>
                              <button
                                   onClick={() => setFilterRating("all")}
                                   className="text-xs text-blue-600 hover:underline ml-1"
                              >
                                   Clear filter
                              </button>
                         </div>
                    )}
               </Card>

               {/* ── Review grid ────────────────────────────────── */}
               {filtered.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">
                         No {filterRating}★ reviews.
                    </p>
               ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                         {filtered.map((review) => (
                              <Card
                                   key={review.id}
                                   className="hover:shadow-md transition-shadow flex flex-col"
                              >
                                   <CardHeader className="flex flex-row items-center gap-3 pb-2">
                                        <Avatar className="w-10 h-10 flex-shrink-0">
                                             <AvatarImage src={review.user.image} />
                                             <AvatarFallback className="bg-purple-100 text-purple-700 font-semibold text-sm">
                                                  {review.user.name?.charAt(0).toUpperCase()}
                                             </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                             <div className="flex items-center gap-1">
                                                  <span className="font-medium text-sm truncate">
                                                       {review.user.name}
                                                  </span>
                                                  {review.isVerifiedPurchase && (
                                                       <BadgeCheck
                                                            className="w-3.5 h-3.5 text-green-500 flex-shrink-0"

                                                       />
                                                  )}
                                             </div>
                                             <button
                                                  onClick={() => router.push(`/medicines/${review.medicine.id}`)}
                                                  className="text-xs text-muted-foreground hover:text-purple-600 hover:underline truncate block text-left w-full"
                                             >
                                                  {review.medicine.name}
                                             </button>
                                        </div>

                                        {/* Delete: owner sees trash, admin sees shield+trash */}
                                        {canDelete(review) && (
                                             <Button
                                                  size="icon"
                                                  variant="ghost"
                                                  className={`w-7 h-7 flex-shrink-0 transition
                      ${user?.role === "ADMIN" && user?.id !== review.user.id
                                                            ? "text-orange-400 hover:text-orange-600 hover:bg-orange-50"
                                                            : "text-red-400 hover:text-red-600 hover:bg-red-50"
                                                       }`}
                                                  onClick={() => handleDelete(review.id)}
                                                  disabled={deletingId === review.id}
                                                  title={
                                                       user?.role === "ADMIN" && user?.id !== review.user.id
                                                            ? "Remove as admin"
                                                            : "Delete your review"
                                                  }
                                             >
                                                  {deletingId === review.id ? (
                                                       <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin block" />
                                                  ) : user?.role === "ADMIN" && user?.id !== review.user.id ? (
                                                       <ShieldAlert className="w-3.5 h-3.5" />
                                                  ) : (
                                                       <Trash2 className="w-3.5 h-3.5" />
                                                  )}
                                             </Button>
                                        )}
                                   </CardHeader>

                                   <CardContent className="space-y-2 flex-1 flex flex-col">
                                        {/* Stars */}
                                        <div className="flex gap-0.5">
                                             {[1, 2, 3, 4, 5].map((star) => (
                                                  <Star
                                                       key={star}
                                                       className={`h-4 w-4 ${star <= review.rating
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-200"
                                                            }`}
                                                  />
                                             ))}
                                        </div>

                                        {/* Title */}
                                        {review.title && (
                                             <p className="font-semibold text-sm">{review.title}</p>
                                        )}

                                        {/* Comment */}
                                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4 flex-1">
                                             "{review.comment}"
                                        </p>

                                        {/* Footer row */}
                                        <div className="flex items-center justify-between pt-2 border-t">
                                             <div>
                                                  {review.isVerifiedPurchase && (
                                                       <span className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                                                            <BadgeCheck className="w-3 h-3" /> Verified purchase
                                                       </span>
                                                  )}
                                             </div>
                                             <p className="text-xs text-muted-foreground">
                                                  {new Date(review.createdAt).toLocaleDateString("en-GB", {
                                                       day: "numeric",
                                                       month: "short",
                                                       year: "numeric",
                                                  })}
                                             </p>
                                        </div>
                                   </CardContent>
                              </Card>
                         ))}
                    </div>
               )}
          </div>
     );
}