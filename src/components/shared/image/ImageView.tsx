"use client";

import { useState } from "react";
import Image from "next/image";

import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
} from "@/components/ui/dialog";



import { Button } from "@/components/ui/button";

import { Eye, Trash2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export type ImageType = {
     id: string;
     name: string;
     img: string;
     imageUploading?: boolean;
};

type ImageListProps = {
     imgList: ImageType[];
     onImageDelete: (img: ImageType) => void;
};

export default function ImageView({
     imgList,
     onImageDelete,
}: ImageListProps) {
     const [selectedImg, setSelectedImg] = useState<ImageType | null>(null);
     const [viewOpen, setViewOpen] = useState(false);
     const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

     const handleViewOpen = (img: ImageType) => {
          setSelectedImg(img);
          setViewOpen(true);
     };

     const handleDeleteConfirm = (img: ImageType) => {
          setSelectedImg(img);
          setDeleteDialogOpen(true);
     };

     const handleDelete = () => {
          if (selectedImg) {
               onImageDelete(selectedImg);
               setDeleteDialogOpen(false);
               setSelectedImg(null);
          }
     };

     return (
          <>
               {imgList.map((img) => (
                    <div
                         key={img.id}
                         className="relative rounded-xl border border-gray-200 overflow-hidden group w-36 h-36 flex  items-center justify-center"
                    >
                         <Image
                              src={img.img}
                              alt={img.name}
                              width={140}
                              height={140}
                              className={`rounded-lg max-h-35 max-w-full object-cover ${img.imageUploading ? "opacity-50" : "opacity-100"}`}
                         />

                         {/* Spinner on this image */}
                         {img.imageUploading && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                                   <Spinner className="h-6 w-6 text-white" />
                              </div>
                         )}

                         {/* Hover buttons */}
                         {!img.imageUploading && (
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex justify-center items-center gap-2 opacity-0 group-hover:opacity-100">
                                   <button
                                        type="button"
                                        onClick={() => handleViewOpen(img)}
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition"
                                   >
                                        <Eye className="h-5 w-5 text-gray-800" />
                                   </button>

                                   <button
                                        type="button"
                                        onClick={() => handleDeleteConfirm(img)}
                                        className="bg-white p-2 rounded-full shadow-md hover:bg-red-100 transition"
                                   >
                                        <Trash2 className="h-5 w-5 text-red-600" />
                                   </button>
                              </div>
                         )}
                    </div>
               ))}

               {/* IMAGE VIEW MODAL */}
               <Dialog open={viewOpen} onOpenChange={setViewOpen}>
                    <DialogContent className="max-w-2xl">
                         <DialogHeader>
                              <DialogTitle>{selectedImg?.name}</DialogTitle>
                         </DialogHeader>

                         {selectedImg && (
                              <div className="flex justify-center">
                                   <Image
                                        src={selectedImg.img}
                                        alt={selectedImg.name}
                                        width={600}
                                        height={600}
                                        className="max-w-full max-h-[70vh] object-contain rounded-lg"
                                   />
                              </div>
                         )}
                    </DialogContent>
               </Dialog>

               {/* DELETE CONFIRMATION */}
               <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                    <DialogContent>
                         <DialogHeader>
                              <DialogTitle>Remove Image</DialogTitle>
                         </DialogHeader>

                         <p>Are you sure you want to remove this image?</p>

                         <div className="flex justify-end gap-2 mt-4">
                              <Button
                                   variant="outline"
                                   onClick={() => setDeleteDialogOpen(false)}
                              >
                                   Cancel
                              </Button>

                              <Button variant="destructive" onClick={handleDelete}>
                                   Delete
                              </Button>
                         </div>
                    </DialogContent>
               </Dialog>
          </>
     );
}

