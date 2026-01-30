"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicineService } from "@/service/medicine.service";
import {
     Table,
     TableHeader,
     TableRow,
     TableHead,
     TableBody,
     TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
     AlertDialog,
     AlertDialogTrigger,
     AlertDialogContent,
     AlertDialogHeader,
     AlertDialogTitle,
     AlertDialogDescription,
     AlertDialogFooter,
} from "@/components/ui/alert-dialog";

interface Medicine {
     id: string;
     name: string;
     price: number;
     stock: number;
     image?: string;
     category?: { name: string };
     seller?: { name: string };
}

export default function AllMedicines() {
     const router = useRouter();
     const queryClient = useQueryClient();
     const [openDialogId, setOpenDialogId] = React.useState<string | null>(null);


     // Fetch all medicines
     const { data: medicines = [], isLoading } = useQuery<Medicine[]>({
          queryKey: ["medicines"],
          queryFn: async () => {
               const res = await medicineService.getAll();
               if (!res.ok) throw new Error(res.message);
               return res.data.data;
          },
     });

     // Delete mutation
     const deleteMutation = useMutation({
          mutationFn:  (id: string) =>  medicineService.delete(id),
          onSuccess: () => {
               toast.success("Medicine deleted");
               queryClient.invalidateQueries({ queryKey: ["medicines"] });
          },
          onError: (error : any) => toast.error(error.message),
     });

     return (
          <Card>
               <CardHeader className="flex justify-between items-center">
                    <CardTitle>All Medicines</CardTitle>
                    <Button onClick={() => router.push("/seller-dashboard/create-medicine")}>
                         <Plus className="w-4 h-4 mr-2" />
                         Add Medicine
                    </Button>
               </CardHeader>

               <CardContent>
                    {isLoading ? (
                         <p>Loading medicines...</p>
                    ) : (
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Seller</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                   </TableRow>
                              </TableHeader>

                              <TableBody>
                                   {medicines.map((med) => (
                                        <TableRow key={med.id}>
                                             <TableCell>
                                                  {med.image ? (
                                                       <img
                                                            src={med.image}
                                                            alt={med.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                       />
                                                  ) : (
                                                       "No Image"
                                                  )}
                                             </TableCell>
                                             <TableCell>{med.name}</TableCell>
                                             <TableCell>{med.category?.name || "—"}</TableCell>
                                             <TableCell>{med.seller?.name || "—"}</TableCell>
                                             <TableCell>৳ {med.price}</TableCell>
                                             <TableCell>
                                                  {med.stock > 0 ? (
                                                       <span className="text-green-600 font-medium">{med.stock}</span>
                                                  ) : (
                                                       <span className="text-red-600 font-medium">Out</span>
                                                  )}
                                             </TableCell>

                                             <TableCell className="text-right space-x-2">
                                                  <Button
                                                       size="icon"
                                                       variant="outline"
                                                       onClick={() =>
                                                            router.push(`/seller-dashboard/update-medicine/${med.id}`)
                                                       }
                                                  >
                                                       <Pencil className="w-4 h-4" />
                                                  </Button>

                                                  <AlertDialog
                                                       open={openDialogId === med.id}
                                                       onOpenChange={(isOpen) => {
                                                            if (!isOpen) setOpenDialogId(null); // Close when user clicks outside or cancel
                                                       }}
                                                  >
                                                       <AlertDialogTrigger asChild>
                                                            <Button
                                                                 size="icon"
                                                                 variant="destructive"
                                                                 onClick={() => setOpenDialogId(med.id)}
                                                            >
                                                                 <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                       </AlertDialogTrigger>

                                                       <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                 <AlertDialogTitle>Delete Medicine?</AlertDialogTitle>
                                                                 <AlertDialogDescription>
                                                                      Are you sure you want to delete "{med.name}"? This action cannot be undone.
                                                                 </AlertDialogDescription>
                                                            </AlertDialogHeader>

                                                            <AlertDialogFooter>
                                                                 <Button variant="outline" onClick={() => setOpenDialogId(null)}>
                                                                      Cancel
                                                                 </Button>
                                                                 <Button
                                                                      variant="destructive"
                                                                      onClick={() => deleteMutation.mutate(med.id)}
                                                                      disabled={deleteMutation.isPending} // use isLoading, not isPending
                                                                 >
                                                                      Delete
                                                                 </Button>
                                                            </AlertDialogFooter>
                                                       </AlertDialogContent>
                                                  </AlertDialog>

                                             </TableCell>
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                    )}
               </CardContent>
          </Card>
     );
}
