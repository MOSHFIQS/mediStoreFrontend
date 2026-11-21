"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote, Star, CheckCircle } from "lucide-react"

export default function TestimonialsSection() {
     const testimonials = [
          {
               name: "Dr. Sarah Rahman",
               role: "General Physician",
               text: "I regularly advise my patients to order through MediStore. Their adherence to cold-chain storage for sensitive medications like insulin is exemplary.",
               rating: 5,
               verified: "Verified Doctor"
          },
          {
               name: "Michael Chen",
               role: "Chronic Patient Care",
               text: "MediStore has completely streamlined my mother's monthly prescription schedule. Delivered right to our doorstep with genuine packaging every time.",
               rating: 5,
               verified: "Verified Buyer"
          },
          {
               name: "Emily Chowdhury",
               role: "Working Mother",
               text: "The emergency delivery service at 11 PM was a lifesaver when my daughter had a high fever. Compassionate customer service and lightning-fast dispatch.",
               rating: 5,
               verified: "Verified Buyer"
          }
     ]

     return (
          <section className="py-16">
               <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                         <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                              <Star className="w-3.5 h-3.5 fill-teal-600 text-teal-600" />
                              <span>Real Patient Stories</span>
                         </div>
                         <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                              Trusted by Patients & Physicians
                         </h2>
                         <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto leading-relaxed">
                              Read how MediStore is improving everyday healthcare outcomes across the country.
                         </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                         {testimonials.map((testimonial, idx) => (
                              <div
                                   key={idx}
                                   className="relative flex flex-col justify-between p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 hover:-translate-y-1.5 transition-all duration-300"
                              >
                                   <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                             <div className="flex gap-1">
                                                  {[...Array(5)].map((_, i) => (
                                                       <Star
                                                            key={i}
                                                            className={`w-4 h-4 ${
                                                                 i < testimonial.rating
                                                                      ? "text-amber-400 fill-amber-400"
                                                                      : "text-slate-200"
                                                            }`}
                                                       />
                                                  ))}
                                             </div>
                                             <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-200/60">
                                                  <CheckCircle className="w-3 h-3" />
                                                  {testimonial.verified}
                                             </span>
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed italic">
                                             "{testimonial.text}"
                                        </p>
                                   </div>

                                   <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                                             {testimonial.name.charAt(0)}
                                        </div>
                                        <div>
                                             <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight">
                                                  {testimonial.name}
                                             </div>
                                             <div className="text-xs text-slate-400 font-medium">
                                                  {testimonial.role}
                                             </div>
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>
          </section>
     )
}
