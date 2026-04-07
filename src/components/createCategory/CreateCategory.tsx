"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCategoryAction } from "@/actions/category.action";
import { useImageUpload } from "@/hooks/useImageUpload";
import ImageUploader from "../shared/image/ImageUploader";
import { useRouter } from "next/navigation";
import { Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateCategory() {
     const [loading, setLoading] = useState(false);
     const categoryImages = useImageUpload({ max: 1 });
     const router = useRouter();

     const form = useForm({
          defaultValues: {
               name: "",
               description: "",
          },
          onSubmit: async ({ value }) => {
               try {
                    setLoading(true);
                    const payload = {
                         name: value.name,
                         description: value.description || undefined,
                         image: categoryImages.images[0]?.img,
                    };
                    await createCategoryAction(payload);
                    toast.success("Category created successfully");
                    form.reset();
                    router.push("/admin-dashboard/category");
               } catch (err: any) {
                    toast.error(err.message || "Failed to create category");
               } finally {
                    setLoading(false);
               }
          },
     });

     return (
          <div className="min-h-screen bg-gray-50/50 p-6">
               {/* Back nav */}
               <div className="mb-6">
                    <Link
                         href="/admin-dashboard/category"
                         className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors"
                    >
                         <ArrowLeft className="h-3.5 w-3.5" />
                         Back to Categories
                    </Link>
               </div>

               <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-6">
                         <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                              <Tag className="h-5 w-5 text-orange-600" />
                         </div>
                         <div>
                              <h1 className="text-xl font-semibold text-gray-900">Create Category</h1>
                              <p className="text-sm text-gray-400">Add a new product category</p>
                         </div>
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                         <form
                              onSubmit={(e) => {
                                   e.preventDefault();
                                   e.stopPropagation();
                                   form.handleSubmit();
                              }}
                         >
                              <div className="p-6 space-y-5">
                                   {/* Name */}
                                   <form.Field
                                        name="name"
                                        validators={{
                                             onChange: ({ value }) =>
                                                  !value ? "Name is required" : undefined,
                                        }}
                                   >
                                        {(field) => (
                                             <div className="space-y-1.5">
                                                  <Label className="text-sm font-medium text-gray-700">
                                                       Category Name <span className="text-red-400">*</span>
                                                  </Label>
                                                  <Input
                                                       placeholder="e.g. Electronics, Clothing…"
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                       className="rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400/20 h-11 bg-gray-50/50"
                                                  />
                                                  {field.state.meta.errors?.length > 0 && (
                                                       <p className="text-red-500 text-xs">{field.state.meta.errors[0]}</p>
                                                  )}
                                             </div>
                                        )}
                                   </form.Field>

                                   {/* Description */}
                                   <form.Field
                                        name="description"
                                        validators={{
                                             onChange: ({ value }) =>
                                                  !value ? "Description is required" : undefined,
                                        }}
                                   >
                                        {(field) => (
                                             <div className="space-y-1.5">
                                                  <Label className="text-sm font-medium text-gray-700">
                                                       Description <span className="text-red-400">*</span>
                                                  </Label>
                                                  <Input
                                                       placeholder="Brief description of this category…"
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                       className="rounded-xl border-gray-200 focus:border-orange-400 focus:ring-orange-400/20 h-11 bg-gray-50/50"
                                                  />
                                                  {field.state.meta.errors?.length > 0 && (
                                                       <p className="text-red-500 text-xs">{field.state.meta.errors[0]}</p>
                                                  )}
                                             </div>
                                        )}
                                   </form.Field>

                                   {/* Image */}
                                   <div className="space-y-1.5">
                                        <Label className="text-sm font-medium text-gray-700">Category Image</Label>
                                        <div className="rounded-xl border border-dashed border-gray-200 overflow-hidden bg-gray-50/50">
                                             <ImageUploader
                                                  label=""
                                                  images={categoryImages.images}
                                                  onUpload={categoryImages.upload}
                                                  onDelete={categoryImages.remove}
                                                  multiple={false}
                                             />
                                        </div>
                                   </div>
                              </div>

                              {/* Footer */}
                              <div className="px-6 py-4 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between gap-3">
                                   <p className="text-xs text-gray-400">Fields marked with <span className="text-red-400">*</span> are required</p>
                                   <div className="flex gap-2">
                                        <Link href="/admin-dashboard/category">
                                             <Button
                                                  type="button"
                                                  variant="outline"
                                                  className="rounded-lg border-gray-200 text-gray-600"
                                             >
                                                  Cancel
                                             </Button>
                                        </Link>
                                        <Button
                                             type="submit"
                                             disabled={loading}
                                             className="rounded-lg bg-orange-500 hover:bg-orange-600 text-white border-0 px-6"
                                        >
                                             {loading ? (
                                                  <span className="flex items-center gap-2">
                                                       <span className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                       Creating…
                                                  </span>
                                             ) : (
                                                  "Create Category"
                                             )}
                                        </Button>
                                   </div>
                              </div>
                         </form>
                    </div>
               </div>
          </div>
     );
}