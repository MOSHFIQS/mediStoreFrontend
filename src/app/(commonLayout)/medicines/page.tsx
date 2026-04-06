
import AllMedicines from "@/components/medicine/AllMedicines";
import { getAllMedicinesAction } from "@/actions/medicine.action";
import { getAllCategoriesAction } from "@/actions/category.action";

export default async function AllMedicinesPage({
     searchParams,
}: {
     searchParams: Promise<{ category?: string; search?: string }>;
}) {
     const { category: categoryId, search } = await searchParams;

     const [medRes, catRes] = await Promise.all([
          getAllMedicinesAction(categoryId ? { categoryId } : {}),
          getAllCategoriesAction(),
     ]);

     console.log(medRes);
     console.log(catRes);

     if (!medRes.ok) return <p className="p-4">Failed to load medicines</p>;
     if (!catRes.ok) return <p className="p-4">Failed to load categories</p>;

     return (
          <AllMedicines
               initialMedicines={medRes.data?.data}
               categories={catRes.data}
          />
     );
}