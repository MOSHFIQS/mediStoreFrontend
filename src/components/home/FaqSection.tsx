"use client"

import {
     Accordion,
     AccordionContent,
     AccordionItem,
     AccordionTrigger,
} from "@/components/ui/accordion"

export default function FaqSection() {
     const faqs = [
          {
               question: "How do I order medicines online?",
               answer: "You can easily order by searching for your required medicines, adding them to your cart, and proceeding to checkout. You will need to create an account to track your orders."
          },
          {
               question: "Are the medicines completely authentic?",
               answer: "Yes, we source our inventory directly from verified manufacturers and certified distributors. Every product is 100% authentic."
          },
          {
               question: "How fast is your delivery service?",
               answer: "We offer next-day delivery for most regions, and same-day express delivery for select locations if ordered before 2 PM."
          },
          {
               question: "Can I return a medicine if I order the wrong one?",
               answer: "For safety reasons, we do not accept returns on prescription medicines once they have been dispatched. Please review your order carefully."
          },
          {
               question: "Do you offer emergency delivery?",
               answer: "Yes, our 24/7 emergency delivery system ensures you get crucial medications when you need them most."
          }
     ]

     return (
          <section className="py-16 bg-white">
               <div className="container mx-auto px-4 md:px-6">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                         <div>
                              <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Frequently Asked Questions</h2>
                              <p className="text-lg text-muted-foreground mb-6">
                                   Can't find the answer you're looking for? Reach out to our customer support team.
                              </p>
                              <div className="w-24 h-1 bg-primary rounded-full mb-8"></div>
                         </div>
                         <div>
                              <Accordion type="single" collapsible className="w-full">
                                   {faqs.map((faq, index) => (
                                        <AccordionItem key={index} value={`item-${index}`} className="border-b border-slate-100 py-2">
                                             <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary">
                                                  {faq.question}
                                             </AccordionTrigger>
                                             <AccordionContent className="text-muted-foreground leading-relaxed">
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
