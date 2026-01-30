"use client"

import { useEffect, useState } from "react"
import { medicineService } from "@/service/medicine.service"
import {
     Table,
     TableHeader,
     TableRow,
     TableHead,
     TableBody,
     TableCell,
} from "@/components/ui/table"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface Medicine {
     id: string
     name: string
     price: number
     stock: number
     image?: string
     category?: { name: string }
     seller?: { name: string }
}

export default function AllMedicines() {
     const [medicines, setMedicines] = useState<Medicine[]>([])
     const [loading, setLoading] = useState(true)

     useEffect(() => {
          const loadMedicines = async () => {
               const res = await medicineService.getAll()
               if (res.ok) {
                    setMedicines(res.data.data)
               }
               setLoading(false)
          }

          loadMedicines()
     }, [])

     return (
          <Card>
               <CardHeader>
                    <CardTitle>All Medicines</CardTitle>
               </CardHeader>

               <CardContent>
                    {loading ? (
                         <p>Loading medicines...</p>
                    ) : (
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        <TableHead>Image</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Seller</TableHead>
                                        <TableHead>Price</TableHead>
                                        <TableHead>Stock</TableHead>
                                   </TableRow>
                              </TableHeader>

                              <TableBody>
                                   {medicines.map((med) => (
                                        <TableRow key={med.id}>
                                             <TableCell>
                                                  {med.image ? (
                                                       <img
                                                            src={med.image}
                                                            alt={med.name}
                                                            className="w-12 h-12 object-cover rounded"
                                                       />
                                                  ) : (
                                                       "No Image"
                                                  )}
                                             </TableCell>

                                             <TableCell>{med.name}</TableCell>
                                             <TableCell>{med.category?.name || "—"}</TableCell>
                                             <TableCell>{med.seller?.name || "—"}</TableCell>
                                             <TableCell>৳ {med.price}</TableCell>
                                             <TableCell>
                                                  {med.stock > 0 ? (
                                                       <span className="text-green-600 font-medium">
                                                            {med.stock}
                                                       </span>
                                                  ) : (
                                                       <span className="text-red-600 font-medium">Out</span>
                                                  )}
                                             </TableCell>
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                    )}
               </CardContent>
          </Card>
     )
}
