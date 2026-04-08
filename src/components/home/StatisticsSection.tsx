"use client"

export default function StatisticsSection() {
     const stats = [
          { value: "50K+", label: "Happy Customers" },
          { value: "100+", label: "Expert Doctors" },
          { value: "10K+", label: "Products Available" },
          { value: "24/7", label: "Customer Support" },
     ]

     return (
          <section className="py-16 border bg-white relative overflow-hidden">
               <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
               <div className="container relative mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                         {stats.map((stat, index) => (
                              <div key={index} className="flex flex-col items-center text-center space-y-2">
                                   <span className="text-4xl md:text-5xl font-extrabold tracking-tight">{stat.value}</span>
                                   <span className="text-lg  font-medium uppercase tracking-wide">{stat.label}</span>
                              </div>
                         ))}
                    </div>
               </div>
          </section>
     )
}
