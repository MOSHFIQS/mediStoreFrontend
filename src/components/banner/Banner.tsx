"use client"

import * as React from "react"
import {
     Carousel,
     CarouselContent,
     CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Activity, HeartPulse, ShieldCheck, Sparkles, CheckCircle2, Clock } from "lucide-react"

export function CarouselPlugin() {
     const plugin = React.useRef(
          Autoplay({ delay: 4000, stopOnInteraction: true })
     )

     const slides = [
          {
               image: "/image2.png",
               badge: "100% Certified Healthcare",
               title: "Quality Healthcare, Delivered to Your Door",
               description: "Access verified prescription & OTC medicines with cold-chain storage and same-day delivery across the country.",
               highlight: "Cold-Chain Guaranteed",
               icon: <HeartPulse className="w-4 h-4 mr-1.5 text-teal-600" />
          },
          {
               image: "/image3.png",
               badge: "Express Pharmacy Service",
               title: "Fast, Reliable & Seamless Medicine Orders",
               description: "Upload your prescription or consult certified pharmacists online. Track every shipment in real-time.",
               highlight: "24/7 Pharmacist On-Call",
               icon: <Activity className="w-4 h-4 mr-1.5 text-cyan-600" />
          },
          {
               image: "/image1.png",
               badge: "Your Trusted Partner",
               title: "Your Premier Online Medicine Store",
               description: "Over 10,000 genuine medications and wellness essentials directly sourced from licensed pharmaceutical distributors.",
               highlight: "Authentic & Regulated",
               icon: <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" />
          },
     ]

     return (
          <div className="w-full relative overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-lg shadow-teal-900/5 bg-slate-950">
               <Carousel
                    plugins={[plugin.current]}
                    className="w-full relative"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
               >
                    <CarouselContent className="h-[62vh] md:h-[68vh] lg:h-[72vh]">
                         {slides.map((slide, index) => (
                              <CarouselItem key={index} className="relative w-full h-full">
                                   {/* Background Image with Gradient Overlay */}
                                   <div className="absolute inset-0 w-full h-full">
                                        <img
                                             src={slide.image}
                                             alt={slide.title}
                                             className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-transparent" />
                                        <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/40 to-slate-950/90" />
                                   </div>

                                   {/* Content Container */}
                                   <div className="relative h-full flex items-center w-full max-w-7xl mx-auto px-6 sm:px-10 md:px-16 z-10">
                                        <div className="max-w-2xl space-y-6 animate-in slide-in-from-bottom-8 duration-700 fade-in">
                                             {/* Badge */}
                                             <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-950/70 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold text-teal-300 shadow-sm">
                                                  {slide.icon}
                                                  <span>{slide.highlight}</span>
                                             </div>

                                             {/* Title */}
                                             <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
                                                  {slide.title}
                                             </h1>

                                             {/* Description */}
                                             <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl font-normal">
                                                  {slide.description}
                                             </p>

                                             {/* Action Buttons */}
                                             <div className="pt-2 flex flex-wrap gap-3.5 items-center">
                                                  <Button
                                                       asChild
                                                       size="lg"
                                                       className="rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-lg shadow-teal-500/25 h-12 px-8 font-semibold text-base transition-all hover:scale-105"
                                                  >
                                                       <Link href="/medicines">
                                                            Browse Medicines <ArrowRight className="ml-2 w-4 h-4" />
                                                       </Link>
                                                  </Button>
                                                  <Button
                                                       asChild
                                                       variant="outline"
                                                       size="lg"
                                                       className="rounded-full h-12 px-7 font-semibold text-base bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md transition-all"
                                                  >
                                                       <Link href="/contact">
                                                            Pharmacist Support
                                                       </Link>
                                                  </Button>
                                             </div>

                                             {/* Mini Features List */}
                                             <div className="pt-4 flex flex-wrap items-center gap-5 text-xs font-medium text-slate-300">
                                                  <div className="flex items-center gap-1.5">
                                                       <CheckCircle2 className="w-4 h-4 text-teal-400" />
                                                       <span>Prescription Verified</span>
                                                  </div>
                                                  <div className="flex items-center gap-1.5">
                                                       <Clock className="w-4 h-4 text-teal-400" />
                                                       <span>2-Hour Delivery Available</span>
                                                  </div>
                                             </div>
                                        </div>
                                   </div>
                              </CarouselItem>
                         ))}
                    </CarouselContent>
               </Carousel>
          </div>
     )
}
