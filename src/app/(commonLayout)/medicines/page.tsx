
import AllMedicines from "@/components/medicine/AllMedicines";
import { getAllMedicinesAction } from "@/actions/medicine.action";
import { getAllCategoriesAction } from "@/actions/category.action";
import GlobalPagination from "@/components/shared/pagination/GlobalPagination";

export default async function AllMedicinesPage({ searchParams }: { searchParams: Promise<{ search?: string; categoryId?: string; page?: number; limit?: number }> }) {
     const { search, categoryId, page, limit } = await searchParams
     const searchText = search || "";

     const [medRes, catRes] = await Promise.all([
          getAllMedicinesAction(searchText, categoryId, page, limit),
          getAllCategoriesAction(),
     ]);

     console.log(medRes);
     console.log(catRes);

     if (!medRes.ok) return <p className="p-4">Failed to load medicines</p>;
     if (!catRes.ok) return <p className="p-4">Failed to load categories</p>;

     return (



          <div className="space-y-6 h-full flex flex-col justify-between ">
               <AllMedicines
                    initialMedicines={medRes.data?.data}
                    categories={catRes.data?.data || []}
               />

               <GlobalPagination
                    page={medRes.data?.meta?.page}
                    totalPages={medRes?.data?.meta?.totalPages}
                    limit={medRes.data?.meta?.limit}
               />
          </div>


     );
}