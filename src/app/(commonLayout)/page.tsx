
import { medicineServiceServer } from "@/service/medicine.server.service";
import { categoryServiceServer } from "@/service/category.server.service";
import { CarouselPlugin } from "@/components/banner/Banner";
import Footer from "@/components/footer/Footer";
import HealthTips from "@/components/healthTips/HealthTips";
import FeaturedSection from "@/components/featuredSection/FeaturedSection";
import AllMedicines from "@/components/medicine/AllMedicines";

export default async function HomePage({
     searchParams,
}: {
     searchParams: Promise<{ category?: string }>;
}) {
     const params = await searchParams; 
     const categoryId = params.category;

     const [medRes, catRes] = await Promise.all([
          medicineServiceServer.getAll(categoryId ? { categoryId } : {}),
          categoryServiceServer.getAll(),
     ]);

     console.log(medRes);
     console.log(catRes);

     if (!medRes.ok) return <p className="p-4">Failed to load medicines</p>;
     if (!catRes.ok) return <p className="p-4">Failed to load categories</p>;

     return (
          <>
               <CarouselPlugin />
               <FeaturedSection />
               <AllMedicines
                    initialMedicines={medRes.data.data.data}
                    categories={catRes.data.data}
               />
               <HealthTips />
               <Footer />
          </>
     );
}