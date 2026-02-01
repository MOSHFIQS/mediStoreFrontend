"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { createMedicineAction } from "@/actions/medicine.server"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

export default function CreateMedicineClient({ categories }: any) {
     const [isPending, startTransition] = useTransition()

     const handleSubmit = (formData: FormData) => {
          startTransition(async () => {
               try {
                    await createMedicineAction(formData)
                    toast.success("Medicine added successfully")
               } catch (err: any) {
                    toast.error(err.message)
               }
          })
     }

     return (
          <Card>
               <CardHeader>
                    <CardTitle>Add New Medicine</CardTitle>
                    <CardDescription>Enter medicine details</CardDescription>
               </CardHeader>

               <form action={handleSubmit}>
                    <CardContent className="space-y-4">

                         <Input name="name" placeholder="Medicine Name" required />
                         <Input name="price" type="number" placeholder="Price" required />
                         <Input name="stock" type="number" placeholder="Stock" required />

                         <Textarea name="description" placeholder="Description" required />

                         <Input name="photo" type="file" accept="image/*" required />

                         <Select name="categoryId" required>
                              <SelectTrigger>
                                   <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent>
                                   {categories.map((cat: any) => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                                   ))}
                              </SelectContent>
                         </Select>

                    </CardContent>

                    <CardFooter>
                         <Button disabled={isPending} type="submit" className="w-full">
                              {isPending ? "Adding..." : "Add Medicine"}
                         </Button>
                    </CardFooter>
               </form>
          </Card>
     )
}
