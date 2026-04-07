import { getAllReviewsAction } from "@/actions/review.action";
import AllReviews from "@/components/review/AllReviews";

export default async function ReviewsPage() {
     const res = await getAllReviewsAction();

     console.log(res);

     if (!res.ok) {
          return (
               <div className="flex items-center justify-center min-h-[40vh]">
                    <p className="text-red-500">{res.message || "Failed to load reviews"}</p>
               </div>
          );
     }

     return <AllReviews initialReviews={res?.data ?? []} />;
}