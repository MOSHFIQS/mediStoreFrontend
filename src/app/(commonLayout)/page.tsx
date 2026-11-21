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

export const dynamic = "force-dynamic";

export default async function HomePage() {
     let medicines: any[] = [];
     let categories: any[] = [];

     try {
          const [medRes, catRes] = await Promise.all([
               getAllMedicinesAction().catch(() => ({ ok: false, data: { data: [] } })),
               getAllCategoriesAction().catch(() => ({ ok: false, data: [] })),
          ]);

          if (medRes?.ok && Array.isArray(medRes.data?.data)) {
               medicines = medRes.data.data;
          } else if (Array.isArray(medRes?.data)) {
               medicines = medRes.data;
          }

          if (catRes?.ok && Array.isArray(catRes.data)) {
               categories = catRes.data;
          }
     } catch {
          medicines = [];
          categories = [];
     }

     return (
          <div className="space-y-12 sm:space-y-16 pb-6">
               <CarouselPlugin />
               <FeaturesSection />
               <FeaturedSection />
               <AllMedicines
                    initialMedicines={medicines}
                    categories={categories}
               />
               <StatisticsSection />
               <TestimonialsSection />
               <HealthTips />
               <FaqSection />
               <NewsletterSection />
               <Footer />
          </div>
     );
}
