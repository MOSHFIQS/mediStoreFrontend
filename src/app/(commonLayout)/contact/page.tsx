"use client";

import React from "react";
import emailjs from "emailjs-com";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactInfo = [
     {
          icon: <Mail className="w-5 h-5 text-emerald-600" />,
          title: "Email Us",
          detail: "support@medistore.com.bd",
          sub: "We reply within 24 hours",
     },
     {
          icon: <Phone className="w-5 h-5 text-emerald-600" />,
          title: "Call Us",
          detail: "+880 1800-MEDISTORE",
          sub: "Sat – Thu, 9am – 9pm",
     },
     {
          icon: <MapPin className="w-5 h-5 text-emerald-600" />,
          title: "Visit Us",
          detail: "Gulshan-1, Dhaka 1212",
          sub: "Bangladesh",
     },
     {
          icon: <Clock className="w-5 h-5 text-emerald-600" />,
          title: "Working Hours",
          detail: "24 / 7 Online Support",
          sub: "Always here for you",
     },
];

const ContactFormPage = () => {
     const router = useRouter();

     const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();

          emailjs
               .sendForm(
                    process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                    process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                    e.currentTarget,
                    process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
               )
               .then(
                    () => {
                         toast.success(
                              "Message sent successfully! We will get back to you soon."
                         );
                         router.push("/");
                    },
                    () => {
                         toast.error("Failed to send message. Please try again.");
                    }
               );

          e.currentTarget.reset();
     };

     return (
          <div className="min-h-screen bg-white">
               {/* Hero */}
               <section className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                         <Badge
                              variant="secondary"
                              className="mb-4 bg-emerald-100 text-emerald-700 border-0 text-xs tracking-widest uppercase"
                         >
                              Contact Us
                         </Badge>
                         <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
                              Get In Touch{" "}
                              <span className="text-emerald-600">With Us</span>
                         </h1>
                         <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                              Have questions, feedback, or need help with your order? Our team is
                              always ready to assist you — reach out and we'll respond promptly.
                         </p>
                    </div>
               </section>

               {/* Contact Info Cards */}
               <section className="border-y border-gray-100">
                    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
                         {contactInfo.map((item) => (
                              <div key={item.title} className="py-10 px-6 text-center">
                                   <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                                        {item.icon}
                                   </div>
                                   <p className="text-sm font-semibold text-gray-900">{item.title}</p>
                                   <p className="text-sm text-emerald-600 font-medium mt-1">{item.detail}</p>
                                   <p className="text-xs text-gray-400 mt-0.5">{item.sub}</p>
                              </div>
                         ))}
                    </div>
               </section>

               {/* Form Section */}
               <section className="py-16 px-6">
                    <div className="max-w-5xl mx-auto">
                         <div className="text-center mb-10">
                              <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-3">
                                   Send A Message
                              </p>
                              <h2 className="text-3xl font-bold text-gray-900">
                                   We'd Love to Hear From You
                              </h2>
                              <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
                                   Fill in the form below and one of our team members will get back
                                   to you as soon as possible.
                              </p>
                         </div>

                         <Card className="border border-gray-100 shadow-none max-w-3xl mx-auto">
                              <CardContent className="p-8">
                                   <form
                                        className="grid grid-cols-1 md:grid-cols-2 gap-5"
                                        onSubmit={sendEmail}
                                   >
                                        {/* Name */}
                                        <div className="flex flex-col gap-1.5">
                                             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                                  Full Name
                                             </label>
                                             <input
                                                  type="text"
                                                  name="name"
                                                  placeholder="e.g. Rahim Hossain"
                                                  required
                                                  className="p-3 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                                             />
                                        </div>

                                        {/* Email */}
                                        <div className="flex flex-col gap-1.5">
                                             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                                  Email Address
                                             </label>
                                             <input
                                                  type="email"
                                                  name="email"
                                                  placeholder="e.g. rahim@email.com"
                                                  required
                                                  className="p-3 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                                             />
                                        </div>

                                        {/* Phone */}
                                        <div className="flex flex-col gap-1.5">
                                             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                                  Phone Number
                                             </label>
                                             <input
                                                  type="text"
                                                  name="phone"
                                                  placeholder="e.g. +880 17XXXXXXXX"
                                                  className="p-3 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                                             />
                                        </div>

                                        {/* Subject */}
                                        <div className="flex flex-col gap-1.5">
                                             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                                  Subject
                                             </label>
                                             <input
                                                  type="text"
                                                  name="subject"
                                                  placeholder="e.g. Order issue, Prescription query"
                                                  className="p-3 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all"
                                             />
                                        </div>

                                        {/* Message */}
                                        <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                                             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                                  Message
                                             </label>
                                             <textarea
                                                  name="message"
                                                  placeholder="Tell us how we can help you..."
                                                  rows={5}
                                                  required
                                                  className="p-3 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 transition-all resize-none"
                                             />
                                        </div>

                                        {/* Submit */}
                                        <div className="col-span-1 md:col-span-2">
                                             <button
                                                  type="submit"
                                                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 text-sm uppercase tracking-wide"
                                             >
                                                  Send Message
                                             </button>
                                        </div>
                                   </form>
                              </CardContent>
                         </Card>
                    </div>
               </section>

               {/* CTA */}
               <section className="py-16 px-6 bg-emerald-600 text-white text-center">
                    <h2 className="text-3xl font-bold mb-3">We're Always Here for You</h2>
                    <p className="text-emerald-100 max-w-xl mx-auto mb-6 leading-relaxed">
                         Whether it's a prescription query or a delivery concern, our support
                         team is available 24/7 to make sure you get the help you need.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                         <a
                              href="/medicines"
                              className="bg-white text-emerald-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors text-sm"
                         >
                              Shop Now
                         </a>
                         <a
                              href="/about"
                              className="border border-white/40 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm"
                         >
                              About Us
                         </a>
                    </div>
               </section>
          </div>
     );
};

export default ContactFormPage;