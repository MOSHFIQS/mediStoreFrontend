import AllReviews from "@/components/review/AllReviews";
import { reviewServiceServer } from "@/service/review.server.service";


export default async function ReviewsPage() {
     const res = await reviewServiceServer.getAll();

     if (!res.ok) {
          return <p className="p-6 text-center text-red-600">{res.message}</p>;
     }

     return <AllReviews initialReviews={res?.data?.data} />;
}
