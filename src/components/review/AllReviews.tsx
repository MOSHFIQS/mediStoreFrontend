"use client";

import { useQuery } from "@tanstack/react-query";
import { reviewService } from "@/service/review.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface Review {
     id: string;
     rating: number;
     comment: string;
     createdAt: string;
     user: {
          name: string;
          email: string;
     };
     medicine: {
          name: string;
     };
}

export default function AllReviews() {
     const { data: reviews = [], isLoading } = useQuery<Review[]>({
          queryKey: ["reviews"],
          queryFn: async () => {
               const res = await reviewService.getAll();
               if (!res.ok) throw new Error(res.message);
               return res.data.data;
          },
     });

     if (isLoading) return <p className="p-6 text-center">Loading reviews...</p>;

     if (!reviews.length)
          return <p className="p-6 text-center text-muted-foreground">No reviews yet</p>;

     return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
               {reviews.map((review) => (
                    <Card
                         key={review.id}
                         className="rounded-2xl shadow-sm hover:shadow-md transition"
                    >
                         <CardHeader className="flex flex-row items-center gap-3 pb-2">
                              <Avatar>
                                   <AvatarFallback>
                                        {review.user.name?.charAt(0).toUpperCase()}
                                   </AvatarFallback>
                              </Avatar>

                              <div className="flex flex-col">
                                   <span className="font-medium text-sm">{review.user.name}</span>
                                   <span className="text-xs text-muted-foreground">
                                        {review.medicine.name}
                                   </span>
                              </div>
                         </CardHeader>

                         <CardContent className="space-y-3">
                              {/* ⭐ Rating */}
                              <div className="flex gap-1">
                                   {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                             key={star}
                                             className={`h-4 w-4 ${star <= review.rating
                                                       ? "fill-yellow-400 text-yellow-400"
                                                       : "text-gray-300"
                                                  }`}
                                        />
                                   ))}
                              </div>

                              {/* 💬 Comment */}
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                   "{review.comment}"
                              </p>

                              {/* 📅 Date */}
                              <p className="text-xs text-right text-muted-foreground">
                                   {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                         </CardContent>
                    </Card>
               ))}
          </div>
     );
}
