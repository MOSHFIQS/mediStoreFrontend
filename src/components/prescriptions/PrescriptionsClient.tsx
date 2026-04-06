"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { uploadPrescriptionAction } from "@/actions/prescription.action";
import {
     Upload, CheckCircle, Clock, XCircle,
     FileText, Pill, ChevronDown, ChevronUp, Sparkles
} from "lucide-react";
import Image from "next/image";
import ImageUploader from "../shared/image/ImageUploader";
import { useImageUpload } from "@/hooks/useImageUpload";

/* ── Status config ─────────────────────────────────────── */
const STATUS_CONFIG: Record<string, {
     icon: React.ReactNode;
     label: string;
     bg: string;
     text: string;
     dot: string;
}> = {
     PENDING: {
          icon: <Clock className="w-3.5 h-3.5" />,
          label: "Under Review",
          bg: "bg-amber-50",
          text: "text-amber-700",
          dot: "bg-amber-400",
     },
     APPROVED: {
          icon: <CheckCircle className="w-3.5 h-3.5" />,
          label: "Approved",
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          dot: "bg-emerald-400",
     },
     REJECTED: {
          icon: <XCircle className="w-3.5 h-3.5" />,
          label: "Rejected",
          bg: "bg-red-50",
          text: "text-red-600",
          dot: "bg-red-400",
     },
};

