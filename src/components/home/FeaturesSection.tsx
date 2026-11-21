"use client"

import { ShieldCheck, Truck, Clock, HeadphonesIcon } from "lucide-react"

export default function FeaturesSection() {
     const features = [
          {
               icon: <Truck className="w-7 h-7 text-teal-600 dark:text-teal-400" />,
               title: "Express Delivery",
               description: "Fast temperature-controlled dispatch for all essential & life-saving medicines."
          },
          {
               icon: <ShieldCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />,
               title: "100% Genuine Guarantee",
               description: "Strictly sourced from verified, licensed pharmaceutical manufacturers."
          },
          {
               icon: <Clock className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />,
               title: "24/7 Availability",
               description: "Place orders day or night. Our emergency support team never sleeps."
          },
          {
               icon: <HeadphonesIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />,
               title: "Licensed Pharmacists",
               description: "Free medical consultation and dosage guidance by accredited professionals."
          }
     ]

     return (
          <section className="py-6">
               <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                         {features.map((feature, index) => (
                              <div
                                   key={index}
                                   className="group flex flex-col items-center text-center p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-teal-900/5 hover:-translate-y-1.5 transition-all duration-300"
                              >
                                   <div className="p-4 bg-teal-50 dark:bg-teal-950/50 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300 border border-teal-100 dark:border-teal-900/50">
                                        {feature.icon}
                                   </div>
                                   <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white">
                                        {feature.title}
                                   </h3>
                                   <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                                        {feature.description}
                                   </p>
                              </div>
                         ))}
                    </div>
               </div>
          </section>
     )
}
