"use client"

import { useTransition, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import { createMedicineAction } from "@/actions/medicine.action"

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
     Upload, Package, FlaskConical, Tag, Info, ImageIcon, X
} from "lucide-react"
import Image from "next/image"
import { imageHostingService } from "@/service/image-hosting.service"

const DOSAGE_FORMS = ["Tablet", "Capsule", "Syrup", "Injection", "Cream", "Ointment", "Drops", "Inhaler", "Patch", "Suppository"]
const UNITS = ["piece", "strip", "bottle", "box", "tube", "vial", "sachet"]

export default function CreateMedicineClient({ categories }: { categories: { id: string; name: string }[] }) {

     const [isPending, startTransition] = useTransition()
     const [preview, setPreview] = useState<string | null>(null)
     const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null)

     const form = useForm({
          defaultValues: {
               name: "",
               genericName: "",
               brand: "",
               manufacturer: "",
               sku: "",
               description: "",
               categoryId: "",
               dosageForm: "",
               strength: "",
               unit: "piece",
               price: "",
               discountPrice: "",
               stock: "",
               requiresPrescription: false,
          },

          onSubmit: async ({ value }) => {
               if (!uploadedImageUrl) {
                    toast.error("Image is required")
                    return
               }

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
                              requiresPrescription: value.requiresPrescription,
                              image: uploadedImageUrl,
                         }

                         console.log(payload);
                         // const res = await createMedicineAction(payload)


                         // toast.success("Medicine added successfully!")
                         // form.reset()
                         // setPreview(null)
                         // setUploadedImageUrl(null)
                     
                    } catch (err: any) {
                         toast.error(err.message || "Failed to add medicine")
                    }
               })
          },
     })

     const handleImageChange = async (file: File | null) => {
          if (!file) return

          if (file.size > 5 * 1024 * 1024) {
               toast.error("Image must be under 5MB")
               return
          }

          setPreview(URL.createObjectURL(file))

          try {
               const uploadRes = await imageHostingService.uploadImage(file)
               if (!uploadRes.ok || !uploadRes.url) throw new Error("Image upload failed")

               setUploadedImageUrl(uploadRes.url)
               toast.success("Image uploaded successfully")
          } catch (err: any) {
               toast.error(err.message || "Image upload failed")
               setPreview(null)
               setUploadedImageUrl(null)
          }
     }


     return (
          <div className="p-4">
               <form
                    onSubmit={(e) => {
                         e.preventDefault()
                         form.handleSubmit()
                    }}
               >
                    <Card className="shadow-sm">
                         <CardHeader className="pb-4 border-b">
                              <CardTitle className="flex items-center gap-2 text-xl">
                                   <Package className="w-5 h-5 text-purple-500" />
                                   Add New Medicine
                              </CardTitle>
                              <CardDescription>
                                   Fill in the details below to list a new medicine for sale
                              </CardDescription>
                         </CardHeader>

                         <CardContent className="space-y-6 pt-6">

                              {/* Basic Info */}
                              <div>
                                   <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                        <Info className="w-3.5 h-3.5" /> Basic Information
                                   </h3>

                                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                        {/* name (required) */}
                                        <form.Field
                                             name="name"
                                             validators={{
                                                  onChange: ({ value }) => !value ? "Name is required" : undefined
                                             }}
                                        >
                                             {(field) => (
                                                  <div className="space-y-1 sm:col-span-2">
                                                       <Label>Medicine Name *</Label>
                                                       <Input
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                       />
                                                       {field.state.meta.errors && (
                                                            <p className="text-red-500 text-sm">{field.state.meta.errors}</p>
                                                       )}
                                                  </div>
                                             )}
                                        </form.Field>

                                        <form.Field name="genericName">
                                             {(field) => (
                                                  <div className="space-y-1">
                                                       <Label>Generic Name</Label>
                                                       <Input
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                       />
                                                  </div>
                                             )}
                                        </form.Field>

                                        <form.Field name="brand">
                                             {(field) => (
                                                  <div className="space-y-1">
                                                       <Label>Brand</Label>
                                                       <Input
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                       />
                                                  </div>
                                             )}
                                        </form.Field>

                                        <form.Field name="manufacturer">
                                             {(field) => (
                                                  <div className="space-y-1">
                                                       <Label>Manufacturer</Label>
                                                       <Input
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                       />
                                                  </div>
                                             )}
                                        </form.Field>

                                        <form.Field name="sku">
                                             {(field) => (
                                                  <div className="space-y-1">
                                                       <Label>SKU</Label>
                                                       <Input
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                       />
                                                  </div>
                                             )}
                                        </form.Field>

                                        {/* description (required) */}
                                        <form.Field
                                             name="description"
                                             validators={{
                                                  onChange: ({ value }) => !value ? "Description is required" : undefined
                                             }}
                                        >
                                             {(field) => (
                                                  <div className="space-y-1 sm:col-span-2">
                                                       <Label>Description *</Label>
                                                       <Textarea
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                       />
                                                       {field.state.meta.errors && (
                                                            <p className="text-red-500 text-sm">{field.state.meta.errors}</p>
                                                       )}
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

                                        {/* category (required) */}
                                        <form.Field
                                             name="categoryId"
                                             validators={{
                                                  onChange: ({ value }) => !value ? "Category is required" : undefined
                                             }}
                                        >
                                             {(field) => (
                                                  <div className="space-y-1">
                                                       <Label>Category *</Label>
                                                       <Select value={field.state.value} onValueChange={field.handleChange}>
                                                            <SelectTrigger>
                                                                 <SelectValue placeholder="Select category" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                 {categories.map((cat) => (
                                                                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                                                 ))}
                                                            </SelectContent>
                                                       </Select>
                                                       {field.state.meta.errors && (
                                                            <p className="text-red-500 text-sm">{field.state.meta.errors}</p>
                                                       )}
                                                  </div>
                                             )}
                                        </form.Field>

                                        <form.Field name="dosageForm">
                                             {(field) => (
                                                  <div className="space-y-1">
                                                       <Label>Dosage Form</Label>
                                                       <Select value={field.state.value} onValueChange={field.handleChange}>
                                                            <SelectTrigger>
                                                                 <SelectValue placeholder="e.g. Tablet" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                 {DOSAGE_FORMS.map((form) => (
                                                                      <SelectItem key={form} value={form}>{form}</SelectItem>
                                                                 ))}
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
                                                            <SelectTrigger>
                                                                 <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                 {UNITS.map((u) => (
                                                                      <SelectItem key={u} value={u}>{u}</SelectItem>
                                                                 ))}
                                                            </SelectContent>
                                                       </Select>
                                                  </div>
                                             )}
                                        </form.Field>

                                   </div>
                              </div>

                              {/* Pricing */}
                              <div>
                                   <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                        <Tag className="w-3.5 h-3.5" /> Pricing & Stock
                                   </h3>

                                   <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                                        <form.Field
                                             name="price"
                                             validators={{
                                                  onChange: ({ value }) => !value ? "Price is required" : undefined
                                             }}
                                        >
                                             {(field) => (
                                                  <div className="space-y-1">
                                                       <Label>Price *</Label>
                                                       <Input type="number" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                                       {field.state.meta.errors && (
                                                            <p className="text-red-500 text-sm">{field.state.meta.errors}</p>
                                                       )}
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

                                        <form.Field
                                             name="stock"
                                             validators={{
                                                  onChange: ({ value }) => !value ? "Stock is required" : undefined
                                             }}
                                        >
                                             {(field) => (
                                                  <div className="space-y-1">
                                                       <Label>Stock *</Label>
                                                       <Input type="number" value={field.state.value} onChange={(e) => field.handleChange(e.target.value)} />
                                                       {field.state.meta.errors && (
                                                            <p className="text-red-500 text-sm">{field.state.meta.errors}</p>
                                                       )}
                                                  </div>
                                             )}
                                        </form.Field>

                                   </div>

                                   {/* toggle */}
                                   <form.Field name="requiresPrescription">
                                        {(field) => (
                                             <label className="mt-4 flex items-center gap-3 cursor-pointer w-fit">
                                                  <div
                                                       onClick={() => field.handleChange(!field.state.value)}
                                                       className={`relative w-11 h-6 rounded-full ${field.state.value ? "bg-purple-500" : "bg-gray-200"}`}
                                                  >
                                                       <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full ${field.state.value ? "translate-x-5" : ""}`} />
                                                  </div>
                                                  <p className="text-sm">Requires Prescription</p>
                                             </label>
                                        )}
                                   </form.Field>

                              </div>

                              {/* Image */}
                              <div>
                                   <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3 flex items-center gap-1.5">
                                        <ImageIcon className="w-3.5 h-3.5" /> Product Image
                                   </h3>

                                   {preview ? (
                                        <div className="relative w-full h-52 rounded-xl overflow-hidden border-2 border-purple-200">
                                             <Image src={preview} alt="preview" fill className="object-contain" />
                                             <button
                                                  type="button"
                                                  onClick={() => {
                                                       setPreview(null)
                                                       setUploadedImageUrl(null)
                                                  }}
                                             >
                                                  <X />
                                             </button>
                                        </div>
                                   ) : (
                                        <input
                                             type="file"
                                             onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                                        />
                                   )}
                              </div>

                         </CardContent>

                         <CardFooter className="border-t pt-4">
                              <Button type="submit" disabled={isPending}>
                                   {isPending ? "Adding..." : "Add Medicine"}
                              </Button>
                         </CardFooter>
                    </Card>
               </form>
          </div>
     )
}