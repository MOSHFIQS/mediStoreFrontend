"use client"

import {
     Accordion,
     AccordionContent,
     AccordionItem,
     AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpCircle, PhoneCall, MessageSquare, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function FaqSection() {
     const faqs = [
          {
               question: "How do I order prescription medicines on MediStore?",
               answer: "Browse or search for your required medication, add it to your cart, and proceed to checkout. During checkout, you can upload a photo of your doctor's prescription. Our registered pharmacist reviews and approves it before fulfillment."
          },
          {
               question: "Are all medicines guaranteed authentic and regulated?",
               answer: "Absolutely. We procure directly from DGDA-licensed pharmaceutical manufacturers (Square, Beximco, Incepta, Novartis, etc.) and maintain cold-chain handling for sensitive drugs. Every blister pack comes sealed with tamper-evident packaging."
          },
          {
               question: "How fast is delivery, and do you have emergency service?",
               answer: "We offer 2-hour express emergency delivery in major metropolitan zones for urgent prescriptions, and same-day or next-day scheduled delivery nationwide."
          },
          {
               question: "Can I consult with a pharmacist before purchasing?",
               answer: "Yes, our certified pharmacists are available 24/7 via phone or chat to answer questions regarding dosage, medication interactions, or pediatric guidelines completely free of charge."
          },
          {
               question: "What payment methods are supported?",
               answer: "We accept all major debit/credit cards (Visa, MasterCard), Mobile Financial Services (bKash, Nagad, Rocket) via SSLCommerz, and Cash on Delivery (COD) for eligible items."
          }
     ]

     return (
          <section className="py-16">
               <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-12 gap-12 items-start">
                         {/* Left Promo & Support Column */}
                         <div className="lg:col-span-5 space-y-6">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                                   <HelpCircle className="w-3.5 h-3.5" />
                                   <span>Common Inquiries</span>
                              </div>

                              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                                   Frequently Asked Questions
                              </h2>

                              <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                                   Everything you need to know about our pharmacy verification, shipping, prescription handling, and customer care.
                              </p>

                              {/* Support Box */}
                              <div className="p-6 rounded-3xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/50 space-y-4">
                                   <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
                                             <PhoneCall className="w-5 h-5" />
                                        </div>
                                        <div>
                                             <h4 className="font-bold text-sm text-slate-900 dark:text-white">Need Immediate Help?</h4>
                                             <p className="text-xs text-slate-500">Pharmacists available 24/7</p>
                                        </div>
                                   </div>

                                   <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                                        <Link
                                             href="tel:+880123456789"
                                             className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white transition-colors"
                                        >
                                             <PhoneCall className="w-3.5 h-3.5" />
                                             <span>Call Helpline</span>
                                        </Link>
                                        <Link
                                             href="/contact"
                                             className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-teal-400 transition-colors"
                                        >
                                             <MessageSquare className="w-3.5 h-3.5" />
                                             <span>Contact Support</span>
                                        </Link>
                                   </div>
                              </div>
                         </div>

                         {/* Right FAQ Accordion Column */}
                         <div className="lg:col-span-7">
                              <Accordion type="single" collapsible className="w-full space-y-3.5">
                                   {faqs.map((faq, index) => (
                                        <AccordionItem
                                             key={index}
                                             value={`item-${index}`}
                                             className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-2xl px-6 py-1 shadow-sm transition-all duration-200 hover:border-teal-300 dark:hover:border-teal-700"
                                        >
                                             <AccordionTrigger className="text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 py-4 hover:no-underline">
                                                  {faq.question}
                                             </AccordionTrigger>
                                             <AccordionContent className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed pb-4">
                                                  {faq.answer}
                                             </AccordionContent>
                                        </AccordionItem>
                                   ))}
                              </Accordion>
                         </div>
                    </div>
               </div>
          </section>
     )
}
