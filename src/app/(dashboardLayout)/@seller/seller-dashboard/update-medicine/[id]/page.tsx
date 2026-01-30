"use client"

import { useState, useEffect } from "react"
import { useForm } from "@tanstack/react-form"
import * as z from "zod"
import { toast } from "sonner"

import {
     Card,
     CardHeader,
     CardTitle,
     CardDescription,
     CardContent,
     CardFooter
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

import { categoryService } from "@/service/category.service"
import { medicineService } from "@/service/medicine.service"
import { imageHostingService } from "@/service/image-hosting.service"
import { useParams } from "next/navigation"

interface Category {
     id: string
     name: string
}

const medicineFormSchema = z.object({
     name: z.string().min(1, "Medicine name is required"),
     price: z.number().min(1, "Price must be at least 1"),
     stock: z.number().min(0, "Stock must be at least 0"),
     description: z.string().min(1, "Description is required"),
     categoryId: z.string().min(1, "Category is required")
})

export default function UpdateMedicinePage() {
     const {id} = useParams()
     const medicineId = id as string 
     const [categories, setCategories] = useState<Category[]>([])
     const [loading, setLoading] = useState(false)
     const [medicine, setMedicine] = useState<any>(null)

     console.log(medicine);

     useEffect(() => {
          if (medicine) {
               form.setFieldValue("name", medicine.name)
               form.setFieldValue("price", medicine.price)
               form.setFieldValue("stock", medicine.stock)
               form.setFieldValue("description", medicine.description)
               form.setFieldValue("categoryId", medicine.categoryId)
          }
     }, [medicine])


     const form = useForm({
          defaultValues: {
               name: "",
               price: 0,
               stock: 0,
               description: "",
               categoryId: ""
          },
          validators: {
               onSubmit: medicineFormSchema
          },
          onSubmit: async ({ value }) => {

               if (!medicineId) {
                    toast.error("Invalid medicine ID")
                    return
               }

               setLoading(true)
               try {

                    const payload: any = {
                         name: value.name,
                         price: value.price,
                         stock: value.stock,
                         description: value.description,
                         categoryId: value.categoryId
                    }

                    const res = await medicineService.update(medicineId, payload)
                    console.log(res);
                    if (res.ok) toast.success("Medicine updated successfully")
                    else toast.error(res.message || "Failed to update medicine")
               } catch (err) {
                    toast.error("Something went wrong")
               } finally {
                    setLoading(false)
               }
          }
     })

     // Load categories
     useEffect(() => {
          const loadCategories = async () => {
               const res = await categoryService.getAll()
               if (res.ok) setCategories(res.data.data)
          }
          loadCategories()
     }, [])


     // Load existing medicine
     useEffect(() => {
          if (!medicineId) return
          const loadMedicine = async () => {
               const res = await medicineService.getById(medicineId)
               if (res.ok) {
                    setMedicine(res.data.data)
               }
          }
          loadMedicine()
     }, [medicineId])

     return (
          <Card>
               <CardHeader>
                    <CardTitle>Update Medicine</CardTitle>
                    <CardDescription>Update details of your medicine</CardDescription>
               </CardHeader>

               <CardContent>
                    <form
                         id="update-medicine-form"
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


                              {/* Category */}
                              <form.Field name="categoryId">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                                                  <Select
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onValueChange={field.handleChange}
                                                  >
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
                    <Button
                         disabled={loading}
                         form="update-medicine-form"
                         type="submit"
                         className="w-full cursor-pointer"
                    >
                         {loading ? "Updating..." : "Update Medicine"}
                    </Button>
               </CardFooter>
          </Card>
     )
}
