"use client";

export default function HealthTips() {
     const tips = [
          {
               title: "Stay Hydrated",
               summary: "Drink at least 8 glasses of water daily to maintain energy and overall health.",
               category: "Wellness",
               time: "2 min read",
               color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
          },
          {
               title: "Sleep Well",
               summary: "Get 7-8 hours of sleep each night to boost your immunity and mental health.",
               category: "Lifestyle",
               time: "3 min read",
               color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
          },
          {
               title: "Balanced Diet",
               summary: "Eat a diet rich in fruits, vegetables, and whole grains for optimal nutrition.",
               category: "Nutrition",
               time: "3 min read",
               color: "bg-green-50 border-green-200 hover:bg-green-100",
          },
          {
               title: "Exercise Regularly",
               summary: "Exercise at least 30 minutes a day to improve your cardiovascular and mental health.",
               category: "Fitness",
               time: "4 min read",
               color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
          },
          {
               title: "Hand Hygiene",
               summary: "Wash hands frequently to prevent the spread of germs and infections.",
               category: "Hygiene",
               time: "1 min read",
               color: "bg-pink-50 border-pink-200 hover:bg-pink-100",
          },
          {
               title: "Mental Relaxation",
               summary: "Take short breaks, meditate, or practice mindfulness to reduce stress.",
               category: "Mental Health",
               time: "3 min read",
               color: "bg-teal-50 border-teal-200 hover:bg-teal-100",
          },
          {
               title: "Limit Sugar Intake",
               summary: "Reduce sugary foods and drinks to maintain healthy weight and energy levels.",
               category: "Nutrition",
               time: "2 min read",
               color: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
          },
          {
               title: "Sun Protection",
               summary: "Use sunscreen daily and avoid direct sun exposure during peak hours to protect your skin.",
               category: "Wellness",
               time: "2 min read",
               color: "bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
          },
     ];

     return (
          <section className="py-12">
               <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">
                         Health Tips & Advice
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                         {tips.map((tip, i) => (
                              <div
                                   key={i}
                                   className={`rounded-xl border p-5 transition-all duration-300 ${tip.color} hover:shadow-lg hover:-translate-y-1`}
                              >
                                   <span className="text-xs font-semibold text-gray-600">
                                        {tip.category}
                                   </span>

                                   <h3 className="text-lg font-bold mt-2 mb-2">
                                        {tip.title}
                                   </h3>

                                   <p className="text-gray-700 text-sm mb-4">
                                        {tip.summary}
                                   </p>

                                   <span className="text-xs text-gray-500">
                                        {tip.time}
                                   </span>
                              </div>
                         ))}
                    </div>
               </div>
          </section>
     );
}