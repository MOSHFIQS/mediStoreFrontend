"use client";

import { Heart, Activity, Shield, Sparkles, CheckCircle, ArrowRight } from "lucide-react";
import { Card } from "../ui/card";
import Link from "next/link";

export default function FeaturedSection() {
     const features = [
          {
               icon: <Shield className="w-7 h-7 text-teal-600 dark:text-teal-400" />,
               title: "Verified Pharmacy Network",
               description: "Every product is authenticated directly from certified licensed drug distributors.",
               badge: "Quality Assured",
               badgeColor: "bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-800",
               gradient: "from-teal-500/10 to-emerald-500/5"
          },
          {
               icon: <Activity className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />,
               title: "Climate-Controlled Shipping",
               description: "Sensitive biologicals, insulin, and vaccines transported with strict thermal monitoring.",
               badge: "Cold-Chain Safe",
               badgeColor: "bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800",
               gradient: "from-cyan-500/10 to-blue-500/5"
          },
          {
               icon: <Heart className="w-7 h-7 text-rose-600 dark:text-rose-400" />,
               title: "Pharmacist Review",
               description: "Registered pharmacists double-check prescriptions for drug interactions before packing.",
               badge: "Patient Safety",
               badgeColor: "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
               gradient: "from-rose-500/10 to-pink-500/5"
          },
          {
               icon: <Sparkles className="w-7 h-7 text-amber-600 dark:text-amber-400" />,
               title: "Affordable & Transparent",
               description: "Fair pricing, generic alternatives, and instant discounts on essential medications.",
               badge: "Best Value",
               badgeColor: "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
               gradient: "from-amber-500/10 to-orange-500/5"
          },
     ];

     return (
          <section className="py-12">
               <div className="container mx-auto px-4">
                    <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                         <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>Why Millions Choose MediStore</span>
                         </div>
                         <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                              Your Health In Safe, Caring Hands
                         </h2>
                         <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                              We make your healthcare journey simple, safe, and transparent from consultation to door delivery.
                         </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                         {features.map((feature, i) => (
                              <div
                                   key={i}
                                   className={`relative flex flex-col justify-between p-7 rounded-3xl bg-gradient-to-br ${feature.gradient} bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 hover:-translate-y-1.5 transition-all duration-300`}
                              >
                                   <div>
                                        <div className="flex items-center justify-between mb-5">
                                             <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                                                  {feature.icon}
                                             </div>
                                             <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${feature.badgeColor}`}>
                                                  {feature.badge}
                                             </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                             {feature.title}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                             {feature.description}
                                        </p>
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>
          </section>
     );
}
