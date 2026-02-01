
import { medicineServiceServer } from "@/service/medicine.server.service";
import { categoryServiceServer } from "@/service/category.server.service";
import AllMedicinesClient from "@/components/allMedicines/AllMedicinesClient";
import { CarouselPlugin } from "@/components/banner/Banner";

export default async function HomePage({
     searchParams,
}: {
     searchParams: { category?: string };
}) {
     const categoryId = searchParams.category;

     const [medRes, catRes] = await Promise.all([
          medicineServiceServer.getAll(categoryId ? { categoryId } : {}),
          categoryServiceServer.getAll(),
     ]);

     if (!medRes.ok) return <p className="p-4">Failed to load medicines</p>;
     if (!catRes.ok) return <p className="p-4">Failed to load categories</p>;

     return (
          <>
               <CarouselPlugin />
               <AllMedicinesClient
                    initialMedicines={medRes.data.data}
                    categories={catRes.data.data}
               />
          </>
     );
}
