import { medicineServiceServer } from "@/service/medicine.server.service";
import { categoryServiceServer } from "@/service/category.server.service";
import AllMedicines from "@/components/medicine/AllMedicines";

export default async function AllMedicinesPage({
     searchParams,
}: {
     searchParams: Promise<{ category?: string; search?: string }>;
}) {
     const { category: categoryId, search } = await searchParams;

     const [medRes, catRes] = await Promise.all([
          
          medicineServiceServer.getAll(
               categoryId ? { categoryId, search } : { search }
          ),
          categoryServiceServer.getAll(),
     ]);

     if (!medRes.ok) return <p className="p-4">Failed to load medicines</p>;
     if (!catRes.ok) return <p className="p-4">Failed to load categories</p>;

     return (
          <AllMedicines
               initialMedicines={medRes.data?.data?.data}
               categories={catRes.data.data}
          />
     );
}