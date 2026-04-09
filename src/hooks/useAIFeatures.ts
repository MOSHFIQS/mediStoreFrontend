import { useState, useEffect, useMemo } from "react";
import { apiFetchClient } from "@/lib/api";

type AIMedicine = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stock: number;
  images: string[];
  categoryId: string;
  genericName?: string;
  relevanceScore?: number;
};

export function useAIFeatures() {
  const [medicines, setMedicines] = useState<AIMedicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Simulated personalized profile
  // In a real app, this would come from backend based on user interaction
  const userInterests = ["vitamin", "pain", "fever", "calcium"];

  // Fetch data silently
  useEffect(() => {
    async function loadData() {
      try {
        const res = await apiFetchClient("/medicine");
        console.log(res);
        if (res.ok && res.data) {
          // Safely extract the medicines array from the nested data structure
          const dataPayload = res.data?.data;
          const medArray = Array.isArray(dataPayload) 
            ? dataPayload 
            : Array.isArray(dataPayload?.data) 
              ? dataPayload.data 
              : [];
          setMedicines(medArray);
        }
      } catch (e) {
        console.error("AI Feature data load failed", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // 1. AI Search & Suggestions
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    
    // Simple predictive scoring mock
    return medicines
      .map((med) => {
        let score = 0;
        if (med.name.toLowerCase().startsWith(query)) score += 10;
        else if (med.name.toLowerCase().includes(query)) score += 5;
        
        if (med.genericName?.toLowerCase().includes(query)) score += 3;
        if (med.categoryId?.toLowerCase().includes(query)) score += 2;
        
        return { ...med, relevanceScore: score };
      })
      .filter((med) => med.relevanceScore! > 0)
      .sort((a, b) => b.relevanceScore! - a.relevanceScore!)
      .slice(0, 5); // Return top 5 suggestions
  }, [searchQuery, medicines]);

  // 2. Personalized Recommendations
  const personalizedRecommendations = useMemo(() => {
    if (!medicines.length) return [];
    
    // Recommend based on mock user interests, high stock, and some randomness
    return medicines
      .filter(med => 
        userInterests.some(interest => 
          med.name.toLowerCase().includes(interest) || 
          med.description?.toLowerCase().includes(interest) ||
          med.categoryId.toLowerCase().includes(interest)
        )
        && med.stock > 0
      )
      // mix in a bit of randomization to seem "dynamic"
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }, [medicines]);

  // 3. Trending Items & Insights
  const trendingItems = useMemo(() => {
    if (!medicines.length) return [];
    
    // Sort logic to simulate "trending" - items with massive discount or seemingly "popular"
    return [...medicines]
      .filter(m => m.stock > 0)
      .map(med => {
         const discountPercentage = med.discountPrice && med.price > 0
            ? ((med.price - med.discountPrice) / med.price) * 100
            : 0;
         // Mock an engagement metric (e.g. 100 to 1000 views)
         const mockEngagement = Math.floor(Math.random() * 900) + 100 + (discountPercentage * 10);
         return {
             ...med,
             trendingScore: mockEngagement
         }
      })
      .sort((a, b) => b.trendingScore - a.trendingScore)
      .slice(0, 4);
  }, [medicines]);

  return {
    medicines,
    loading,
    searchQuery,
    setSearchQuery,
    searchSuggestions,
    personalizedRecommendations,
    trendingItems
  };
}
