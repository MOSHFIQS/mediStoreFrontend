import { Facebook, Twitter, Instagram, Linkedin, Cross, ShieldCheck, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
     return (
          <footer className="mt-16 border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400">
               {/* Main Footer Content */}
               <div className="container mx-auto px-6 md:px-12 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
                         {/* Brand Column */}
                         <div className="lg:col-span-2 space-y-4">
                              <Link href="/" className="inline-flex items-center gap-2.5 group">
                                   <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/25">
                                        <Cross className="w-4 h-4 fill-white" />
                                   </div>
                                   <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                        Medi<span className="text-teal-600 dark:text-teal-400">Store</span>
                                   </span>
                              </Link>

                              <p className="text-sm leading-relaxed max-w-sm text-slate-500 dark:text-slate-400">
                                   Your trusted, government-compliant digital pharmacy. Delivering authentic, temperature-controlled medications, wellness supplements, and 24/7 pharmacist support straight to your home.
                              </p>

                              <div className="pt-2 flex items-center gap-3">
                                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                                        <ShieldCheck className="w-3.5 h-3.5" />
                                        DGDA Licensed & Verified
                                   </span>
                              </div>
                         </div>

                         {/* Quick Links */}
                         <div className="space-y-4">
                              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                   Quick Links
                              </h4>
                              <ul className="space-y-2.5 text-sm">
                                   <li>
                                        <Link href="/" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                             Home
                                        </Link>
                                   </li>
                                   <li>
                                        <Link href="/medicines" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                             Browse Medicines
                                        </Link>
                                   </li>
                                   <li>
                                        <Link href="/about" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                             About Our Pharmacy
                                        </Link>
                                   </li>
                                   <li>
                                        <Link href="/cart" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                             Shopping Cart
                                        </Link>
                                   </li>
                              </ul>
                         </div>

                         {/* Customer Care */}
                         <div className="space-y-4">
                              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                   Customer Care
                              </h4>
                              <ul className="space-y-2.5 text-sm">
                                   <li>
                                        <Link href="/contact" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                             Help & Support Center
                                        </Link>
                                   </li>
                                   <li>
                                        <Link href="/medicines" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                             Upload Prescription
                                        </Link>
                                   </li>
                                   <li>
                                        <Link href="/dashboard/orders" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                             Track My Shipment
                                        </Link>
                                   </li>
                                   <li>
                                        <Link href="/contact" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                                             Pharmacist Consultation
                                        </Link>
                                   </li>
                              </ul>
                         </div>

                         {/* Contact & Support */}
                         <div className="space-y-4">
                              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                                   24/7 Helpline
                              </h4>
                              <ul className="space-y-3 text-sm">
                                   <li className="flex items-center gap-2.5">
                                        <Phone className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                                        <a href="tel:+880123456789" className="hover:text-teal-600 font-semibold">
                                             +880 1234 567 89
                                        </a>
                                   </li>
                                   <li className="flex items-center gap-2.5">
                                        <Mail className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
                                        <a href="mailto:support@medistore.com" className="hover:text-teal-600">
                                             support@medistore.com
                                        </a>
                                   </li>
                                   <li className="flex items-start gap-2.5 text-xs leading-relaxed">
                                        <MapPin className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
                                        <span>Dhaka, Bangladesh</span>
                                   </li>
                              </ul>

                              {/* Social Links */}
                              <div className="pt-2 flex items-center gap-2">
                                   <Link href="/" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white flex items-center justify-center transition-colors">
                                        <Facebook className="w-4 h-4" />
                                   </Link>
                                   <Link href="/" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white flex items-center justify-center transition-colors">
                                        <Twitter className="w-4 h-4" />
                                   </Link>
                                   <Link href="/" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white flex items-center justify-center transition-colors">
                                        <Instagram className="w-4 h-4" />
                                   </Link>
                                   <Link href="/" className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-teal-600 hover:text-white flex items-center justify-center transition-colors">
                                        <Linkedin className="w-4 h-4" />
                                   </Link>
                              </div>
                         </div>
                    </div>
               </div>

               {/* Bottom Bar */}
               <div className="border-t border-slate-100 dark:border-slate-800/80 py-6">
                    <div className="container mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
                         <p>© {new Date().getFullYear()} MediStore Online Pharmacy. All rights reserved.</p>
                         <p className="text-[11px] text-slate-400 text-center sm:text-right">
                              Prescription medications dispensed strictly against valid medical prescriptions.
                         </p>
                    </div>
               </div>
          </footer>
     );
}
