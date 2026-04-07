"use client"
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
     ShieldCheck,
     Truck,
     HeartPulse,
     Users,
     Star,
     PackageCheck,
     FlaskConical,
     Clock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const stats = [
     { number: "50,000+", label: "Happy Customers" },
     { number: "10,000+", label: "Products Available" },
     { number: "500+", label: "Verified Sellers" },
     { number: "99.8%", label: "Order Accuracy" },
];

const values = [
     {
          icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
          title: "Authenticity Guaranteed",
          description:
               "Every medicine on Medi Store is sourced from licensed manufacturers and verified sellers. We maintain strict quality checks to ensure you receive only genuine products.",
     },
     {
          icon: <FlaskConical className="w-5 h-5 text-emerald-600" />,
          title: "Prescription Safety",
          description:
               "Our licensed pharmacists review every prescription before dispensing. Prescription-required medicines are never sold without proper verification.",
     },
     {
          icon: <Truck className="w-5 h-5 text-emerald-600" />,
          title: "Fast & Reliable Delivery",
          description:
               "We offer same-day delivery across Dhaka and express shipping nationwide. Your health needs can't wait — neither do we.",
     },
     {
          icon: <HeartPulse className="w-5 h-5 text-emerald-600" />,
          title: "Patient-First Approach",
          description:
               "From easy reordering to 24/7 support, every feature is designed around you — the patient. Your wellbeing is our primary goal.",
     },
     {
          icon: <PackageCheck className="w-5 h-5 text-emerald-600" />,
          title: "Batch-Level Traceability",
          description:
               "Every product is tracked by batch number and expiry date. We proactively remove near-expiry stock so you always receive fresh medicines.",
     },
     {
          icon: <Clock className="w-5 h-5 text-emerald-600" />,
          title: "Always Available",
          description:
               "Our platform is live 24 hours a day, 7 days a week — because medical needs don't follow office hours.",
     },
];

const team = [
     {
          initials: "RA",
          name: "Dr. Rafiq Ahmed",
          role: "Chief Pharmacist",
          color: "bg-emerald-100 text-emerald-700",
     },
     {
          initials: "SH",
          name: "Sumaiya Hossain",
          role: "Head of Operations",
          color: "bg-sky-100 text-sky-700",
     },
     {
          initials: "MK",
          name: "Mehedi Karim",
          role: "Technology Lead",
          color: "bg-violet-100 text-violet-700",
     },
     {
          initials: "NI",
          name: "Nadia Islam",
          role: "Customer Experience",
          color: "bg-rose-100 text-rose-700",
     },
];

