import { getMedicineByIdAction } from "@/actions/medicine.action"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
     ArrowLeft, Pencil, Package, Tag, Layers, FlaskConical,
     Building2, Barcode, Calendar, CheckCircle2, XCircle, ImageOff,
} from "lucide-react"
import Link from "next/link"



export default async function MedicineDetails({ medicine }: { medicine: any }) {


     const med = medicine

     const fields = [
          { label: "Generic Name", value: med.genericName, icon: FlaskConical },
          { label: "Brand", value: med.brand, icon: Tag },
          { label: "Manufacturer", value: med.manufacturer, icon: Building2 },
          { label: "Dosage Form", value: med.dosageForm, icon: Package },
          { label: "Strength", value: med.strength },
          { label: "Unit", value: med.unit },
          { label: "SKU", value: med.sku, mono: true, icon: Barcode },
          { label: "Slug", value: med.slug, mono: true },
     ]

     const createdAt = med.createdAt ? new Date(med.createdAt).toLocaleDateString("en-GB", {
          day: "numeric", month: "short", year: "numeric",
     }) : null

     const updatedAt = med.updatedAt ? new Date(med.updatedAt).toLocaleDateString("en-GB", {
          day: "numeric", month: "short", year: "numeric",
     }) : null

     return (
          <div className="px-4 py-8 space-y-6">

               {/* Top bar */}
               <div className="flex items-center justify-between">
                    <Link href="/seller-dashboard/medicine">
                         <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-muted-foreground">
                              <ArrowLeft className="w-4 h-4" />
                              Back to medicines
                         </Button>
                    </Link>
                    <Link href={`/seller-dashboard/update-medicine/${med.id}`}>
                         <Button size="sm" className="gap-2">
                              <Pencil className="w-4 h-4" />
                              Edit medicine
                         </Button>
                    </Link>
               </div>

               {/* Hero card */}
               <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">

                         {/* Image panel */}
                         <div className="bg-muted/40 border-b md:border-b-0 md:border-r flex items-center justify-center p-8 min-h-[260px]">
                              {med.image ? (
                                   <img
                                        src={med.image}
                                        alt={med.name}
                                        className="w-full max-w-[200px] h-auto object-contain rounded-lg drop-shadow-sm"
                                   />
                              ) : (
                                   <div className="flex flex-col items-center gap-3 text-muted-foreground">
                                        <ImageOff className="w-12 h-12 opacity-20" />
                                        <p className="text-xs">No image</p>
                                   </div>
                              )}
                         </div>

                         {/* Main info */}
                         <div className="p-6 space-y-4">
                              <div className="flex items-start justify-between gap-4 flex-wrap">
                                   <div>
                                        <h1 className="text-2xl font-semibold tracking-tight">{med.name}</h1>
                                        {med.genericName && (
                                             <p className="text-muted-foreground text-sm mt-0.5">{med.genericName}</p>
                                        )}
                                   </div>
                                   <div className="flex items-center gap-2 flex-wrap">
                                        {med.isActive ? (
                                             <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 gap-1">
                                                  <CheckCircle2 className="w-3 h-3" />
                                                  Active
                                             </Badge>
                                        ) : (
                                             <Badge variant="secondary" className="gap-1 text-muted-foreground">
                                                  <XCircle className="w-3 h-3" />
                                                  Inactive
                                             </Badge>
                                        )}
                                        {med.dosageForm && (
                                             <Badge variant="outline">{med.dosageForm}</Badge>
                                        )}
                                        {med.category?.name && (
                                             <Badge variant="secondary" className="gap-1">
                                                  <Layers className="w-3 h-3" />
                                                  {med.category.name}
                                             </Badge>
                                        )}
                                   </div>
                              </div>

                              {/* Pricing row */}
                              <div className="flex items-end gap-4 pt-1">
                                   <div>
                                        <p className="text-xs text-muted-foreground mb-1">Price</p>
                                        <p className="text-3xl font-bold tracking-tight">৳{med.price}</p>
                                   </div>
                                   {med.discountPrice && (
                                        <>
                                             <div className="pb-1">
                                                  <p className="text-xs text-muted-foreground mb-1">Discount price</p>
                                                  <p className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                                                       ৳{med.discountPrice}
                                                  </p>
                                             </div>
                                             <div className="pb-1">
                                                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                       {Math.round(((med.price - med.discountPrice) / med.price) * 100)}% off
                                                  </Badge>
                                             </div>
                                        </>
                                   )}
                              </div>

                              {/* Stock */}
                              <div className="flex items-center gap-6 pt-1">
                                   <div>
                                        <p className="text-xs text-muted-foreground mb-1">Stock</p>
                                        <p className={`text-lg font-semibold ${med.stock > 10
                                                  ? "text-emerald-600 dark:text-emerald-400"
                                                  : med.stock > 0
                                                       ? "text-amber-500"
                                                       : "text-destructive"
                                             }`}>
                                             {med.stock > 0 ? `${med.stock} units` : "Out of stock"}
                                        </p>
                                   </div>
                                   {med.strength && (
                                        <div>
                                             <p className="text-xs text-muted-foreground mb-1">Strength</p>
                                             <p className="text-lg font-semibold">{med.strength}</p>
                                        </div>
                                   )}
                                   {med.unit && (
                                        <div>
                                             <p className="text-xs text-muted-foreground mb-1">Unit</p>
                                             <p className="text-lg font-semibold capitalize">{med.unit}</p>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>
               </div>

               {/* Details grid */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Product details */}
                    <div className="rounded-xl border bg-card shadow-sm p-5 space-y-4">
                         <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                              Product details
                         </h2>
                         <div className="space-y-3">
                              {fields.map(({ label, value, icon: Icon, mono }) =>
                                   value ? (
                                        <div key={label} className="flex items-start justify-between gap-4">
                                             <div className="flex items-center gap-1.5 text-sm text-muted-foreground min-w-[130px]">
                                                  {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
                                                  {label}
                                             </div>
                                             {mono ? (
                                                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono text-right">
                                                       {value}
                                                  </code>
                                             ) : (
                                                  <span className="text-sm font-medium text-right">{value}</span>
                                             )}
                                        </div>
                                   ) : null
                              )}
                         </div>
                    </div>

                    {/* Description + timestamps */}
                    <div className="space-y-4">
                         {med.description && (
                              <div className="rounded-xl border bg-card shadow-sm p-5">
                                   <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                        Description
                                   </h2>
                                   <p className="text-sm leading-relaxed text-muted-foreground">{med.description}</p>
                              </div>
                         )}

                         <div className="rounded-xl border bg-card shadow-sm p-5">
                              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                                   Timestamps
                              </h2>
                              <div className="space-y-2">
                                   {createdAt && (
                                        <div className="flex items-center justify-between text-sm">
                                             <span className="flex items-center gap-1.5 text-muted-foreground">
                                                  <Calendar className="w-3.5 h-3.5" />
                                                  Created
                                             </span>
                                             <span className="font-medium">{createdAt}</span>
                                        </div>
                                   )}
                                   {updatedAt && (
                                        <div className="flex items-center justify-between text-sm">
                                             <span className="flex items-center gap-1.5 text-muted-foreground">
                                                  <Calendar className="w-3.5 h-3.5" />
                                                  Last updated
                                             </span>
                                             <span className="font-medium">{updatedAt}</span>
                                        </div>
                                   )}
                              </div>
                         </div>
                    </div>
               </div>

               {/* Extra images */}
               {med.images && med.images.length > 1 && (
                    <div className="rounded-xl border bg-card shadow-sm p-5">
                         <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                              Gallery
                         </h2>
                         <div className="flex flex-wrap gap-3">
                              {med.images.map((url: string, i: number) => (
                                   <img
                                        key={i}
                                        src={url}
                                        alt={`${med.name} ${i + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg border border-border shadow-sm"
                                   />
                              ))}
                         </div>
                    </div>
               )}
          </div>
     )
}