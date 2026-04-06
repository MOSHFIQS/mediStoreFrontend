"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
     Card,
     CardContent,
     CardHeader,
     CardTitle,
     CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createCategoryAction } from "@/actions/category.action";
import { useImageUpload } from "@/hooks/useImageUpload";
import ImageUploader from "../shared/image/ImageUploader";
import { useRouter } from "next/navigation";

export default function CreateCategory() {
     const [loading, setLoading] = useState(false);
     const categoryImages = useImageUpload({ max: 10 });
     const router = useRouter()

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

                    console.log(payload);

                    await createCategoryAction(payload);

                    toast.success("Category created successfully");
                    form.reset();
                    router.push('/admin-dashboard/category')

               } catch (err: any) {
                    toast.error(err.message || "Failed to create category");
               } finally {
                    setLoading(false);
               }
          },
     });

     return (
          <div className="mt-10">
               <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                         <CardTitle>Create Category</CardTitle>
                         <CardDescription>
                              Add a new medicine category
                         </CardDescription>
                    </CardHeader>

                    <CardContent>
                         <form
                              onSubmit={(e) => {
                                   e.preventDefault();
                                   e.stopPropagation();
                                   form.handleSubmit();
                              }}
                              className="space-y-6"
                         >
                              {/* Category Name */}
                              <form.Field
                                   name="name"
                                   validators={{
                                        onChange: ({ value }) =>
                                             !value ? "Category name is required" : undefined,
                                   }}
                              >
                                   {(field) => (
                                        <div className="space-y-2">
                                             <Label>Category Name *</Label>
                                             <Input
                                                  value={field.state.value}
                                                  onChange={(e) => field.handleChange(e.target.value)}
                                                  placeholder="e.g. Pain Relief"
                                             />
                                             {field.state.meta.errors?.length > 0 && (
                                                  <p className="text-sm text-red-500">
                                                       {field.state.meta.errors.join(", ")}
                                                  </p>
                                             )}
                                        </div>
                                   )}
                              </form.Field>

                             

                              {/* Description */}
                              <form.Field
                                   name="description"
                              >
                                   {(field) => (
                                        <div className="space-y-2">
                                             <Label>Description</Label>
                                             <Input
                                                  value={field.state.value}
                                                  onChange={(e) => field.handleChange(e.target.value)}
                                                  placeholder="Optional description"
                                             />
                                        </div>
                                   )}
                              </form.Field>

                              {/* Image Upload */}
                              <ImageUploader
                                   label="Category Images"
                                   images={categoryImages.images}
                                   onUpload={categoryImages.upload}
                                   onDelete={categoryImages.remove}
                                   multiple
                              />

                              <Button type="submit" className="w-full" disabled={loading}>
                                   {loading ? "Creating..." : "Create Category"}
                              </Button>
                         </form>
                    </CardContent>
               </Card>
          </div>
     );
}