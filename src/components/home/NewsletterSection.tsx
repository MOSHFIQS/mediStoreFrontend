"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"
import { toast } from "sonner"

export default function NewsletterSection() {
     const subscribe = (e: React.FormEvent) => {
          e.preventDefault()
          toast.success("Successfully subscribed to newsletter!")
     }

     return (
          <section className="py-20 relative bg-white overflow-hidden">
               {/* Background Decorative circles */}
               <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-primary-foreground/10 blur-3xl"></div>
               <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-primary-foreground/10 blur-3xl"></div>

               <div className="container relative mx-auto px-4 md:px-6 z-10">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                         <div className="inline-flex w-16 h-16 bg-white/20 rounded-full items-center justify-center mb-2">
                              <Mail className="w-8 h-8 " />
                         </div>
                         <h2 className="text-3xl md:text-5xl font-bold ">
                              Never Miss an Update or Discount
                         </h2>
                         <p className="text-lg /80">
                              Subscribe to our newsletter and get the latest news, updates, and exclusive offers delivered directly to your inbox.
                         </p>

                         <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 mt-8 max-w-xl mx-auto">
                              <Input
                                   type="email"
                                   placeholder="Enter your email address"
                                   required
                                   className="h-12 border-2   placeholder:text-white/60 focus-visible:ring-white focus-visible:ring-opacity-50"
                              />
                              <Button type="submit" size="lg" className="h-12">
                                   Subscribe
                              </Button>
                         </form>
                         <p className="text-xs /70 mt-4">
                              We respect your privacy. No spam, ever.
                         </p>
                    </div>
               </div>
          </section>
     )
}
