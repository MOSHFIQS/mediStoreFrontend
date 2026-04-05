"use client"

import * as React from "react"
import {
     Carousel,
     CarouselContent,
     CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Button } from "@/components/ui/button"

export function CarouselPlugin() {
     const plugin = React.useRef(
          Autoplay({ delay: 5000, stopOnInteraction: true })
     )

     const slides = [
          {
               image: "/image1.png",
               title: "Your Trusted Medicine Store",
               description: "Get genuine medicines delivered to your doorstep quickly and safely.",
               highlight: "100% authentic products",
          },
          {
               image: "/image2.png",
               title: "Health Comes First",
               description: "We ensure quality healthcare products for you and your family.",
               highlight: "Affordable & reliable",
          },
          {
               image: "/image3.png",
               title: "Fast & Easy Ordering",
               description: "Browse, order, and receive medicines with just a few clicks.",
               highlight: "24/7 service available",
          },
     ]

     return (
          <Carousel
               plugins={[plugin.current]}
               className="w-full relative border border-gray-300 rounded md:rounded-t-2xl"
               onMouseEnter={plugin.current.stop}
               onMouseLeave={plugin.current.reset}
          >
               <CarouselContent className="h-52 sm:h-72 md:h-96 lg:h-[700px]">
                    {slides.map((slide, index) => (
                         <CarouselItem key={index} className="relative w-full">
                              {/* Image */}
                              <img
                                   src={slide.image}
                                   alt={slide.title}
                                   className="w-full h-full object-cover rounded md:rounded-t-2xl"
                              />

                              {/* Overlay */}
                              <div className="absolute inset-0 bg-black/50 flex items-center">
                                   <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-16">

                                        <div className="
               max-w-[95%] sm:max-w-xl
               text-white
               space-y-3 sm:space-y-4
               
               text-center md:text-center lg:text-left
               mx-auto lg:mx-0
          ">

                                             {/* Title */}
                                             <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-5xl font-bold leading-tight">
                                                  {slide.title}
                                             </h2>

                                             {/* Description */}
                                             <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-200">
                                                  {slide.description}
                                             </p>

                                             {/* Highlight */}
                                             <p className="text-xs sm:text-sm md:text-base text-green-400 font-semibold">
                                                  {slide.highlight}
                                             </p>

                                             {/* Button */}
                                             <div className="pt-2 flex justify-center lg:justify-start">
                                                  <Button className="bg-white text-black hover:bg-gray-200 text-xs sm:text-sm px-3 py-1.5 sm:px-4 sm:py-2">
                                                       Shop Now
                                                  </Button>
                                             </div>

                                        </div>

                                   </div>
                              </div>
                         </CarouselItem>
                    ))}
               </CarouselContent>
          </Carousel>
     )
}