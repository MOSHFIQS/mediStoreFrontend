"use client"

import { ShieldCheck, Truck, Clock, HeadphonesIcon } from "lucide-react"

export default function FeaturesSection() {
     const features = [
          {
               icon: <Truck className="w-8 h-8 text-primary" />,
               title: "Free Delivery",
               description: "On all orders above $50. Get your medicines delivered quickly."
          },
          {
               icon: <ShieldCheck className="w-8 h-8 text-primary" />,
               title: "100% Authentic",
               description: "We strictly ensure all medicines are from verified brands."
          },
          {
               icon: <Clock className="w-8 h-8 text-primary" />,
               title: "24/7 Service",
               description: "Order anytime, anywhere. Our service never sleeps."
          },
          {
               icon: <HeadphonesIcon className="w-8 h-8 text-primary" />,
               title: "Expert Support",
               description: "Consult with our expert pharmacists completely free."
          }
     ]

     return (
          <section className="py-16 overflow-hidden">
               <div className="container mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                         {features.map((feature, index) => (
                              <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                   <div className="p-4 bg-primary/10 rounded-full mb-4">
                                        {feature.icon}
                                   </div>
                                   <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                                   <p className="text-muted-foreground">{feature.description}</p>
                              </div>
                         ))}
                    </div>
               </div>
          </section>
     )
}