export default function AboutPage() {
     const router = useRouter()
     return (
          <div className="min-h-screen pb-10">
               {/* Hero */}
               <section className=" py-20 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                         <Badge
                              variant="secondary"
                              className="mb-4 bg-emerald-100 text-emerald-700 border-0 text-xs tracking-widest uppercase"
                         >
                              About Medi Store
                         </Badge>
                         <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-5">
                              Bangladesh's Most Trusted{" "}
                              <span className="text-emerald-600">Online Pharmacy</span>
                         </h1>
                         <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                              Founded in Dhaka, Medi Store connects patients with verified
                              medicines, licensed sellers, and professional pharmacists — all in
                              one seamless platform.
                         </p>
                    </div>
               </section>

               {/* Stats */}
               <section className="border-y border-gray-100">
                    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-100">
                         {stats.map((s) => (
                              <div key={s.label} className="py-10 px-6 text-center">
                                   <p className="text-3xl font-bold text-emerald-600">{s.number}</p>
                                   <p className="text-sm text-gray-500 mt-1">{s.label}</p>
                              </div>
                         ))}
                    </div>
               </section>

               {/* Mission */}
               <section className="py-16 px-6">
                    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                         <div>
                              <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-3">
                                   Our Mission
                              </p>
                              <h2 className="text-3xl font-bold text-gray-900 mb-5 leading-snug">
                                   Making healthcare accessible to every Bangladeshi
                              </h2>
                              <p className="text-gray-500 leading-relaxed mb-4">
                                   Medi Store was built out of a simple frustration — finding
                                   authentic medicines in Bangladesh was harder than it should be.
                                   Long queues, stock-outs, counterfeit products, and no way to
                                   verify prescriptions online.
                              </p>
                              <p className="text-gray-500 leading-relaxed">
                                   We set out to change that. By building a platform that puts
                                   patients first, enforces strict seller standards, and integrates
                                   licensed pharmacist reviews, we've created the most reliable
                                   medicine marketplace in the country.
                              </p>
                         </div>
                         <div className="space-y-4">
                              <Card className="border border-emerald-100 bg-emerald-50/60 shadow-none">
                                   <CardContent className="p-5">
                                        <div className="flex items-start gap-3">
                                             <Star className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                                             <p className="text-sm text-gray-600 leading-relaxed">
                                                  <span className="font-semibold text-gray-800">
                                                       Licensed & Regulated.
                                                  </span>{" "}
                                                  Medi Store operates under DGDA compliance, ensuring every
                                                  product meets Bangladesh's pharmaceutical standards.
                                             </p>
                                        </div>
                                   </CardContent>
                              </Card>
                              <Card className="border border-sky-100 bg-sky-50/60 shadow-none">
                                   <CardContent className="p-5">
                                        <div className="flex items-start gap-3">
                                             <Users className="w-5 h-5 text-sky-600 mt-0.5 shrink-0" />
                                             <p className="text-sm text-gray-600 leading-relaxed">
                                                  <span className="font-semibold text-gray-800">
                                                       Multi-role platform.
                                                  </span>{" "}
                                                  Customers, verified sellers, and admin pharmacists all work
                                                  in one ecosystem — ensuring transparency at every step.
                                             </p>
                                        </div>
                                   </CardContent>
                              </Card>
                              <Card className="border border-violet-100 bg-violet-50/60 shadow-none">
                                   <CardContent className="p-5">
                                        <div className="flex items-start gap-3">
                                             <HeartPulse className="w-5 h-5 text-violet-600 mt-0.5 shrink-0" />
                                             <p className="text-sm text-gray-600 leading-relaxed">
                                                  <span className="font-semibold text-gray-800">
                                                       Prescription management.
                                                  </span>{" "}
                                                  Upload your prescription, get it reviewed by a pharmacist,
                                                  and receive the right medicines — safely and correctly.
                                             </p>
                                        </div>
                                   </CardContent>
                              </Card>
                         </div>
                    </div>
               </section>

               <Separator className="max-w-5xl mx-auto" />

               {/* Values */}
               <section className="py-16 px-6">
                    <div className="max-w-5xl mx-auto">
                         <div className="text-center mb-10">
                              <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-3">
                                   What We Stand For
                              </p>
                              <h2 className="text-3xl font-bold text-gray-900">Our Core Values</h2>
                         </div>
                         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                              {values.map((v) => (
                                   <Card
                                        key={v.title}
                                        className="border border-gray-100 shadow-none hover:border-emerald-200 hover:shadow-sm transition-all duration-200"
                                   >
                                        <CardContent className="p-6">
                                             <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                                                  {v.icon}
                                             </div>
                                             <h3 className="font-semibold text-gray-900 mb-2">{v.title}</h3>
                                             <p className="text-sm text-gray-500 leading-relaxed">
                                                  {v.description}
                                             </p>
                                        </CardContent>
                                   </Card>
                              ))}
                         </div>
                    </div>
               </section>

               <Separator className="max-w-5xl mx-auto" />

               {/* Team */}
               <section className="py-16 px-6 bg-gray-50/50">
                    <div className="max-w-5xl mx-auto">
                         <div className="text-center mb-10">
                              <p className="text-xs font-semibold tracking-widest text-emerald-600 uppercase mb-3">
                                   The People
                              </p>
                              <h2 className="text-3xl font-bold text-gray-900">Meet Our Team</h2>
                              <p className="text-gray-500 mt-3 max-w-md mx-auto text-sm">
                                   A dedicated group of healthcare professionals, engineers, and
                                   operators committed to your health.
                              </p>
                         </div>
                         <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
                              {team.map((member) => (
                                   <Card
                                        key={member.name}
                                        className="border border-gray-100 shadow-none text-center"
                                   >
                                        <CardContent className="p-6">
                                             <div
                                                  className={`w-14 h-14 rounded-full ${member.color} flex items-center justify-center text-lg font-bold mx-auto mb-4`}
                                             >
                                                  {member.initials}
                                             </div>
                                             <p className="font-semibold text-gray-900 text-sm">
                                                  {member.name}
                                             </p>
                                             <p className="text-xs text-gray-500 mt-1">{member.role}</p>
                                        </CardContent>
                                   </Card>
                              ))}
                         </div>
                    </div>
               </section>

               {/* CTA */}
               <section className="py-16 px-6 bg-emerald-600 text-white text-center">
                    <h2 className="text-3xl font-bold mb-3">
                         Your Health, Our Responsibility
                    </h2>
                    <p className="text-emerald-100 max-w-xl mx-auto mb-6 leading-relaxed">
                         Join over 50,000 Bangladeshis who trust Medi Store for safe, fast, and
                         reliable access to medicines every day.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                         <Link href={"/medicines"} className="bg-white text-emerald-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors text-sm">
                              Shop Now
                         </Link>
                         <Link href={"/contact"} className="border border-white/40 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-white/10 transition-colors text-sm">
                              Contact Us
                         </Link>
                    </div>
               </section>
          </div>
     );
}
