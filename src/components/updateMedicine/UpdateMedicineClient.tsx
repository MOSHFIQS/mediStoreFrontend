"use client"

import { useTransition, useEffect, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { updateMedicineAction } from "@/actions/medicine.action"
import {
     Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
     Select, SelectTrigger, SelectValue, SelectContent, SelectItem
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
     Dialog, DialogContent, DialogHeader,
     DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog"
import { Package, FlaskConical, Tag, Info, ArrowLeft, AlertTriangle } from "lucide-react"
import ImageUploader from "../shared/image/ImageUploader"
import { useImageUpload } from "@/hooks/useImageUpload"
import { useRouter } from "next/navigation"

const DOSAGE_FORMS = ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment", "Drops", "Inhaler", "Patch", "Suppository"]
const UNITS = ["piece", "strip", "bottle", "box", "tube", "vial", "sachet"]

export default function UpdateMedicineClient({
     medicine,
     categories,
}: {
     medicine: any
     categories: { id: string; name: string }[]
}) {
     const [isPending, startTransition] = useTransition()
     const [showLeaveDialog, setShowLeaveDialog] = useState(false)
     const router = useRouter()

     const medicineImages = useImageUpload({
          max: 10,
          defaultImages: Array.isArray(medicine?.images) ? medicine.images : [],
     })

     const originalImageUrls = Array.isArray(medicine?.images) ? medicine.images.join(",") : ""
     const currentImageUrls = medicineImages.images
          .filter((img) => !img.imageUploading)
          .map((img) => img.img)
          .join(",")

     const isDirty = medicineImages.hasPendingDeletes || currentImageUrls !== originalImageUrls

     // Block refresh / tab close
     useEffect(() => {
          if (!isDirty) return
          const handler = (e: BeforeUnloadEvent) => {
               e.preventDefault()
               e.returnValue = ""
          }
          window.addEventListener("beforeunload", handler)
          return () => window.removeEventListener("beforeunload", handler)
     }, [isDirty])

     const handleLeave = () => {
          if (isDirty) {
               setShowLeaveDialog(true)
          } else {
               router.push("/seller-dashboard/medicine")
          }
     }

     const handleConfirmLeave = () => {
          medicineImages.discardDeletes()
          setShowLeaveDialog(false)
          router.push("/seller-dashboard/medicine")
     }

     const form = useForm({
          defaultValues: {
               name: medicine.name ?? "",
               genericName: medicine.genericName ?? "",
               brand: medicine.brand ?? "",
               manufacturer: medicine.manufacturer ?? "",
               sku: medicine.sku ?? "",
               description: medicine.description ?? "",
               categoryId: medicine.categoryId ?? "",
               dosageForm: medicine.dosageForm ?? "",
               strength: medicine.strength ?? "",
               unit: medicine.unit ?? "piece",
               price: String(medicine.price ?? ""),
               discountPrice: String(medicine.discountPrice ?? ""),
               stock: String(medicine.stock ?? ""),
          },
          onSubmit: async ({ value }) => {
               startTransition(async () => {
                    try {
                         const payload = {
                              name: value.name,
                              genericName: value.genericName || undefined,
                              description: value.description,
                              brand: value.brand || undefined,
                              manufacturer: value.manufacturer || undefined,
                              categoryId: value.categoryId,
                              price: Number(value.price),
                              discountPrice: value.discountPrice ? Number(value.discountPrice) : undefined,
                              stock: Number(value.stock),
                              dosageForm: value.dosageForm || undefined,
                              strength: value.strength || undefined,
                              unit: value.unit || "piece",
                              sku: value.sku || undefined,
                              images: medicineImages.images
                                   .filter((img) => !img.imageUploading)
                                   .map((img) => img.img),
                         }

                         const res = await updateMedicineAction(medicine.id, payload)
                         if (!res?.ok) {
                              toast.error(res?.message)
                              return
                         }

                         // ✅ DB saved — now safe to delete removed images from Cloudinary
                         await medicineImages.commitDeletes()

                         toast.success("Medicine updated successfully!")
                         router.push("/seller-dashboard/medicine")
                    } catch (err: any) {
                         toast.error(err.message || "Failed to update medicine")
                    }
               })
          },
     })

     return (
          <>
               {/* Leave confirmation dialog */}
               <Dialog open={showLeaveDialog} onOpenChange={setShowLeaveDialog}>
                    <DialogContent className="max-w-sm rounded-2xl">
                         <DialogHeader>
                              <div className="flex items-center gap-3 mb-1">
                                   <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                                   </div>
                                   <DialogTitle className="text-base font-bold">Discard changes?</DialogTitle>
                              </div>
                              <DialogDescription className="text-sm text-gray-400 leading-relaxed">
                                   You have unsaved changes. If you leave now, any uploaded or removed images will not be saved.
                              </DialogDescription>
                         </DialogHeader>
                         <DialogFooter className="flex gap-2 mt-2">
                              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowLeaveDialog(false)}>
                                   Stay
                              </Button>
                              <Button className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white border-0" onClick={handleConfirmLeave}>
                                   Discard & Leave
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>

               <div className="p-4">
                    {/* Back nav */}
                    <div className="mb-4">
                         <button
                              onClick={handleLeave}
                              className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                         >
                              <ArrowLeft className="h-3.5 w-3.5" />
                              Back to Medicines
                         </button>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                         <Card className="shadow-sm">
                              <CardHeader className="pb-4 border-b">
                                   <CardTitle className="flex items-center gap-2 text-xl">
                                        <Package className="w-5 h-5 text-purple-500" />
                                        Update Medicine
                                   </CardTitle>
                                   <CardDescription>Edit the details below to update this medicine</CardDescription>
                              </CardHeader>

                              <CardContent className="space-y-6 pt-6">

                                   {/* Basic Info */}
                                   <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                             <Info className="w-3.5 h-3.5" /> Basic Information
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                             <form.Field name="name" validators={{ onChange: ({ value }) => !value ? "Name is required" : undefined }}>
                                                  {(field) => (
                                                       <div className="space-y-1 sm:col-span-2">
                                                            <Label>Medicine Name *</Label>
                                                            <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                                            {field.state.meta.errors && <p className="text-red-500 text-sm">{field.state.meta.errors}</p>}
                                                       </div>
                                                  )}
                                             </form.Field>
                                             <form.Field name="genericName">
                                                  {(field) => (
                                                       <div className="space-y-1">
                                                            <Label>Generic Name</Label>
                                                            <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                                       </div>
                                                  )}
                                             </form.Field>
                                             <form.Field name="brand">
                                                  {(field) => (
                                                       <div className="space-y-1">
                                                            <Label>Brand</Label>
                                                            <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                                       </div>
                                                  )}
                                             </form.Field>
                                             <form.Field name="manufacturer">
                                                  {(field) => (
                                                       <div className="space-y-1">
                                                            <Label>Manufacturer</Label>
                                                            <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                                       </div>
                                                  )}
                                             </form.Field>
                                             <form.Field name="sku">
                                                  {(field) => (
                                                       <div className="space-y-1">
                                                            <Label>SKU</Label>
                                                            <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                                       </div>
                                                  )}
                                             </form.Field>
                                             <form.Field name="description" validators={{ onChange: ({ value }) => !value ? "Description is required" : undefined }}>
                                                  {(field) => (
                                                       <div className="space-y-1 sm:col-span-2">
                                                            <Label>Description *</Label>
                                                            <Textarea value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                                            {field.state.meta.errors && <p className="text-red-500 text-sm">{field.state.meta.errors}</p>}
                                                       </div>
                                                  )}
                                             </form.Field>
                                        </div>
                                   </div>

                                   {/* Classification */}
                                   <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                             <FlaskConical className="w-3.5 h-3.5" /> Classification
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                             <form.Field name="categoryId">
                                                  {(field) => (
                                                       <div className="space-y-1">
                                                            <Label>Category *</Label>
                                                            <Select value={field.state.value} onValueChange={field.handleChange}>
                                                                 <SelectTrigger className="w-full"><SelectValue placeholder="Select category" /></SelectTrigger>
                                                                 <SelectContent>
                                                                      {categories.map((cat) => (
                                                                           <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                                      ))}
                                                                 </SelectContent>
                                                            </Select>
                                                       </div>
                                                  )}
                                             </form.Field>
                                             <form.Field name="dosageForm">
                                                  {(field) => (
                                                       <div className="space-y-1">
                                                            <Label>Dosage Form</Label>
                                                            <Select value={field.state.value} onValueChange={field.handleChange}>
                                                                 <SelectTrigger className="w-full"><SelectValue placeholder="e.g. Tablet" /></SelectTrigger>
                                                                 <SelectContent>
                                                                      {DOSAGE_FORMS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                                                                 </SelectContent>
                                                            </Select>
                                                       </div>
                                                  )}
                                             </form.Field>
                                             <form.Field name="strength">
                                                  {(field) => (
                                                       <div className="space-y-1">
                                                            <Label>Strength</Label>
                                                            <Input value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                                       </div>
                                                  )}
                                             </form.Field>
                                             <form.Field name="unit">
                                                  {(field) => (
                                                       <div className="space-y-1">
                                                            <Label>Unit</Label>
                                                            <Select value={field.state.value} onValueChange={field.handleChange}>
                                                                 <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                                                 <SelectContent>
                                                                      {UNITS.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                                                                 </SelectContent>
                                                            </Select>
                                                       </div>
                                                  )}
                                             </form.Field>
                                        </div>
                                   </div>

                                   {/* Pricing & Stock */}
                                   <div>
                                        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                             <Tag className="w-3.5 h-3.5" /> Pricing & Stock
                                        </h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                             <form.Field name="price" validators={{ onChange: ({ value }) => !value ? "Price is required" : undefined }}>
                                                  {(field) => (
                                                       <div className="space-y-1">
                                                            <Label>Price *</Label>
                                                            <Input type="number" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                                            {field.state.meta.errors && <p className="text-red-500 text-sm">{field.state.meta.errors}</p>}
                                                       </div>
                                                  )}
                                             </form.Field>
                                             <form.Field name="discountPrice">
                                                  {(field) => (
                                                       <div className="space-y-1">
                                                            <Label>Discount Price</Label>
                                                            <Input type="number" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                                       </div>
                                                  )}
                                             </form.Field>
                                             <form.Field name="stock" validators={{ onChange: ({ value }) => !value ? "Stock is required" : undefined }}>
                                                  {(field) => (
                                                       <div className="space-y-1">
                                                            <Label>Stock *</Label>
                                                            <Input type="number" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                                            {field.state.meta.errors && <p className="text-red-500 text-sm">{field.state.meta.errors}</p>}
                                                       </div>
                                                  )}
                                             </form.Field>
                                        </div>
                                   </div>

                                   {/* Images */}
                                   <ImageUploader
                                        label="Medicine Images"
                                        images={medicineImages.images}
                                        onUpload={medicineImages.upload}
                                        onDelete={medicineImages.remove}
                                        multiple
                                   />
                              </CardContent>

                              <CardFooter className="border-t pt-4 flex gap-2">
                                   <Button type="button" variant="outline" onClick={handleLeave}>
                                        Cancel
                                   </Button>
                                   <Button type="submit" disabled={isPending}>
                                        {isPending ? "Updating..." : "Update Medicine"}
                                   </Button>
                              </CardFooter>
                         </Card>
                    </form>
               </div>
          </>
     )
}