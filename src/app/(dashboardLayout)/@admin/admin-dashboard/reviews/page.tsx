import { getAllReviewsAction } from "@/actions/review.action";
import AllReviews from "@/components/review/AllReviews";
import GlobalPagination from "@/components/shared/pagination/GlobalPagination";

export default async function ReviewsPage({ searchParams }: { searchParams: Promise<{ page?: number; limit?: number }> }) {
     const { page, limit } = await searchParams
     const res = await getAllReviewsAction(page, limit);
     console.log("reviews page",res);

     console.log(res);

     if (!res.ok) {
          return (
               <div className="flex items-center justify-center min-h-[40vh]">
                    <p className="text-red-500">{res.message || "Failed to load reviews"}</p>
               </div>
          );
     }

     return (
          <div className="space-y-6 h-full flex flex-col justify-between py-2">
               <AllReviews initialReviews={res?.data?.data ?? []} />;
               <GlobalPagination
                    page={res.data?.meta?.page}
                    totalPages={res?.data?.meta?.totalPages}
                    limit={res.data?.meta?.limit}
               />
          </div>
     )
}