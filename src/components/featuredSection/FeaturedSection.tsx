"use client";

import { Heart, Activity, Shield, Sun } from "lucide-react";

export default function FeaturedSection() {
     const features = [
          {
               icon: <Heart className="w-8 h-8 text-white" />,
               title: "Trusted Medicines",
               description: "All products are 100% genuine and sourced from verified suppliers.",
               bg: "bg-red-500",
          },
          {
               icon: <Activity className="w-8 h-8 text-white" />,
               title: "Fast Delivery",
               description: "Get your orders delivered quickly to your doorstep safely.",
               bg: "bg-blue-500",
          },
          {
               icon: <Shield className="w-8 h-8 text-white" />,
               title: "Secure Payments",
               description: "Your transactions are fully secure with multiple payment options.",
               bg: "bg-green-500",
          },
          {
               icon: <Sun className="w-8 h-8 text-white" />,
               title: "Health Tips",
               description: "Daily tips to keep you healthy, happy, and energetic.",
               bg: "bg-yellow-500",
          },
     ];

     return (
          <section className="py-16 ">
               <div className="container mx-auto px-4 text-center mb-12">
                    <h2 className="text-4xl font-bold">Why Choose MediStore?</h2>
                    <p className="text-gray-700 mt-4 max-w-xl mx-auto">
                         We make your online medicine shopping safe, fast, and informative. Here’s why millions trust us:
                    </p>
               </div>

               <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                    {features.map((feature, i) => (
                         <div
                              key={i}
                              className="flex flex-col items-center p-6 rounded-xl shadow border hover:scale-101 transform transition duration-300"
                         >
                              <div className={`p-4 rounded-full mb-4 ${feature.bg} flex items-center justify-center`}>
                                   {feature.icon}
                              </div>
                              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                              <p className="text-gray-600">{feature.description}</p>
                         </div>
                    ))}
               </div>
          </section>
     );
}
