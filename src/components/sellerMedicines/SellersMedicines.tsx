"use client"

import React, { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
     AlertDialog, AlertDialogTrigger, AlertDialogContent,
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

     return (
          <div className="space-y-4 px-4">
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
                                                       {med.image ? (
                                                            <img
                                                                 src={med.image}
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
                                                       <div className="flex items-center justify-end gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                                            <Button
                                                                 size="icon"
                                                                 variant="ghost"
                                                                 className="h-8 w-8"
                                                                 onClick={() => router.push(`/seller-dashboard/medicine/${med.id}`)}
                                                            >
                                                                 <Eye className="w-3.5 h-3.5" />
                                                            </Button>

                                                            <Button
                                                                 size="icon"
                                                                 variant="ghost"
                                                                 className="h-8 w-8"
                                                                 onClick={() => router.push(`/seller-dashboard/medicine/update/${med.id}`)}
                                                            >
                                                                 <Pencil className="w-3.5 h-3.5" />
                                                            </Button>

                                                            <AlertDialog
                                                                 open={openDialogId === med.id}
                                                                 onOpenChange={(isOpen) => !isOpen && setOpenDialogId(null)}
                                                            >
                                                                 <AlertDialogTrigger asChild>
                                                                      <Button
                                                                           size="icon"
                                                                           variant="ghost"
                                                                           className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                           onClick={() => setOpenDialogId(med.id)}
                                                                      >
                                                                           <Trash2 className="w-3.5 h-3.5" />
                                                                      </Button>
                                                                 </AlertDialogTrigger>

                                                                 <AlertDialogContent>
                                                                      <AlertDialogHeader>
                                                                           <AlertDialogTitle>Delete medicine?</AlertDialogTitle>
                                                                           <AlertDialogDescription>
                                                                                This will permanently remove{" "}
                                                                                <span className="font-medium text-foreground">"{med.name}"</span>{" "}
                                                                                from your inventory. This action cannot be undone.
                                                                           </AlertDialogDescription>
                                                                      </AlertDialogHeader>
                                                                      <AlertDialogFooter>
                                                                           <Button variant="outline" onClick={() => setOpenDialogId(null)}>
                                                                                Cancel
                                                                           </Button>
                                                                           <Button
                                                                                variant="destructive"
                                                                                onClick={() => handleDelete(med.id)}
                                                                                disabled={isPending}
                                                                           >
                                                                                {isPending ? "Deleting…" : "Delete"}
                                                                           </Button>
                                                                      </AlertDialogFooter>
                                                                 </AlertDialogContent>
                                                            </AlertDialog>
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