"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { medicineService } from "@/service/medicine.service";
import { categoryService } from "@/service/category.service";
import {
     Card,
     CardHeader,
     CardTitle,
     CardContent,
     CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { Category } from "@/types/category.type";

export interface Medicine {
     id: string;
     name: string;
     description: string;
     price: number;
     stock: number;
     image?: string;
     categoryId?: string;
}

export default function AllMedicines() {
     const router = useRouter();
     const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
     const pathname = usePathname();

     // Fetch all categories
     const { data: categories = [] } = useQuery<Category[], Error>({
          queryKey: ["categories"],
          queryFn: async () => {
               const res = await categoryService.getAll();
               if (!res.ok) throw new Error(res.message);
               return res.data.data;
          },
     });

     // Fetch medicines based on selected category
     const { data: medicines = [], isLoading } = useQuery<Medicine[], Error>({
          queryKey: ["medicines", selectedCategory], // refetch when category changes
          queryFn: async () => {
               const params = selectedCategory ? { categoryId: selectedCategory } : {};
               const res = await medicineService.getAll(params);
               if (!res.ok) throw new Error(res.message);
               return res.data.data;
          },
     });

     if (isLoading) return <p>Loading...</p>;

     return (
          <div className="p-4">
               {pathname === "/medicines" && (
                    <div className="mb-4 flex flex-wrap gap-2">
                         <Button
                              variant={selectedCategory === null ? "default" : "outline"}
                              onClick={() => setSelectedCategory(null)}
                         >
                              All
                         </Button>
                         {categories.map((cat) => (
                              <Button
                                   key={cat.id}
                                   variant={selectedCategory === cat.id ? "default" : "outline"}
                                   onClick={() => setSelectedCategory(cat.id)}
                              >
                                   {cat.name}
                              </Button>
                         ))}
                    </div>
               )}

               {
                    medicines.length > 0 && 
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                         {medicines.map((med) => (
                              <Card key={med.id} className="shadow-md hover:shadow-lg transition-shadow">
                                   <CardHeader>
                                        <CardTitle>{med.name}</CardTitle>
                                   </CardHeader>
                                   {med.image ? (
                                        <img
                                             src={med.image}
                                             alt={med.name}
                                             className="w-full h-48 object-contain rounded-md"
                                             onError={(e) =>
                                             (e.currentTarget.src =
                                                  "https://i.ibb.co/whX8gJjd/medicine-capsule-medical-pills-illustration-png.png")
                                             }
                                        />
                                   ) : (
                                        <img
                                             src="https://i.ibb.co/whX8gJjd/medicine-capsule-medical-pills-illustration-png.png"
                                             alt="default medicine"
                                             className="w-full h-48 object-contain rounded-md"
                                        />
                                   )}
                                   <CardContent>
                                        <p className="text-sm text-gray-600 mb-2">{med.description}</p>
                                        <p className="font-semibold">Price: {med.price}tk</p>
                                        <p className="text-gray-500">Stock: {med.stock} items</p>
                                   </CardContent>
                                   <CardFooter>
                                        <Button
                                             onClick={() => router.push(`/medicines/${med.id}`)}
                                             variant="outline"
                                             className="w-full"
                                        >
                                             View More to Buy
                                        </Button>
                                   </CardFooter>
                              </Card>
                         ))}
                    </div>
               }
          </div>
     );
}
