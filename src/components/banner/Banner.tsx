"use client"

import * as React from "react"
import {
     Carousel,
     CarouselContent,
     CarouselItem,
     CarouselNext,
     CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

export function CarouselPlugin() {
     const plugin = React.useRef(
          Autoplay({ delay: 20000, stopOnInteraction: true })
     )

     const images = [
          "/image1.png",
          // "/image2.png",
     ]

     return (
          <Carousel
               // plugins={[plugin.current]}
               className="w-full relative border border-gray-300 rounded md:rounded-t-2xl"
               // onMouseEnter={plugin.current.stop}
               // onMouseLeave={plugin.current.reset}
          >
               <CarouselContent className="h-48 sm:h-72 md:h-96 lg:h-[600px] ">
                    {images.map((src, index) => (
                         <CarouselItem key={index} className="w-full flex items-center justify-center ">
                              <img
                                   src={src}
                                   alt={`Carousel Image ${index + 1}`}
                                   className="w-full h-full object-contain rounded md:rounded-t-2xl "
                              />
                         </CarouselItem>
                    ))}
               </CarouselContent>
               {/* <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10" />
               <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10" /> */}
          </Carousel>
     )
}
