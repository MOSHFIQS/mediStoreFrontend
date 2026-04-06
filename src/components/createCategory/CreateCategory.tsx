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
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";
import { createCategoryAction } from "@/actions/category.action";
import { useImageUpload } from "@/hooks/useImageUpload";

interface Category {
     id: string;
     name: string;
}

interface Props {
     parentCategories: Category[];
}

export default function CreateCategory({ parentCategories }: Props) {
     const [loading, setLoading] = useState(false);
     const imageUploader = useImageUpload({ max: 1 });

     const form = useForm({
          defaultValues: {
               name: "",
               description: "",
               parentId: "",
          },
          onSubmit: async ({ value }) => {
               try {
                    setLoading(true);

                    const payload = {
                         name: value.name,
                         description: value.description || undefined,
                         parentId: value.parentId || undefined,
                         image: imageUploader.images[0]?.img,
                    };

                    await createCategoryAction(payload);

                    toast.success("Category created successfully");
                    form.reset();
                    imageUploader.clear();
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
                              Add a new medicine category for filtering products
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

                              {/* Parent Category */}
                              <form.Field name="parentId">
                                   {(field) => (
                                        <div className="space-y-2">
                                             <Label>Parent Category</Label>
                                             <Select
                                                  value={field.state.value}
                                                  onValueChange={field.handleChange}
                                             >
                                                  <SelectTrigger>
                                                       <SelectValue placeholder="Select parent category" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       {parentCategories.map((cat) => (
                                                            <SelectItem key={cat.id} value={cat.id}>
                                                                 {cat.name}
                                                            </SelectItem>
                                                       ))}
                                                  </SelectContent>
                                             </Select>
                                        </div>
                                   )}
                              </form.Field>

                              {/* Image Upload */}
                              <div className="space-y-2">
                                   <Label>Category Image</Label>
                                   {imageUploader.images.length > 0 ? (
                                        <div className="relative w-48 h-48 rounded-lg overflow-hidden border">
                                             <img
                                                  src={imageUploader.images[0].img}
                                                  alt="Preview"
                                                  className="object-contain w-full h-full"
                                             />
                                             <button
                                                  type="button"
                                                  onClick={() => imageUploader.remove(0)}
                                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                             >
                                                  X
                                             </button>
                                        </div>
                                   ) : (
                                        <input
                                             type="file"
                                             accept="image/*"
                                             onChange={(e) =>
                                                  imageUploader.upload(e.target.files ? e.target.files[0] : null)
                                             }
                                        />
                                   )}
                              </div>

                              <Button type="submit" className="w-full" disabled={loading}>
                                   {loading ? "Creating..." : "Create Category"}
                              </Button>
                         </form>
                    </CardContent>
               </Card>
          </div>
     );
}