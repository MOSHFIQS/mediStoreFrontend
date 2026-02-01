"use client"

import { useState } from "react"
import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { toast } from "sonner"

import {
     Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

import { updateMedicineAction } from "@/actions/medicine.server"

const schema = z.object({
     name: z.string().min(1),
     price: z.number().min(1),
     stock: z.number().min(0),
     description: z.string().min(1),
     categoryId: z.string().min(1),
})

export default function UpdateMedicineClient({ medicine, categories }: any) {
     const [loading, setLoading] = useState(false)

     const form = useForm({
          defaultValues: {
               name: medicine.name,
               price: medicine.price,
               stock: medicine.stock,
               description: medicine.description,
               categoryId: medicine.categoryId,
          },
          validators: { onSubmit: schema },
          onSubmit: async ({ value }) => {
               setLoading(true)
               try {
                    await updateMedicineAction(medicine.id, value)
                    toast.success("Medicine updated successfully")
               } catch (err: any) {
                    toast.error(err.message)
               } finally {
                    setLoading(false)
               }
          },
     })

     return (
          <Card>
               <CardHeader>
                    <CardTitle>Update Medicine</CardTitle>
                    <CardDescription>Edit medicine details</CardDescription>
               </CardHeader>

               <CardContent>
                    <form id="update-medicine-form"
                         onSubmit={(e) => { e.preventDefault(); form.handleSubmit() }}>
                         <FieldGroup>

                              <form.Field name="name">
                                   {(field) => (
                                        <Field>
                                             <FieldLabel>Medicine Name</FieldLabel>
                                             <Input value={field.state.value}
                                                  onChange={(e) => field.handleChange(e.target.value)} />
                                             <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                   )}
                              </form.Field>

                              <form.Field name="price">
                                   {(field) => (
                                        <Field>
                                             <FieldLabel>Price</FieldLabel>
                                             <Input type="number" value={field.state.value}
                                                  onChange={(e) => field.handleChange(Number(e.target.value))} />
                                             <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                   )}
                              </form.Field>

                              <form.Field name="stock">
                                   {(field) => (
                                        <Field>
                                             <FieldLabel>Stock</FieldLabel>
                                             <Input type="number" value={field.state.value}
                                                  onChange={(e) => field.handleChange(Number(e.target.value))} />
                                             <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                   )}
                              </form.Field>

                              <form.Field name="description">
                                   {(field) => (
                                        <Field>
                                             <FieldLabel>Description</FieldLabel>
                                             <Textarea value={field.state.value}
                                                  onChange={(e) => field.handleChange(e.target.value)} />
                                             <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                   )}
                              </form.Field>

                              <form.Field name="categoryId">
                                   {(field) => (
                                        <Field>
                                             <FieldLabel>Category</FieldLabel>
                                             <Select value={field.state.value} onValueChange={field.handleChange}>
                                                  <SelectTrigger>
                                                       <SelectValue placeholder="Select Category" />
                                                  </SelectTrigger>
                                                  <SelectContent>
                                                       {categories.map((c: any) => (
                                                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                                       ))}
                                                  </SelectContent>
                                             </Select>
                                             <FieldError errors={field.state.meta.errors} />
                                        </Field>
                                   )}
                              </form.Field>

                         </FieldGroup>
                    </form>
               </CardContent>

               <CardFooter>
                    <Button disabled={loading} form="update-medicine-form" type="submit" className="w-full">
                         {loading ? "Updating..." : "Update Medicine"}
                    </Button>
               </CardFooter>
          </Card>
     )
}
