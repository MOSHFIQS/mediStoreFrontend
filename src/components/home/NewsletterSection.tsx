"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Sparkles, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"

export default function NewsletterSection() {
     const [email, setEmail] = useState("")

     const subscribe = (e: React.FormEvent) => {
          e.preventDefault()
          if (!email) return
          toast.success("Successfully subscribed to MediStore Health Club!")
          setEmail("")
     }

     return (
          <section className="py-16 my-8">
               <div className="container mx-auto px-4">
                    <div className="relative rounded-3xl bg-gradient-to-br from-teal-800 via-teal-900 to-slate-950 text-white p-8 md:p-14 overflow-hidden shadow-xl shadow-teal-950/20">
                         {/* Ambient Background Glows */}
                         <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
                         <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

                         <div className="relative z-10 max-w-2xl mx-auto text-center space-y-6">
                              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-teal-200 border border-white/15">
                                   <Sparkles className="w-3.5 h-3.5" />
                                   <span>Exclusive MediStore Health Club</span>
                              </div>

                              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                                   Get 10% Off Your First Order + Health Updates
                              </h2>

                              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                                   Join over 50,000 members receiving monthly wellness digests, prescription refill reminders, and members-only pharmacy discounts.
                              </p>

                              <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 pt-2 max-w-lg mx-auto">
                                   <div className="relative flex-1">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                             type="email"
                                             value={email}
                                             onChange={(e) => setEmail(e.target.value)}
                                             placeholder="Enter your email address"
                                             required
                                             className="h-12 pl-11 pr-4 rounded-full bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:border-teal-400 backdrop-blur-md text-sm"
                                        />
                                   </div>
                                   <Button
                                        type="submit"
                                        size="lg"
                                        className="h-12 px-8 rounded-full bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-105"
                                   >
                                        Subscribe Now
                                   </Button>
                              </form>

                              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-2">
                                   <ShieldCheck className="w-4 h-4 text-teal-400" />
                                   <span>Zero spam guarantee. Unsubscribe with one click at any time.</span>
                              </div>
                         </div>
                    </div>
               </div>
          </section>
     )
}
