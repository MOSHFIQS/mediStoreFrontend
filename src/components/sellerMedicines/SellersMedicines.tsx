"use client"

import React, { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
     AlertDialog, AlertDialogContent,
     AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter,
} from "@/components/ui/alert-dialog"
import {
     Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Pencil, Trash2, Plus, Eye, Package, Tag, Layers } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { deleteMedicineAction } from "@/actions/medicine.action"

export default function SellersMedicines({ medicines }: any) {
     const router = useRouter()
     const [openDialogId, setOpenDialogId] = React.useState<string | null>(null)
     const [isPending, startTransition] = useTransition()

     const handleDelete = (id: string) => {
          startTransition(async () => {
               try {
                    const res = await deleteMedicineAction(id)
                    if (!res.ok) {
                         toast.error(res.message)
                    }
                    setOpenDialogId(null)
               } catch (err: any) {
                    toast.error(err.message)
               }
          })
     }

     // The medicine currently targeted for deletion
     const medicineToDelete = medicines.find((m: any) => m.id === openDialogId)

     return (
          <div className="space-y-4 px-4">

               {/* ✅ Dialog lives OUTSIDE the table — no z-index / trigger conflicts */}
               <AlertDialog
                    open={!!openDialogId}
                    onOpenChange={(isOpen) => !isOpen && setOpenDialogId(null)}
               >
                    <AlertDialogContent>
                         <AlertDialogHeader>
                              <AlertDialogTitle>Delete medicine?</AlertDialogTitle>
                              <AlertDialogDescription>
                                   This will permanently remove{" "}
                                   <span className="font-medium text-foreground">
                                        "{medicineToDelete?.name}"
                                   </span>{" "}
                                   from your inventory. This action cannot be undone.
                              </AlertDialogDescription>
                         </AlertDialogHeader>
                         <AlertDialogFooter>
                              <Button variant="outline" onClick={() => setOpenDialogId(null)}>
                                   Cancel
                              </Button>
                              <Button
                                   variant="destructive"
                                   onClick={() => openDialogId && handleDelete(openDialogId)}
                                   disabled={isPending}
                              >
                                   {isPending ? "Deleting…" : "Delete"}
                              </Button>
                         </AlertDialogFooter>
                    </AlertDialogContent>
               </AlertDialog>

               {/* Header */}
               <div className="flex items-center justify-between">
                    <div>
                         <h2 className="text-2xl font-semibold tracking-tight">Medicines</h2>
                         <p className="text-sm text-muted-foreground mt-0.5">
                              {medicines.length} product{medicines.length !== 1 ? "s" : ""} in your inventory
                         </p>
                    </div>
                    <Button onClick={() => router.push("/seller-dashboard/medicine/create")} className="gap-2">
                         <Plus className="w-4 h-4" />
                         Add Medicine
                    </Button>
               </div>

               {/* Table card */}
               <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                         <Table>
                              <TableHeader>
                                   <TableRow className="bg-muted/40 hover:bg-muted/40">
                                        <TableHead className="w-16">Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Brand</TableHead>
                                        <TableHead>Form</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Discount</TableHead>
                                        <TableHead>Stock</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                   </TableRow>
                              </TableHeader>

                              <TableBody>
                                   {medicines.length === 0 ? (
                                        <TableRow>
                                             <TableCell colSpan={11} className="px-4 py-16 text-center">
                                                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                                       <Package className="w-10 h-10 opacity-30" />
                                                       <p className="font-medium">No medicines found</p>
                                                       <p className="text-xs">Add your first medicine to get started</p>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ) : (
                                        medicines.map((med: any) => (
                                             <TableRow key={med.id} className="group">

                                                  {/* Image */}
                                                  <TableCell>
                                                       {med.images?.[0] ? (
                                                            <img
                                                                 src={med.images?.[0]}
                                                                 alt={med.name}
                                                                 className="w-11 h-11 object-cover rounded-lg border border-border shadow-sm"
                                                            />
                                                       ) : (
                                                            <div className="w-11 h-11 rounded-lg border border-dashed border-border bg-muted flex items-center justify-center">
                                                                 <Package className="w-4 h-4 text-muted-foreground opacity-50" />
                                                            </div>
                                                       )}
                                                  </TableCell>

                                                  {/* Name */}
                                                  <TableCell>
                                                       <div className="font-medium leading-tight">{med.name}</div>
                                                       {med.genericName && (
                                                            <div className="text-xs text-muted-foreground mt-0.5">{med.genericName}</div>
                                                       )}
                                                       {med.strength && (
                                                            <div className="text-xs text-muted-foreground">{med.strength} · {med.unit}</div>
                                                       )}
                                                  </TableCell>

                                                  {/* Category */}
                                                  <TableCell>
                                                       {med.category?.name ? (
                                                            <Badge variant="secondary" className="gap-1 font-normal">
                                                                 <Layers className="w-3 h-3" />
                                                                 {med.category.name}
                                                            </Badge>
                                                       ) : (
                                                            <span className="text-muted-foreground text-xs">—</span>
                                                       )}
                                                  </TableCell>

                                                  {/* Brand */}
                                                  <TableCell>
                                                       {med.brand ? (
                                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                                 <Tag className="w-3 h-3" />
                                                                 {med.brand}
                                                            </div>
                                                       ) : (
                                                            <span className="text-muted-foreground text-xs">—</span>
                                                       )}
                                                  </TableCell>

                                                  {/* Dosage Form */}
                                                  <TableCell>
                                                       {med.dosageForm ? (
                                                            <Badge variant="outline" className="text-xs font-normal">
                                                                 {med.dosageForm}
                                                            </Badge>
                                                       ) : (
                                                            <span className="text-muted-foreground text-xs">—</span>
                                                       )}
                                                  </TableCell>

                                                  {/* SKU */}
                                                  <TableCell>
                                                       <code className="text-xs bg-muted px-1.5 py-0.5 rounded text-muted-foreground font-mono">
                                                            {med.sku || "—"}
                                                       </code>
                                                  </TableCell>

                                                  {/* Price */}
                                                  <TableCell className="font-medium tabular-nums">
                                                       ৳{med.price}
                                                  </TableCell>

                                                  {/* Discount */}
                                                  <TableCell className="tabular-nums">
                                                       {med.discountPrice ? (
                                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                                                 ৳{med.discountPrice}
                                                            </span>
                                                       ) : (
                                                            <span className="text-muted-foreground text-xs">—</span>
                                                       )}
                                                  </TableCell>

                                                  {/* Stock */}
                                                  <TableCell className="tabular-nums">
                                                       {med.stock > 10 ? (
                                                            <span className="text-emerald-600 dark:text-emerald-400 font-medium">{med.stock}</span>
                                                       ) : med.stock > 0 ? (
                                                            <span className="text-amber-500 font-medium">{med.stock}</span>
                                                       ) : (
                                                            <span className="text-destructive font-medium">Out</span>
                                                       )}
                                                  </TableCell>

                                                  {/* Status */}
                                                  <TableCell>
                                                       {med.isActive ? (
                                                            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 font-normal text-xs">
                                                                 Active
                                                            </Badge>
                                                       ) : (
                                                            <Badge variant="secondary" className="font-normal text-xs text-muted-foreground">
                                                                 Inactive
                                                            </Badge>
                                                       )}
                                                  </TableCell>

                                                  {/* Actions */}
                                                  <TableCell className="text-right">
                                                       <div className="flex justify-end gap-1">

                                                            {/* View */}
                                                            <Button
                                                                 size="icon"
                                                                 variant="ghost"
                                                                 onClick={() => router.push(`/seller-dashboard/medicine/${med.id}`)}
                                                                 className="hover:text-sky-600 border rounded-full bg-sky-100"
                                                            >
                                                                 <Eye className="h-4 w-4" />
                                                            </Button>

                                                            {/* Edit */}
                                                            <Button
                                                                 size="icon"
                                                                 variant="ghost"
                                                                 onClick={() => router.push(`/seller-dashboard/medicine/update/${med.id}`)}
                                                                 className="hover:text-amber-600 border rounded-full bg-amber-100"
                                                            >
                                                                 <Pencil className="h-4 w-4" />
                                                            </Button>

                                                            {/* Delete */}
                                                            <Button
                                                                 size="icon"
                                                                 variant="ghost"
                                                                 onClick={() => setOpenDialogId(med.id)}
                                                                 className="hover:text-red-600 border rounded-full bg-red-100"
                                                            >
                                                                 <Trash2 className="h-4 w-4" />
                                                            </Button>

                                                       </div>
                                                  </TableCell>

                                             </TableRow>
                                        ))
                                   )}
                              </TableBody>
                         </Table>
                    </div>
               </div>
          </div>
     )
}