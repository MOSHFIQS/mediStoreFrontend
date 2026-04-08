"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Quote, Star } from "lucide-react"

export default function TestimonialsSection() {
     const testimonials = [
          {
               name: "Sarah Johnson",
               role: "Regular Customer",
               text: "MediStore has completely changed how I buy my monthly medications. Super fast and always reliable! Highly recommended.",
               rating: 5,
          },
          {
               name: "Michael Chen",
               role: "Healthcare Professional",
               text: "I recommend this platform to all my patients. The assurance of authentic medicines is what makes it stand out from the rest.",
               rating: 5,
          },
          {
               name: "Emily Davis",
               role: "Mother of Two",
               text: "The 24/7 delivery saved us during an emergency. Great customer support and an easy-to-use interface.",
               rating: 4,
          }
     ]

     return (
          <section className="py-16 ">
               <div className="container mx-auto px-4 md:px-6">
                    <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">What Our Customers Say</h2>
                         <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                              Don't just take our word for it. Read the experiences of thousands of satisfied customers.
                         </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                         {testimonials.map((testimonial, idx) => (
                              <Card key={idx} className="bg-white border-slate-100 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                                   <div className="absolute top-4 right-4 text-primary/10">
                                        <Quote size={40} />
                                   </div>
                                   <CardContent className="p-6">
                                        <div className="flex mb-4">
                                             {[...Array(5)].map((_, i) => (
                                                  <Star key={i} className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-300"}`} />
                                             ))}
                                        </div>
                                        <p className="text-slate-600 mb-6 italic">"{testimonial.text}"</p>
                                        <div className="flex items-center gap-3">
                                             <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                  {testimonial.name.charAt(0)}
                                             </div>
                                             <div>
                                                  <div className="font-bold text-foreground">{testimonial.name}</div>
                                                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                                             </div>
                                        </div>
                                   </CardContent>
                              </Card>
                         ))}
                    </div>
               </div>
          </section>
     )
}
