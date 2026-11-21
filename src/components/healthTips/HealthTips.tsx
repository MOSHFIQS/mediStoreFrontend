"use client";

import { Sparkles, Clock, ArrowRight, HeartPulse } from "lucide-react";
import Link from "next/link";

export default function HealthTips() {
     const tips = [
          {
               title: "Stay Hydrated for Organ Health",
               summary: "Drinking 8-10 glasses of water daily boosts kidney filtration, prevents stone formation, and sustains steady cognitive energy.",
               category: "Hydration",
               time: "2 min read",
               tagColor: "bg-cyan-50 text-cyan-700 border-cyan-200",
          },
          {
               title: "Sleep & Immune System Recovery",
               summary: "Getting 7-8 hours of uninterrupted deep sleep increases cytotoxic T-cells, enhancing natural defense against seasonal viral infections.",
               category: "Immunity",
               time: "3 min read",
               tagColor: "bg-teal-50 text-teal-700 border-teal-200",
          },
          {
               title: "Essential Micronutrients & Vitamins",
               summary: "A balanced dietary regimen rich in leafy vegetables, zinc, and Vitamin D3 is critical for bone density and hormonal balance.",
               category: "Nutrition",
               time: "3 min read",
               tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
          },
          {
               title: "Cardiovascular Health & Routine",
               summary: "A brisk 30-minute daily walk lowers resting blood pressure, maintains arterial elasticity, and regulates resting blood glucose.",
               category: "Cardio",
               time: "4 min read",
               tagColor: "bg-rose-50 text-rose-700 border-rose-200",
          },
          {
               title: "Responsible Antibiotic Usage",
               summary: "Never discontinue prescribed antibiotics early, even if symptoms subside. Completing the full dosage prevents antimicrobial resistance.",
               category: "Pharmacology",
               time: "3 min read",
               tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
          },
          {
               title: "Stress Reduction & Mental Hygiene",
               summary: "Practicing controlled diaphragmatic breathing for 5 minutes twice daily significantly reduces cortisol spikes and anxiety.",
               category: "Wellness",
               time: "2 min read",
               tagColor: "bg-amber-50 text-amber-700 border-amber-200",
          },
     ];

     return (
          <section className="py-16">
               <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                         <div className="space-y-3">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                                   <HeartPulse className="w-3.5 h-3.5" />
                                   <span>Pharmacist Health Journal</span>
                              </div>
                              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                                   Expert Health & Wellness Tips
                              </h2>
                              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl">
                                   Actionable, physician-reviewed insights to help you maintain optimal vitality every day.
                              </p>
                         </div>

                         <Link
                              href="/about"
                              className="inline-flex items-center gap-1.5 text-sm font-bold text-teal-600 hover:text-teal-700 transition-colors"
                         >
                              <span>Learn more about MediStore</span>
                              <ArrowRight className="w-4 h-4" />
                         </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {tips.map((tip, index) => (
                              <div
                                   key={index}
                                   className="group flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 hover:-translate-y-1.5 transition-all duration-300"
                              >
                                   <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                             <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${tip.tagColor}`}>
                                                  {tip.category}
                                             </span>
                                             <div className="flex items-center gap-1 text-[11px] text-slate-400">
                                                  <Clock className="w-3 h-3" />
                                                  <span>{tip.time}</span>
                                             </div>
                                        </div>

                                        <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-teal-600 transition-colors leading-snug">
                                             {tip.title}
                                        </h3>

                                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                                             {tip.summary}
                                        </p>
                                   </div>

                                   <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-teal-600 dark:text-teal-400">
                                        <span>Read article</span>
                                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>
          </section>
     );
}
