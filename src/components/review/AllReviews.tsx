"use client";

import { useState } from "react";
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

interface Props {
     initialReviews: Review[];
}

export default function AllReviews({ initialReviews }: Props) {
     const [reviews] = useState<Review[]>(initialReviews);

     if (!reviews.length)
          return <p className="p-6 text-center text-muted-foreground">No reviews yet</p>;

     return (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
               {reviews.map((review) => (
                    <Card key={review.id} className=" hover:shadow-md transition">
                         <CardHeader className="flex flex-row items-center gap-3 pb-2">
                              <Avatar>
                                   <AvatarFallback>
                                        {review.user.name?.charAt(0).toUpperCase()}
                                   </AvatarFallback>
                              </Avatar>

                              <div className="flex flex-col">
                                   <span className="font-medium text-sm">{review.user.name}</span>
                                   <span className="text-xs text-muted-foreground">{review.medicine.name}</span>
                              </div>
                         </CardHeader>

                         <CardContent className="space-y-3">
                         
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

                              <p className="text-sm text-muted-foreground leading-relaxed">
                                   "{review.comment}"
                              </p>

                              <p className="text-xs text-right text-muted-foreground">
                                   {new Date(review.createdAt).toLocaleDateString()}
                              </p>
                         </CardContent>
                    </Card>
               ))}
          </div>
     );
}
