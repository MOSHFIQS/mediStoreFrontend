import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
     return (
          <footer className=" pt-12 border-t border-t-black">
               <div className="container mx-auto px-6 md:px-12 grid md:grid-cols-4 gap-8">
          

                    <div>
                         <h3 className="text-2xl font-bold mb-4 ">MediStore </h3>
                         <p>Your Trusted Online Medicine Shop.<br/> Browse medicines, get health tips, and shop safely online.</p>
                    </div>


                    <div>
                         <h4 className="text-xl font-semibold mb-4 ">Quick Links</h4>
                         <ul className="space-y-2">
                              <li><a href="/" className="hover:text-green-400 transition">Home</a></li>
                              <li><a href="/medicines" className="hover:text-green-400 transition">Shop</a></li>
                              <li><a href="/health-tips" className="hover:text-green-400 transition">Health Tips</a></li>
                         </ul>
                    </div>


                    <div>
                         <h4 className="text-xl font-semibold mb-4 ">Customer Support</h4>
                         <ul className="space-y-2">
                              <li>Email: <a href="mailto:support@medi.com" className="hover:text-green-400 transition">support@medi.com</a></li>
                              <li>Phone: <a href="tel:+880123456789" className="hover:text-green-400 transition">+880123456789</a></li>
                              <li><a href="/faq" className="hover:text-green-400 transition">FAQs</a></li>
                         </ul>
                    </div>


                    <div>
                         <h4 className="text-xl font-semibold mb-4 ">Follow Us</h4>
                         <div className="flex space-x-3">
                              <Link href="/" className="p-2 rounded-full bg-gray-800 hover:bg-green-400 transition">
                                   <Facebook className="w-5 h-5 text-white hover:text-white" />
                              </Link>
                              <Link href="/" className="p-2 rounded-full bg-gray-800 hover:bg-green-400 transition">
                                   <Twitter className="w-5 h-5 text-white hover:text-white" />
                              </Link>
                              <Link href="/" className="p-2 rounded-full bg-gray-800 hover:bg-green-400 transition">
                                   <Instagram className="w-5 h-5 text-white hover:text-white" />
                              </Link>
                              <Link href="/" className="p-2 rounded-full bg-gray-800 hover:bg-green-400 transition">
                                   <Linkedin className="w-5 h-5 text-white hover:text-white" />
                              </Link>
                         </div>
                    </div>
               </div>

               {/* Bottom Bar */}
               <div className="border-t border-gray-700 mt-12 py-4 text-center text-sm text-gray-500">
                    © 2026 MediStore. All rights reserved.
               </div>
          </footer>
     );
}
