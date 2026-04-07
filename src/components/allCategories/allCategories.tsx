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
import Link from "next/link";
import Loading from "../loading/Loading";
import { toast } from "sonner";
import { deleteCategoryAction } from "@/actions/category.action";
import { AppImage } from "../shared/image/AppImage";
import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
     DialogFooter,
     DialogTrigger,
} from "@/components/ui/dialog";
import { Pencil, Trash2 } from "lucide-react";

export interface Category {
     id: string;
     name: string;
     image?: string;
     createdAt: string;
}

interface Props {
     initialCategories: Category[];
}

export default function AllCategories({ initialCategories }: Props) {
     const [loading, setLoading] = useState(false);
     const [actionLoading, setActionLoading] = useState<string>("");
     const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
     const [isDialogOpen, setIsDialogOpen] = useState(false);

     const openDeleteDialog = (category: Category) => {
          setSelectedCategory(category);
          setIsDialogOpen(true);
     };

     const handleDelete = async () => {
          if (!selectedCategory) return;

          try {
               setActionLoading(selectedCategory.id);
               await deleteCategoryAction(selectedCategory.id);
               toast.success("Category deleted successfully");
          } catch (err: any) {
               toast.error(err?.message || "Failed to delete category");
          } finally {
               setActionLoading("");
               setIsDialogOpen(false);
               setSelectedCategory(null);
          }
     };

     return (
          <div className="p-6 space-y-6">
               <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Link href="/admin-dashboard/category/create">
                         <Button>Create Category</Button>
                    </Link>
               </div>

               <Card>
                    <CardHeader>
                         <CardTitle>All Categories</CardTitle>
                    </CardHeader>

                    <CardContent>
                         {loading ? (
                              <Loading />
                         ) : (
                              <Table>
                                   <TableHeader>
                                        <TableRow>
                                             <TableHead>#</TableHead>
                                             <TableHead>Image</TableHead>
                                             <TableHead>Name</TableHead>
                                             <TableHead>Created At</TableHead>
                                             <TableHead>Actions</TableHead>
                                        </TableRow>
                                   </TableHeader>

                                   <TableBody>
                                        {initialCategories.length === 0 ? (
                                             <TableRow>
                                                  <TableCell colSpan={5} className="text-center">
                                                       No categories found
                                                  </TableCell>
                                             </TableRow>
                                        ) : (
                                             initialCategories.map((cat, index) => (
                                                  <TableRow key={cat.id}>
                                                       <TableCell>{index + 1}</TableCell>
                                                       <TableCell>
                                                            {cat.image ? (
                                                                 <AppImage
                                                                      src={cat.image}
                                                                      alt={cat.name}
                                                                      className="h-12 w-12 rounded object-cover"
                                                                 />
                                                            ) : (
                                                                 <div className="h-12 w-12 flex items-center justify-center border rounded">
                                                                      N/A
                                                                 </div>
                                                            )}
                                                       </TableCell>
                                                       <TableCell className="font-medium">{cat.name}</TableCell>
                                                       <TableCell>
                                                            {new Date(cat.createdAt).toLocaleDateString()}
                                                       </TableCell>
                                                       <TableCell className="flex gap-2">
                                                            <Link href={`/admin-dashboard/category/update/${cat.id}`}>
                                                                 <Button size="sm" variant="outline">
                                                                      <Pencil className="h-4 w-4" />
                                                                 </Button>
                                                            </Link>

                                                            <Button
                                                                 size="sm"
                                                                 variant="destructive"
                                                                 onClick={() => openDeleteDialog(cat)}
                                                            >
                                                                 <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                       </TableCell>
                                                  </TableRow>
                                             ))
                                        )}
                                   </TableBody>
                              </Table>
                         )}
                    </CardContent>
               </Card>

               {/* Delete Confirmation Dialog */}
               <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>Delete Category</DialogTitle>
                         </DialogHeader>
                         <p>
                              Are you sure you want to delete{" "}
                              <span className="font-medium">
                                   {selectedCategory?.name}
                              </span>
                              ? This action cannot be undone.
                         </p>
                         <DialogFooter className="mt-4 flex justify-end gap-2">
                              <Button
                                   variant="outline"
                                   onClick={() => setIsDialogOpen(false)}
                                   disabled={actionLoading === selectedCategory?.id}
                              >
                                   Cancel
                              </Button>
                              <Button
                                   variant="destructive"
                                   onClick={handleDelete}
                                   disabled={actionLoading === selectedCategory?.id}
                              >
                                   {actionLoading === selectedCategory?.id
                                        ? "Deleting..."
                                        : "Delete"}
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </div>
     );
}