/* ── Prescription card ─────────────────────────────────── */
function PrescriptionCard({ p }: { p: any }) {
     const [expanded, setExpanded] = useState(false);
     const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.PENDING;

     return (
          <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">

               {/* Left accent bar */}
               <div className={`absolute left-0 top-0 bottom-0 w-1 ${cfg.dot} rounded-l-2xl`} />

               <div className="pl-5 pr-4 py-4">

                    {/* Top row */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                         <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center flex-shrink-0">
                                   <FileText className="w-4 h-4 text-gray-400" />
                              </div>
                              <div>
                                   <p className="text-sm font-semibold text-gray-800 leading-none">
                                        Prescription
                                   </p>
                                   <p className="text-xs text-gray-400 mt-0.5 font-mono">
                                        #{p.id.slice(0, 8).toUpperCase()}
                                   </p>
                              </div>
                         </div>

                         <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                              {cfg.icon}
                              {cfg.label}
                         </div>
                    </div>

                    {/* Images row */}
                    {p.images?.length > 0 && (
                         <div className="flex gap-2 mb-3 flex-wrap">
                              {p.images.map((url: string, i: number) => (
                                   <a key={i} href={url} target="_blank" rel="noreferrer"
                                        className="group/img relative w-14 h-14 rounded-xl overflow-hidden border border-gray-100 hover:border-purple-300 hover:scale-105 transition-all duration-200 flex-shrink-0 shadow-sm"
                                   >
                                        <Image src={url} alt="prescription" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/10 transition-colors" />
                                   </a>
                              ))}
                         </div>
                    )}

                    {/* Notes */}
                    {p.notes && (
                         <p className="text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3 leading-relaxed">
                              {p.notes}
                         </p>
                    )}

                    {/* Prescribed medicines (expandable) */}
                    {p.status === "APPROVED" && p.items?.length > 0 && (
                         <div className="mt-2">
                              <button
                                   onClick={() => setExpanded(!expanded)}
                                   className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-800 transition-colors"
                              >
                                   <Pill className="w-3.5 h-3.5" />
                                   {p.items.length} prescribed medicine{p.items.length !== 1 ? "s" : ""}
                                   {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                              </button>

                              {expanded && (
                                   <div className="mt-2 space-y-1.5 pl-1">
                                        {p.items.map((item: any) => (
                                             <div key={item.id}
                                                  className="flex items-center gap-2 text-xs text-gray-600 bg-emerald-50 rounded-lg px-3 py-1.5"
                                             >
                                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                                                  <span className="font-medium">{item.medicineName}</span>
                                                  {item.dosage && (
                                                       <span className="text-gray-400">— {item.dosage}</span>
                                                  )}
                                                  <span className="ml-auto text-gray-400">×{item.quantity}</span>
                                             </div>
                                        ))}
                                   </div>
                              )}
                         </div>
                    )}

                    {/* Footer */}
                    <p className="text-xs text-gray-300 mt-3">
                         {new Date(p.createdAt).toLocaleDateString("en-GB", {
                              day: "numeric", month: "short", year: "numeric",
                         })}
                    </p>
               </div>
          </div>
     );
}

/* ── Main component ────────────────────────────────────── */
export default function PrescriptionsClient({ prescriptions }: { prescriptions: any[] }) {
     const router = useRouter();
     const [notes, setNotes] = useState("");
     const [loading, setLoading] = useState(false);
     const prescriptionImages = useImageUpload({ max: 5 });

     const hasImages = prescriptionImages.images.some((img) => !img.imageUploading);

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          setLoading(true);
          try {
               await uploadPrescriptionAction({
                    images: prescriptionImages.images
                         .filter((img) => !img.imageUploading)
                         .map((img) => img.img),
                    notes,
               });
               toast.success("Prescription submitted for review");
               setNotes("");
               router.refresh();
          } catch (err: any) {
               toast.error(err.message);
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="max-w-5xl w-full mx-auto px-8 py-16 space-y-12 ">

               {/* ── Page header ── */}
               <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">My Prescriptions</h1>
                    <p className="text-sm text-gray-500 mt-1">
                         Upload prescriptions for pharmacist review. Approved ones unlock Rx medicines.
                    </p>
               </div>

               {/* ── Upload card ── */}
               <div className="bg-gradient-to-br from-purple-50 via-white to-indigo-50 rounded-2xl border border-purple-100 shadow-sm overflow-hidden">

                    {/* Header strip */}
                    <div className="px-5 pt-5 pb-4 border-b border-purple-100/70">
                         <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center shadow-sm">
                                   <Upload className="w-4 h-4 text-white" />
                              </div>
                              <div>
                                   <p className="text-sm font-semibold text-gray-800">Upload Prescription</p>
                                   <p className="text-xs text-gray-400">JPEG, PNG · up to 5 images</p>
                              </div>
                         </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-5 space-y-4">
                         <ImageUploader
                              label="Prescription Images"
                              images={prescriptionImages.images}
                              onUpload={prescriptionImages.upload}
                              onDelete={prescriptionImages.remove}
                              multiple
                         />

                         <textarea
                              className="w-full border border-gray-200 bg-white rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent transition placeholder:text-gray-400"
                              rows={2}
                              placeholder="Notes for pharmacist (e.g. dosage questions, allergies)…"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                         />

                         <Button
                              type="submit"
                              disabled={loading || !hasImages}
                              className="w-full h-11 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm disabled:opacity-50 transition-all"
                         >
                              {loading ? (
                                   <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Uploading…
                                   </span>
                              ) : (
                                   <span className="flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Submit for Review
                                   </span>
                              )}
                         </Button>
                    </form>
               </div>

               {/* ── History ── */}
               {prescriptions.length > 0 ? (
                    <div className="space-y-3">
                         <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                              History · {prescriptions.length} submission{prescriptions.length !== 1 ? "s" : ""}
                         </p>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                         {prescriptions.map((p) => (
                              <PrescriptionCard key={p.id} p={p} />
                         ))}
                         </div>
                    </div>
               ) : (
                    <div className="text-center py-14 rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                         <FileText className="w-10 h-10 mx-auto text-gray-200 mb-3" />
                         <p className="text-sm font-medium text-gray-400">No prescriptions yet</p>
                         <p className="text-xs text-gray-300 mt-1">Your submission history will appear here</p>
                    </div>
               )}
          </div>
     );
}