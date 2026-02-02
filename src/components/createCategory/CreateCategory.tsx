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

export default function CreateCategory() {
     const [loading, setLoading] = useState(false);

     const form = useForm({
          defaultValues: {
               name: "",
          },
          onSubmit: async ({ value }) => {
               try {
                    setLoading(true);

                    const res = await createCategoryAction(value.name);

                    if (!res.ok) {
                         throw new Error(res.message);
                    }

                    toast.success(res.message);
                    form.reset();
               } catch (err: any) {
                    toast.error(err.message);
               } finally {
                    setLoading(false);
               }
          },
     });

     return (
          <div className=" mt-10">
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
                              <form.Field
                                   name="name"
                                   validators={{
                                        onChange: ({ value }) =>
                                             !value ? "Category name is required" : undefined,
                                   }}
                              >
                                   {(field) => (
                                        <div className="space-y-2">
                                             <Label>Category Name</Label>
                                             <Input
                                                  value={field.state.value}
                                                  onChange={(e) => field.handleChange(e.target.value)}
                                                  placeholder="e.g. Pain Relief"
                                             />
                                             {field.state.meta.errors ? (
                                                  <p className="text-sm text-red-500">
                                                       {field.state.meta.errors.join(", ")}
                                                  </p>
                                             ) : null}
                                        </div>
                                   )}
                              </form.Field>

                              <Button type="submit" className="w-full" disabled={loading}>
                                   {loading ? "Creating..." : "Create Category"}
                              </Button>
                         </form>
                    </CardContent>
               </Card>
          </div>
     );
}
