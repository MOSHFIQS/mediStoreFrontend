import AllMedicines from "@/components/medicine/AllMedicines";
import { getAllMedicinesAction } from "@/actions/medicine.action";
import { getAllCategoriesAction } from "@/actions/category.action";
import GlobalPagination from "@/components/shared/pagination/GlobalPagination";

export const dynamic = "force-dynamic";

export default async function AllMedicinesPage({
     searchParams,
}: {
     searchParams: Promise<{
          search?: string;
          categoryId?: string;
          page?: number;
          limit?: number;
     }>;
}) {
     const { search, categoryId, page, limit } = await searchParams;
     const searchText = search || "";

     let medicines: any[] = [];
     let categories: any[] = [];
     let meta: any = { page: 1, totalPages: 1, limit: 12 };

     try {
          const [medRes, catRes] = await Promise.all([
               getAllMedicinesAction(searchText, categoryId, page, limit).catch(() => null),
               getAllCategoriesAction().catch(() => null),
          ]);

          if (medRes?.ok && medRes?.data) {
               medicines = Array.isArray(medRes.data?.data)
                    ? medRes.data.data
                    : Array.isArray(medRes.data)
                    ? medRes.data
                    : [];
               meta = medRes.data?.meta || meta;
          }
          if (catRes?.ok && catRes?.data) {
               categories = Array.isArray(catRes.data?.data)
                    ? catRes.data.data
                    : Array.isArray(catRes.data)
                    ? catRes.data
                    : [];
          }
     } catch {
          medicines = [];
          categories = [];
     }

     return (
          <div className="space-y-6 h-full flex flex-col justify-between py-6">
               <AllMedicines
                    initialMedicines={medicines}
                    categories={categories}
               />

               {meta?.totalPages > 1 && (
                    <GlobalPagination
                         page={meta.page}
                         totalPages={meta.totalPages}
                         limit={meta.limit}
                    />
               )}
          </div>
     );
}
