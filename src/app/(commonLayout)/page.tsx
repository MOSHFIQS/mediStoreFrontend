
import { medicineServiceServer } from "@/service/medicine.server.service";
import { categoryServiceServer } from "@/service/category.server.service";
import { CarouselPlugin } from "@/components/banner/Banner";
import Footer from "@/components/footer/Footer";
import HealthTips from "@/components/healthTips/HealthTips";
import FeaturedSection from "@/components/featuredSection/FeaturedSection";
import AllMedicines from "@/components/medicine/AllMedicines";
import { getAllMedicinesAction } from "@/actions/medicine.action";
import { getAllCategoriesAction } from "@/actions/category.action";
import FeaturesSection from "@/components/home/FeaturesSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import FaqSection from "@/components/home/FaqSection";
import NewsletterSection from "@/components/home/NewsletterSection";

export default async function HomePage({
     searchParams,
}: {
     searchParams: Promise<{ category?: string }>;
}) {
     const params = await searchParams;
     const categoryId = params.category;

     const [medRes, catRes] = await Promise.all([
          getAllMedicinesAction(categoryId ? { categoryId } : {}),
          getAllCategoriesAction(),
     ]);

     console.log(medRes);
     console.log(catRes);

     if (!medRes.ok) return <p className="p-4">Failed to load medicines</p>;
     if (!catRes.ok) return <p className="p-4">Failed to load categories</p>;

     return (
          <div className="space-y-10">
               <CarouselPlugin />
               <FeaturesSection />
               <FeaturedSection />
               <AllMedicines
                    initialMedicines={medRes.data.data}
                    categories={[]}
               />
               {/* 6. Statistics */}
               <StatisticsSection />

               {/* 7. Testimonials */}
               <TestimonialsSection />

               {/* 8. Blogs / Health Tips */}
               <HealthTips />

               {/* 9. FAQs */}
               <FaqSection />

               {/* 10. Newsletter */}
               <NewsletterSection />
               <Footer />
          </div>
     );
}