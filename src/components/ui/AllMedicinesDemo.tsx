"use client";

import { medicineService } from "@/service/medicine.service";
import {
     Card,
     CardHeader,
     CardTitle,
     CardContent,
     CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

export interface Medicine {
     id: string;
     name: string;
     description: string;
     price: number;
     stock: number;
     image?: string;
}

export default function AllMedicines() {
     const router = useRouter()

     const { data: medicines = [], isLoading } = useQuery<Medicine[], Error>({
          queryKey: ["medicines"],
          queryFn: async () => {
               const res = await medicineService.getAll();
               if (!res.ok) throw new Error(res.message);
               return res.data.data;
          },
     });

     if (isLoading) return <p>Loading...</p>;
     if (!medicines.length) return <p>No medicines found.</p>;

     return (
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                              <Button onClick={() => router.push(`/medicines`)} variant="outline" className="w-full">
                                   view more to buy
                              </Button>
                         </CardFooter>
                    </Card>
               ))}
          </div>
     );
}
