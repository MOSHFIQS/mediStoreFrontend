"use client"

import { useState, useEffect } from "react"
import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { toast } from "sonner"

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

import { categoryService } from "@/service/category.service"
import { medicineService } from "@/service/medicine.service"
import { imageHostingService } from "@/service/image-hosting.service"

interface Category {
     id: string
     name: string
}


const medicineFormSchema = z.object({
     name: z.string().min(1, "Medicine name is required"),
     price: z.number().min(1, "Price must be at least 0"),
     stock: z.number().min(1, "Stock must be at least 0"),
     description: z.string().min(1, "Description is required"),
     categoryId: z.string().min(1, "Category is required"),
     photo: z
          .array(z.instanceof(File))
          .min(1, "Please upload a medicine image")
})

export default function CreateMedicinePage() {
     const [categories, setCategories] = useState<Category[]>([])
     const [loading, setLoading] = useState(false)

     useEffect(() => {
          const loadCategories = async () => {
               const res = await categoryService.getAll()
               if (res.ok) setCategories(res.data.data)
          }
          loadCategories()
     }, [])

     const form = useForm({
          defaultValues: {
               name: "",
               price: 0,
               stock: 0,
               description: "",
               categoryId: "",
               photo: [] as File[]
          },
          validators: {
               onSubmit: medicineFormSchema
          },
          onSubmit: async ({ value }) => {
               setLoading(true)
               try {
                    const file = value.photo[0]

                    // Upload image first
                    const uploadRes = await imageHostingService.uploadImage(file)
                    if (!uploadRes.ok || !uploadRes.url) {
                         toast.error("Image upload failed")
                         return
                    }

                    // Create medicine
                    const res = await medicineService.create({
                         name: value.name,
                         description: value.description,
                         categoryId: value.categoryId,
                         price: value.price,
                         stock: value.stock,
                         image: uploadRes.url
                    })

                    if (res.ok) {
                         toast.success("Medicine created successfully")
                         form.reset()
                    } else {
                         toast.error(res.message || "Failed to create medicine")
                    }
               } catch (err) {
                    toast.error("Something went wrong")
               } finally {
                    setLoading(false)
               }
          }
     })

     return (
          <Card>
               <CardHeader>
                    <CardTitle>Add New Medicine</CardTitle>
                    <CardDescription>Enter medicine details to add into inventory</CardDescription>
               </CardHeader>

               <CardContent>
                    <form
                         id="create-medicine-form"
                         onSubmit={(e) => {
                              e.preventDefault()
                              form.handleSubmit()
                         }}
                    >
                         <FieldGroup>
                              {/* Name */}
                              <form.Field name="name">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Medicine Name</FieldLabel>
                                                  <Input
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                       placeholder="Enter Medicine Name"
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Price */}
                              <form.Field name="price">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                                                  <Input
                                                       type="number"
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value || ""}
                                                       onChange={(e) => field.handleChange(Number(e.target.value))}
                                                       placeholder="Enter Medicine Price"
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Stock */}
                              <form.Field name="stock">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Stock Quantity</FieldLabel>
                                                  <Input
                                                       type="number"
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value || ""}
                                                       onChange={(e) => field.handleChange(Number(e.target.value))}
                                                       placeholder="Enter Stock Quantity"
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Description */}
                              <form.Field name="description">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                                  <Textarea
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                       rows={4}
                                                       placeholder="Enter Medicine Description"
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Image */}
                              <form.Field name="photo">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel>Medicine Image</FieldLabel>
                                                  <Input
                                                       type="file"
                                                       accept="image/*"
                                                       onChange={(e) => field.handleChange(Array.from(e.target.files || []))}
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Category */}
                              <form.Field name="categoryId">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                                                  <Select name={field.name} value={field.state.value} onValueChange={field.handleChange}>
                                                       <SelectTrigger aria-invalid={isInvalid}>
                                                            <SelectValue placeholder="Select Category" />
                                                       </SelectTrigger>
                                                       <SelectContent>
                                                            {categories.map((category) => (
                                                                 <SelectItem key={category.id} value={category.id}>
                                                                      {category.name}
                                                                 </SelectItem>
                                                            ))}
                                                       </SelectContent>
                                                  </Select>
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>
                         </FieldGroup>
                    </form>
               </CardContent>

               <CardFooter className="flex justify-end">
                    <Button disabled={loading} form="create-medicine-form" type="submit" className="w-full cursor-pointer">
                         {loading ? "Adding..." : "Add Medicine"}
                    </Button>
               </CardFooter>
          </Card>
     )
}
