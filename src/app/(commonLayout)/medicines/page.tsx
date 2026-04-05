import { medicineServiceServer } from "@/service/medicine.server.service";
import { categoryServiceServer } from "@/service/category.server.service";
import AllMedicinesClient from "@/components/allMedicines/AllMedicinesClient";

export default async function AllMedicinesPage({
     searchParams,
}: {
     searchParams: Promise<{ category?: string; search?: string }>;
}) {
     const { category: categoryId, search } = await searchParams;

     const [medRes, catRes] = await Promise.all([
          // Pass both categoryId and search to getAll
          medicineServiceServer.getAll(
               categoryId ? { categoryId, search } : { search }
          ),
          categoryServiceServer.getAll(),
     ]);

     if (!medRes.ok) return <p className="p-4">Failed to load medicines</p>;
     if (!catRes.ok) return <p className="p-4">Failed to load categories</p>;

     return (
          <AllMedicinesClient
               initialMedicines={medRes.data.data}
               categories={catRes.data.data}
          />
     );
}