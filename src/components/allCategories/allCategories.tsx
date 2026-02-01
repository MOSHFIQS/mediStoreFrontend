"use client";

import { useState } from "react";
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export interface Category {
     id: string;
     name: string;
     createdAt: string;
}

interface Props {
     initialCategories: Category[];
}

export default function AllCategories({ initialCategories }: Props) {
     const [categories, setCategories] = useState<Category[]>(initialCategories);
     const [loading, setLoading] = useState(false); 
     console.log(categories);

     return (
          <div className="p-6 space-y-6">
               <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Link href="/admin-dashboard/create-category">
                         <Button>Create Category</Button>
                    </Link>
               </div>

               <Card>
                    <CardHeader>
                         <CardTitle>All Categories</CardTitle>
                    </CardHeader>

                    <CardContent>
                         {loading ? (
                              <div className="flex justify-center py-10">
                                   <Loader2 className="animate-spin h-6 w-6" />
                              </div>
                         ) : (
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead>*</TableHead>
                                             <TableHead>Name</TableHead>
                                             <TableHead>Created At</TableHead>
                                        </TableRow>
                                   </TableHeader>

                                   <TableBody>
                                        {categories.length === 0 ? (
                                             <TableRow>
                                                  <TableCell colSpan={3} className="text-center">
                                                       No categories found
                                                  </TableCell>
                                             </TableRow>
                                        ) : (
                                             categories?.map((cat, index) => (
                                                  <TableRow key={cat.id}>
                                                       <TableCell>{index + 1}</TableCell>
                                                       <TableCell className="font-medium">{cat.name}</TableCell>
                                                       <TableCell>
                                                            {new Date(cat.createdAt).toLocaleDateString()}
                                                       </TableCell>
                                                  </TableRow>
                                             ))
                                        )}
                                   </TableBody>
                              </Table>
                         )}
                    </CardContent>
               </Card>
          </div>
     );
}
