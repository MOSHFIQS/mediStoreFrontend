"use client"

import { Users, Award, ShieldCheck, Clock } from "lucide-react"

export default function StatisticsSection() {
     const stats = [
          {
               value: "50K+",
               label: "Happy Patients",
               description: "Served nationwide",
               icon: <Users className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          },
          {
               value: "100+",
               label: "Certified Doctors",
               description: "On-call specialists",
               icon: <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          },
          {
               value: "10K+",
               label: "Verified Medicines",
               description: "100% genuine inventory",
               icon: <ShieldCheck className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          },
          {
               value: "99.8%",
               label: "On-Time Delivery",
               description: "2-hour express dispatch",
               icon: <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          },
     ]

     return (
          <section className="py-16 my-8 rounded-3xl bg-gradient-to-br from-teal-900 via-slate-900 to-teal-950 text-white relative overflow-hidden shadow-xl shadow-teal-950/20">
               {/* Ambient Glows */}
               <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
               <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

               <div className="container relative mx-auto px-6 md:px-12 z-10">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                         {stats.map((stat, index) => (
                              <div
                                   key={index}
                                   className={`flex flex-col items-center text-center space-y-2.5 ${index > 0 ? "pt-6 lg:pt-0" : ""}`}
                              >
                                   <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-1">
                                        {stat.icon}
                                   </div>
                                   <span className="text-4xl md:text-5xl font-black tracking-tight text-white">
                                        {stat.value}
                                   </span>
                                   <span className="text-sm font-bold uppercase tracking-wider text-teal-300">
                                        {stat.label}
                                   </span>
                                   <p className="text-xs text-slate-400 font-medium">
                                        {stat.description}
                                   </p>
                              </div>
                         ))}
                    </div>
               </div>
          </section>
     )
}
