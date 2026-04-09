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
} from "@/components/ui/dialog";
import { Pencil, Trash2, Plus, Tag, FolderOpen } from "lucide-react";

export interface Category {
     id: string;
     name: string;
     image?: string;
     description?: string;
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
          <div className="h-full bg-gray-50/50 p-6 space-y-6">
               {/* Page Header */}
               <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-orange-100 flex items-center justify-center">
                              <Tag className="h-5 w-5 text-orange-600" />
                         </div>
                         <div>
                              <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
                              <p className="text-sm text-gray-500">{initialCategories.length} total categories</p>
                         </div>
                    </div>
                    <Link href="/admin-dashboard/category/create">
                         <Button className="bg-orange-500 hover:bg-orange-600 text-white gap-2 rounded-lg px-4 shadow-sm">
                              <Plus className="h-4 w-4" />
                              New Category
                         </Button>
                    </Link>
               </div>

               {/* Table Card */}
               <div className="bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                         <h2 className="text-sm font-semibold text-gray-700">All Categories</h2>
                         <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-3 py-1">
                              {initialCategories.length} entries
                         </span>
                    </div>

                    {loading ? (
                         <div className="flex items-center justify-center py-20">
                              <Loading />
                         </div>
                    ) : (
                         <Table>
                              <TableHeader>
                                   <TableRow className="bg-gray-50/70 hover:bg-gray-50/70">
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-12 pl-5">#</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">Image</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Created</TableHead>
                                        <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wide text-right pr-5">Actions</TableHead>
                                   </TableRow>
                              </TableHeader>

                              <TableBody>
                                   {initialCategories.length === 0 ? (
                                        <TableRow>
                                             <TableCell colSpan={6}>
                                                  <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
                                                       <FolderOpen className="h-10 w-10 text-gray-300" />
                                                       <p className="text-sm font-medium">No categories yet</p>
                                                       <p className="text-xs">Create your first category to get started</p>
                                                  </div>
                                             </TableCell>
                                        </TableRow>
                                   ) : (
                                        initialCategories.map((cat, index) => (
                                             <TableRow
                                                  key={cat.id}
                                                  className="hover:bg-orange-50/30 transition-colors border-gray-50"
                                             >
                                                  <TableCell className="pl-5 text-sm text-gray-400 font-mono">{String(index + 1).padStart(2, "0")}</TableCell>
                                                  <TableCell>
                                                       {cat.image ? (
                                                            <AppImage
                                                                 src={cat.image}
                                                                 alt={cat.name}
                                                                 className="h-11 w-11 rounded-xl object-cover border border-gray-300"
                                                            />
                                                       ) : (
                                                            <div className="h-11 w-11 flex items-center justify-center bg-gray-100 rounded-xl border border-gray-100 text-xs text-gray-400 font-medium">
                                                                 N/A
                                                            </div>
                                                       )}
                                                  </TableCell>
                                                  <TableCell>
                                                       <span className="text-sm font-semibold text-gray-800">{cat.name}</span>
                                                  </TableCell>
                                                  <TableCell className="max-w-xs">
                                                       <span
                                                            className="text-sm text-gray-500 line-clamp-1"
                                                            title={cat.description}
                                                       >
                                                            {cat.description || <span className="italic text-gray-300">No description</span>}
                                                       </span>
                                                  </TableCell>
                                                  <TableCell>
                                                       <span className="text-sm text-gray-400">
                                                            {new Date(cat.createdAt).toLocaleDateString("en-US", {
                                                                 month: "short",
                                                                 day: "numeric",
                                                                 year: "numeric",
                                                            })}
                                                       </span>
                                                  </TableCell>
                                                  <TableCell className="text-right pr-5">
                                                       <div className="flex items-center justify-end gap-2">
                                                            <Link href={`/admin-dashboard/category/update/${cat.id}`}>
                                                                 <Button
                                                                      size="sm"
                                                                      variant="outline"
                                                                      className="h-8 w-8 p-0 rounded-lg border-gray-200 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600 transition-colors"
                                                                 >
                                                                      <Pencil className="h-3.5 w-3.5" />
                                                                 </Button>
                                                            </Link>
                                                            <Button
                                                                 size="sm"
                                                                 variant="ghost"
                                                                 className="h-8 w-8 p-0 border rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                                                 onClick={() => openDeleteDialog(cat)}
                                                            >
                                                                 <Trash2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                       </div>
                                                  </TableCell>
                                             </TableRow>
                                        ))
                                   )}
                              </TableBody>
                         </Table>
                    )}
               </div>

               {/* Delete Dialog */}
               <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-md rounded-2xl border-gray-100 p-0 overflow-hidden">
                         <div className="p-6 pb-0">
                              <div className="flex items-center gap-4 mb-4">
                                   <div className="h-11 w-11 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                                        <Trash2 className="h-5 w-5 text-red-500" />
                                   </div>
                                   <DialogHeader className="text-left space-y-0">
                                        <DialogTitle className="text-base font-semibold text-gray-900">Delete Category</DialogTitle>
                                        <p className="text-sm text-gray-500 mt-0.5">This action cannot be undone</p>
                                   </DialogHeader>
                              </div>
                              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                                   You are about to delete{" "}
                                   <span className="font-semibold text-gray-900">&ldquo;{selectedCategory?.name}&rdquo;</span>.
                                   All associated data will be permanently removed.
                              </p>
                         </div>
                         <DialogFooter className="flex gap-2 p-6 pt-4">
                              <Button
                                   variant="outline"
                                   className="flex-1 rounded-lg border-gray-200"
                                   onClick={() => setIsDialogOpen(false)}
                                   disabled={actionLoading === selectedCategory?.id}
                              >
                                   Cancel
                              </Button>
                              <Button
                                   className="flex-1 rounded-lg bg-red-500 hover:bg-red-600 text-white border-0"
                                   onClick={handleDelete}
                                   disabled={actionLoading === selectedCategory?.id}
                              >
                                   {actionLoading === selectedCategory?.id ? "Deleting..." : "Delete"}
                              </Button>
                         </DialogFooter>
                    </DialogContent>
               </Dialog>
          </div>
     );
}