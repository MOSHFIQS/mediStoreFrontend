import AllReviews from "@/components/review/AllReviews";
import { reviewServiceServer } from "@/service/review.server.service";

export default async function ReviewsPage() {
     const res = await reviewServiceServer.getAll();

     if (!res.ok) {
          return (
               <div className="flex items-center justify-center min-h-[40vh]">
                    <p className="text-red-500">{res.message || "Failed to load reviews"}</p>
               </div>
          );
     }

     return <AllReviews initialReviews={res?.data?.data ?? []} />;
}