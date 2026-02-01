"use client"

import React, { useTransition } from "react"
import {
     Table, TableHeader, TableRow, TableHead, TableBody, TableCell,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
     AlertDialog, AlertDialogTrigger, AlertDialogContent,
     AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import { deleteMedicineAction } from "@/actions/medicine.server"

export default function SellersMedicineClient({ medicines }: any) {
     const router = useRouter()
     const [openDialogId, setOpenDialogId] = React.useState<string | null>(null)
     const [isPending, startTransition] = useTransition()

     const handleDelete = (id: string) => {
          startTransition(async () => {
               try {
                    await deleteMedicineAction(id)
                    toast.success("Medicine deleted")
               } catch (err: any) {
                    toast.error(err.message)
               }
          })
     }

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
                              {medicines.map((med: any) => (
                                   <TableRow key={med.id}>
                                        <TableCell>
                                             {med.image ? (
                                                  <img src={med.image} alt={med.name} className="w-12 h-12 object-cover rounded" />
                                             ) : "No Image"}
                                        </TableCell>
                                        <TableCell>{med.name}</TableCell>
                                        <TableCell>{med.category?.name || "—"}</TableCell>
                                        <TableCell>{med.seller?.name || "—"}</TableCell>
                                        <TableCell>৳ {med.price}</TableCell>
                                        <TableCell>
                                             {med.stock > 0
                                                  ? <span className="text-green-600 font-medium">{med.stock}</span>
                                                  : <span className="text-red-600 font-medium">Out</span>}
                                        </TableCell>

                                        <TableCell className="text-right space-x-2">
                                             <Button size="icon" variant="outline"
                                                  onClick={() => router.push(`/seller-dashboard/update-medicine/${med.id}`)}>
                                                  <Pencil className="w-4 h-4" />
                                             </Button>

                                             <AlertDialog open={openDialogId === med.id}
                                                  onOpenChange={(isOpen) => !isOpen && setOpenDialogId(null)}>

                                                  <AlertDialogTrigger asChild>
                                                       <Button size="icon" variant="destructive"
                                                            onClick={() => setOpenDialogId(med.id)}>
                                                            <Trash2 className="w-4 h-4" />
                                                       </Button>
                                                  </AlertDialogTrigger>

                                                  <AlertDialogContent>
                                                       <AlertDialogHeader>
                                                            <AlertDialogTitle>Delete Medicine?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                 Are you sure you want to delete "{med.name}"?
                                                            </AlertDialogDescription>
                                                       </AlertDialogHeader>

                                                       <AlertDialogFooter>
                                                            <Button variant="outline" onClick={() => setOpenDialogId(null)}>
                                                                 Cancel
                                                            </Button>
                                                            <Button variant="destructive"
                                                                 onClick={() => handleDelete(med.id)}
                                                                 disabled={isPending}>
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
               </CardContent>
          </Card>
     )
}
