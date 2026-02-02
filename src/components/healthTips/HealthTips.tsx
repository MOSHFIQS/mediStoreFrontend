"use client";

export default function HealthTips() {
     const tips = [
          {
               title: "Stay Hydrated",
               summary: "Drink at least 8 glasses of water daily to maintain energy and overall health.",
              
               category: "Wellness",
               time: "2 min read",
          },
          {
               title: "Sleep Well",
               summary: "Get 7-8 hours of sleep each night to boost your immunity and mental health.",
               
               category: "Lifestyle",
               time: "3 min read",
          },
          {
               title: "Balanced Diet",
               summary: "Eat a diet rich in fruits, vegetables, and whole grains for optimal nutrition.",
             
               category: "Nutrition",
               time: "3 min read",
          },
          {
               title: "Exercise Regularly",
               summary: "Exercise at least 30 minutes a day to improve your cardiovascular and mental health.",
            
               category: "Fitness",
               time: "4 min read",
          },
          {
               title: "Hand Hygiene",
               summary: "Wash hands frequently to prevent the spread of germs and infections.",
          
               category: "Hygiene",
               time: "1 min read",
          },
          {
               title: "Mental Relaxation",
               summary: "Take short breaks, meditate, or practice mindfulness to reduce stress.",
           
               category: "Mental Health",
               time: "3 min read",
          },
          {
               title: "Limit Sugar Intake",
               summary: "Reduce sugary foods and drinks to maintain healthy weight and energy levels.",
               category: "Nutrition",
               time: "2 min read",
          },
          {
               title: "Sun Protection",
               summary: "Use sunscreen daily and avoid direct sun exposure during peak hours to protect your skin.",
       
               category: "Wellness",
               time: "2 min read",
          },
     ];

     return (
          <section className="py-12 ">
               <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8 text-center">Health Tips & Advice</h2>

                    <div className="grid  md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                         {tips.map((tip, i) => (
                              <div key={i} className="rounded border hover:scale-101 duration-300">
          
                                   <div className="p-4">
                                        <span className="text-sm text-green-600 font-semibold">{tip.category}</span>
                                        <h3 className="text-xl font-bold my-2">{tip.title}</h3>
                                        <p className="text-gray-700 mb-4">{tip.summary}</p>
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>
          </section>
     );
}
