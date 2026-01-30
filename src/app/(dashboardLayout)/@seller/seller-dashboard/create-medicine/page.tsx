"use client"

import { useEffect, useState } from "react"
import { useForm } from "@tanstack/react-form"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
     Field,
     FieldError,
     FieldGroup,
     FieldLabel,
} from "@/components/ui/field"
import {
     Select,
     SelectTrigger,
     SelectValue,
     SelectContent,
     SelectItem,
} from "@/components/ui/select"
import { toast } from "sonner"
import { categoryService } from "@/service/category.service"
import { medicineService } from "@/service/medicine.service"
import { imageHostingService } from "@/service/image-hosting.service"

interface Category {
     id: string
     name: string
}


export default function CreateMedicinePage() {
     const [categories, setCategories] = useState<Category[]>([])

     useEffect(() => {
          const load = async () => {
               const res = await categoryService.getAll()
               if (res.ok) setCategories(res.data.data)
          }
          load()
     }, [])

     const form = useForm({
          defaultValues: {
               name: "",
               price: "",
               stock: "",
               photo: [] as File[],
               categoryId: "",
               description: ""
          },
          onSubmit: async ({ value }) => {
               try {
                    // 🔥 upload image first
                    const file = value.photo?.[0]
                    if (!file) {
                         toast.error("Please select an image")
                         return
                    }

                    const uploadRes = await imageHostingService.uploadImage(file)

                    if (!uploadRes.ok || !uploadRes.url) {
                         toast.error("Image upload failed")
                         return
                    }

                    // 🚀 send data to backend with image URL
                    const res = await medicineService.create({
                         name: value.name,
                         description: value.description,
                         categoryId: value.categoryId,
                         price: Number(value.price),
                         stock: Number(value.stock),
                         image: uploadRes.url,   // 👈 URL from hosting service
                    })

                    if (res.ok) {
                         toast.success("Medicine created")
                         form.reset()
                    } else {
                         toast.error(res.message || "Failed to create medicine")
                    }

               } catch (err) {
                    toast.error("Something went wrong")
               }
          }

     })

     return (
          <Card >
               <CardHeader>
                    <CardTitle>Add New Medicine</CardTitle>
                    <CardDescription>
                         Enter medicine details to add into inventory
                    </CardDescription>
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
                                        const isInvalid =
                                             field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Medicine Name</FieldLabel>
                                                  <Input
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Price */}
                              <form.Field name="price">
                                   {(field) => {
                                        const isInvalid =
                                             field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Price</FieldLabel>
                                                  <Input
                                                       type="number"
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>
                              {/* Description */}
                              <form.Field name="description">
                                   {(field) => {
                                        const isInvalid =
                                             field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                                                  <Input
                                                       type="text"
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Stock */}
                              <form.Field name="stock">
                                   {(field) => {
                                        const isInvalid =
                                             field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Stock Quantity</FieldLabel>
                                                  <Input
                                                       type="number"
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Image */}
                              {/* Image Upload */}
                              <form.Field name="photo">
                                   {(field) => {
                                        const isInvalid =
                                             field.state.meta.isTouched && !field.state.meta.isValid

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


                              {/* Category Select */}
                              <form.Field name="categoryId">
                                   {(field) => {
                                        const isInvalid =
                                             field.state.meta.isTouched && !field.state.meta.isValid
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
                    <Button form="create-medicine-form" type="submit" className="w-full">
                         Add Medicine
                    </Button>
               </CardFooter>
          </Card>
     )
}
