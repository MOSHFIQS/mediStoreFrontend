
import { medicineServiceServer } from "@/service/medicine.server.service";
import { categoryServiceServer } from "@/service/category.server.service";
import AllMedicinesClient from "@/components/allMedicines/AllMedicinesClient";

export default async function AllMedicinesPage({ searchParams }: { searchParams: Promise<{ category: string }> }) {
     const categoryId = (await searchParams).category
     console.log(categoryId);

     const [medRes, catRes] = await Promise.all([
          medicineServiceServer.getAll(categoryId ? { categoryId } : {}),
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
