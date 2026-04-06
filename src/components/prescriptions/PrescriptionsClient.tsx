"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { uploadPrescriptionAction } from "@/actions/prescription.action";
import { Upload, FileImage, CheckCircle, Clock, XCircle } from "lucide-react";
import Image from "next/image";

const statusIcon: Record<string, any> = {
     PENDING: <Clock className="w-4 h-4 text-yellow-500" />,
     APPROVED: <CheckCircle className="w-4 h-4 text-green-500" />,
     REJECTED: <XCircle className="w-4 h-4 text-red-500" />,
};

export default function PrescriptionsClient({ prescriptions }: { prescriptions: any[] }) {
     const router = useRouter();
     const fileRef = useRef<HTMLInputElement>(null);
     const [notes, setNotes] = useState("");
     const [previews, setPreviews] = useState<string[]>([]);
     const [files, setFiles] = useState<File[]>([]);
     const [loading, setLoading] = useState(false);

     const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const selected = Array.from(e.target.files || []);
          setFiles(selected);
          setPreviews(selected.map((f) => URL.createObjectURL(f)));
     };

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!files.length) return toast.error("Please select at least one image");
          setLoading(true);
          try {
               const fd = new FormData();
               files.forEach((f) => fd.append("images", f));
               if (notes) fd.append("notes", notes);
               await uploadPrescriptionAction(fd);
               toast.success("Prescription uploaded for review");
               setFiles([]);
               setPreviews([]);
               setNotes("");
               router.refresh();
          } catch (err: any) {
               toast.error(err.message);
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="max-w-2xl mx-auto p-4 space-y-6">
               <h1 className="text-2xl font-bold">My Prescriptions</h1>

               {/* Upload form */}
               <Card>
                    <CardHeader><CardTitle className="text-base flex items-center gap-2"><Upload className="w-4 h-4" />Upload Prescription</CardTitle></CardHeader>
                    <CardContent>
                         <form onSubmit={handleSubmit} className="space-y-4">
                              <div
                                   className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:bg-gray-50 transition"
                                   onClick={() => fileRef.current?.click()}
                              >
                                   <FileImage className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                                   <p className="text-sm text-muted-foreground">Click to select prescription images</p>
                                   <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
                              </div>

                              {previews.length > 0 && (
                                   <div className="flex flex-wrap gap-2">
                                        {previews.map((src, i) => (
                                             <div key={i} className="relative w-20 h-20 rounded overflow-hidden border">
                                                  <Image src={src} alt={`preview-${i}`} fill className="object-cover" />
                                             </div>
                                        ))}
                                   </div>
                              )}

                              <textarea
                                   className="w-full border rounded-lg p-2 text-sm resize-none"
                                   rows={2}
                                   placeholder="Notes for pharmacist (optional)..."
                                   value={notes}
                                   onChange={(e) => setNotes(e.target.value)}
                              />
                              <Button type="submit" disabled={loading || !files.length} className="w-full">
                                   {loading ? "Uploading..." : "Submit Prescription"}
                              </Button>
                         </form>
                    </CardContent>
               </Card>

               {/* Prescription history */}
               {prescriptions.map((p) => (
                    <Card key={p.id}>
                         <CardContent className="p-4 space-y-3">
                              <div className="flex items-center justify-between">
                                   <span className="text-sm font-mono text-muted-foreground">#{p.id.slice(0, 8)}</span>
                                   <span className="flex items-center gap-1 text-sm font-medium">
                                        {statusIcon[p.status]} {p.status}
                                   </span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                   {p.images.map((url: string, i: number) => (
                                        <a key={i} href={url} target="_blank" rel="noreferrer">
                                             <div className="relative w-16 h-16 rounded overflow-hidden border hover:opacity-80 transition">
                                                  <Image src={url} alt="prescription" fill className="object-cover" />
                                             </div>
                                        </a>
                                   ))}
                              </div>
                              {p.notes && <p className="text-xs text-muted-foreground">{p.notes}</p>}
                              {p.status === "APPROVED" && p.items?.length > 0 && (
                                   <div>
                                        <p className="text-xs font-semibold mb-1">Prescribed medicines:</p>
                                        {p.items.map((item: any) => (
                                             <p key={item.id} className="text-xs text-muted-foreground">
                                                  • {item.medicineName} {item.dosage && `— ${item.dosage}`} × {item.quantity}
                                             </p>
                                        ))}
                                   </div>
                              )}
                              <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleDateString()}</p>
                         </CardContent>
                    </Card>
               ))}
          </div>
     );
}