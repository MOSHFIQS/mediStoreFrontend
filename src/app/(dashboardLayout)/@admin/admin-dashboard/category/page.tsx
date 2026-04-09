
import { getAllCategoriesAction } from "@/actions/category.action";
import AllCategories from "@/components/allCategories/allCategories";
import GlobalPagination from "@/components/shared/pagination/GlobalPagination";

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ page?: number; limit?: number }> }) {
     const { page, limit } = await searchParams
     const res = await getAllCategoriesAction(page, limit);
     console.log(res);

     if (!res.ok) {
          return <p className="p-6 text-red-600">Failed to load categories</p>;
     }

     return (
          <div className="space-y-6 h-full flex flex-col justify-between py-2">
               <AllCategories initialCategories={res?.data?.data || []} />;
               <GlobalPagination
                    page={res.data?.meta?.page}
                    totalPages={res?.data?.meta?.totalPages}
                    limit={res.data?.meta?.limit}
               />
          </div>
     )

}
