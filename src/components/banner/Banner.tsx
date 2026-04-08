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
import { ArrowRight, Activity, HeartPulse, ShieldCheck } from "lucide-react"

export function CarouselPlugin() {
     const plugin = React.useRef(
          Autoplay({ delay: 3000, stopOnInteraction: true })
     )

     const slides = [
          {
               image: "/image1.png",
               title: "Your Trusted Medicine Store",
               description: "Get genuine medicines delivered to your doorstep quickly and safely with our 24/7 delivery network.",
               highlight: "100% Authentic Products",
               icon: <ShieldCheck className="w-5 h-5 mr-2" />
          },
          {
               image: "/image2.png",
               title: "Health Comes First",
               description: "We ensure quality healthcare products for you and your family. Because your wellbeing is our top priority.",
               highlight: "Affordable & Reliable",
               icon: <HeartPulse className="w-5 h-5 mr-2" />
          },
          {
               image: "/image3.png",
               title: "Fast & Easy Ordering",
               description: "Browse, order, and receive medicines with just a few clicks from the comfort of your home.",
               highlight: "24/7 Service Available",
               icon: <Activity className="w-5 h-5 mr-2" />
          },
     ]

     return (
          <div className="w-full relative overflow-hidden bg-background rounded-2xl border-2 border-gray-300">
               <Carousel
                    plugins={[plugin.current]}
                    className="w-full relative"
                    onMouseEnter={plugin.current.stop}
                    onMouseLeave={plugin.current.reset}
               >
                    <CarouselContent className="h-[60vh] md:h-[65vh] lg:h-[70vh]">
                         {slides.map((slide, index) => (
                              <CarouselItem key={index} className="relative w-full rounded-2xl">
                                   {/* Image Background */}
                                   <div className="absolute inset-0 w-full h-full rounded-2xl">
                                        <img
                                             src={slide.image}
                                             alt={slide.title}
                                             className="w-full h-full object-cover rounded-2xl"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/30 to-transparent dark:from-background dark:via-background/90 dark:to-background/20" />
                                   </div>

                                   {/* Content Container */}
                                   <div className="relative h-full flex items-center w-full max-w-7xl mx-auto px-6 sm:px-8 md:px-16">
                                        <div className="max-w-2xl space-y-6 md:space-y-8 animate-in slide-in-from-bottom-8 duration-700 fade-in zoom-in-95">

                                             {/* Highlight Badge */}
                                             <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary backdrop-blur-sm shadow-sm transition-all hover:bg-primary/20">
                                                  {slide.icon}
                                                  {slide.highlight}
                                             </div>

                                             {/* Title */}
                                             <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
                                                  {slide.title}
                                             </h2>

                                             {/* Description */}
                                             <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
                                                  {slide.description}
                                             </p>

                                             {/* CTA Buttons */}
                                             <div className="pt-4 flex flex-wrap gap-4 items-center">
                                                  <Button asChild size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-all h-12 px-8 font-semibold text-base">
                                                       <Link href="/medicines">
                                                            Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                                                       </Link>
                                                  </Button>
                                                  <Button asChild variant="outline" size="lg" className="rounded-full h-12 px-8 font-semibold text-base border-primary/20 hover:bg-primary/5">
                                                       <Link href="/contact">
                                                            Contact Support
                                                       </Link>
                                                  </Button>
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