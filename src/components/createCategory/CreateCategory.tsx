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
           <Card className="pt-0">
                    <CardHeader className="px-6 py-4 border-b bg-gradient-to-r from-orange-50 to-white rounded-md">
                         <CardTitle className="text-xl font-semibold text-gray-800">Create Category</CardTitle>
                         <CardDescription>
                              Add a Category
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

                              {/* NAME */}
                              <form.Field
                                   name="name"
                                   validators={{
                                        onChange: ({ value }) =>
                                             !value ? "Name is required" : undefined,
                                   }}
                              >
                                   {(field) => (
                                        <div className="space-y-2">
                                             <Label>Name</Label>
                                             <Input
                                                  value={field.state.value}
                                                  onChange={(e) => field.handleChange(e.target.value)}
                                             />
                                             {field.state.meta.errors && (
                                                  <p className="text-red-500 text-sm">
                                                       {field.state.meta.errors}
                                                  </p>
                                             )}
                                        </div>

                                   )}
                              </form.Field>

                              {/* DESCRIPTION */}
                              <form.Field
                                   name="description"
                                   validators={{
                                        onChange: ({ value }) =>
                                             !value ? "Description is required" : undefined,
                                   }}
                              >
                                   {(field) => (
                                        <div className="space-y-2">
                                             <Label>Description</Label>
                                             <Input
                                                  value={field.state.value}
                                                  onChange={(e) => field.handleChange(e.target.value)}
                                             />
                                             {field.state.meta.errors && (
                                                  <p className="text-red-500 text-sm">
                                                       {field.state.meta.errors}
                                                  </p>
                                             )}
                                        </div>
                                   )}
                              </form.Field>

                              {/* IMAGE */}
                              <ImageUploader
                                   label="Category Image"
                                   images={categoryImages.images}
                                   onUpload={categoryImages.upload}
                                   onDelete={categoryImages.remove}
                                   multiple={false}
                              />

                              <Button type="submit" className="w-full" disabled={loading}>
                                   {loading ? "Creating..." : "Create Category"}
                              </Button>

                         </form>
                    </CardContent>
               </Card>
     );
}