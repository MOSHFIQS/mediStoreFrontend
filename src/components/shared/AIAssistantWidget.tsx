"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Sparkles, X, Search, TrendingUp, Compass, ArrowRight, LayoutDashboard, ShoppingBag, Loader2 } from "lucide-react";
import { useAIFeatures } from "@/hooks/useAIFeatures";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"search" | "foryou" | "trending" | "nav">("search");
  
  const { 
    searchQuery, 
    setSearchQuery, 
    searchSuggestions, 
    personalizedRecommendations, 
    trendingItems,
    loading 
  } = useAIFeatures();

  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  // Smart Navigation logic
  const smartShortcuts = [];
  if (user?.id) {
    smartShortcuts.push({ title: "My Dashboard", url: "/dashboard", icon: <LayoutDashboard size={18} /> });
    smartShortcuts.push({ title: "My Orders", url: "/dashboard/orders", icon: <ShoppingBag size={18} /> });
  } else {
    smartShortcuts.push({ title: "Login to Account", url: "/login", icon: <ArrowRight size={18} /> });
  }
  if (!pathname.includes("/medicines")) {
    smartShortcuts.push({ title: "Browse Medicines", url: "/medicines", icon: <Search size={18} /> });
  }

  const navigateTo = (url: string) => {
    setIsOpen(false);
    router.push(url);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
        {/* Widget Panel */}
        <div 
          className={`mb-4 transition-all duration-300 transform origin-bottom-right ${
            isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-50 opacity-0 pointer-events-none translate-y-10"
          } w-[360px] sm:w-[400px] h-[550px] bg-white/60 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden flex flex-col`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-5 text-white flex justify-between items-center rounded-t-3xl shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
            <div className="relative z-10 flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-full backdrop-blur-md">
                <Sparkles className="w-5 h-5 text-purple-100" />
              </div>
              <div>
                <h3 className="font-semibold text-lg flex items-center gap-2">AI Copilot <span className="text-[10px] bg-purple-900/40 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Beta</span></h3>
                <p className="text-xs text-purple-100 opacity-90">Intelligent store assistant</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="relative z-10 p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200/50 bg-white/50 px-2 pt-2">
            {[
              { id: "search", label: "Search", icon: <Search size={14} /> },
              { id: "foryou", label: "For You", icon: <Sparkles size={14} /> },
              { id: "trending", label: "Trending", icon: <TrendingUp size={14} /> },
              { id: "nav", label: "Smart Nav", icon: <Compass size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-3 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all
                  ${activeTab === tab.id 
                    ? "text-purple-700 border-b-2 border-purple-600 bg-purple-50/50 rounded-t-xl" 
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-50/50 rounded-t-xl"
                  }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-white/40 to-transparent">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                <p className="text-sm font-medium">AI Engine thinking...</p>
              </div>
            ) : (
              <>
                {/* Search Tab */}
                {activeTab === "search" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Describe what you need..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/70 border border-purple-100 rounded-2xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400/50 shadow-sm transition-all"
                      />
                    </div>
                    
                    {searchQuery.trim() !== "" ? (
                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">AI Suggestions</p>
                        {searchSuggestions.length > 0 ? (
                          searchSuggestions.map((med) => (
                            <button
                              key={med.id}
                              onClick={() => navigateTo(`/medicines/${med.id}`)}
                              className="w-full text-left p-3 rounded-2xl hover:bg-white/80 bg-white/40 border border-white transition-all flex items-center gap-3 group"
                            >
                              <div className="w-10 h-10 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden">
                                <img src={med.images?.[0] || undefined} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform"/>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{med.name}</p>
                                <p className="text-xs text-gray-500 truncate">{med.genericName || "Medicine"}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-purple-600">৳{med.discountPrice || med.price}</p>
                              </div>
                            </button>
                          ))
                        ) : (
                          <p className="text-sm text-center text-gray-400 mt-6">No intelligent matches found.</p>
                        )}
                      </div>
                    ) : (
                      <div className="text-center mt-10">
                        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Bot className="w-8 h-8 text-purple-300" />
                        </div>
                        <p className="text-gray-500 text-sm">Type symptoms, generic names, or brands and I'll find it instantly.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* For You Tab */}
                {activeTab === "foryou" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p className="text-xs text-center text-gray-500 mb-4 bg-purple-50/80 rounded-full py-1.5 px-3 border border-purple-100/50 inline-block mx-auto">
                      Curated based on your wellness profile
                    </p>
                    <div className="space-y-3 mt-1">
                      {personalizedRecommendations.map((med) => (
                        <div key={med.id} onClick={() => navigateTo(`/medicines/${med.id}`)} className="bg-white/60 p-3 rounded-2xl flex gap-3 hover:bg-white cursor-pointer shadow-sm border border-transparent hover:border-purple-100 transition-all group">
                          <img src={med.images?.[0] || undefined} className="w-16 h-16 rounded-xl object-cover bg-white p-1 border border-gray-100" />
                          <div className="flex-1">
                            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider mb-1 inline-block">Recommended</span>
                            <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{med.name}</h4>
                            <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{med.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Tab */}
                {activeTab === "trending" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <p className="text-xs text-center text-gray-500 mb-4">
                      Real-time analysis of market demand
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {trendingItems.map((med, idx) => (
                         <div key={med.id} onClick={() => navigateTo(`/medicines/${med.id}`)} className="bg-gradient-to-br from-white/70 to-white/30 p-3 rounded-2xl shadow-sm border border-orange-100/50 hover:shadow-md cursor-pointer transition-all relative overflow-hidden group">
                           {idx === 0 && <div className="absolute -right-6 -top-6 w-16 h-16 bg-orange-500/10 rounded-full animate-pulse"></div>}
                           <div className="flex items-center gap-1.5 mb-2">
                             <TrendingUp className="text-orange-500 w-4 h-4" />
                             <span className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">{idx === 0 ? 'Hot' : 'Trending'}</span>
                           </div>
                           <div className="w-full h-20 rounded-xl bg-white mb-2 overflow-hidden flex items-center justify-center p-2">
                             <img src={med.images?.[0] || undefined} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform" />
                           </div>
                           <h4 className="text-xs font-bold text-gray-800 truncate">{med.name}</h4>
                           <p className="text-xs font-bold text-purple-600 mt-1">৳{med.discountPrice || med.price}</p>
                         </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Smart Nav Tab */}
                {activeTab === "nav" && (
                  <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <h4 className="text-sm font-bold text-gray-800 mb-3 px-1">Intelligent Shortcuts</h4>
                    <div className="space-y-2">
                      {smartShortcuts.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => navigateTo(s.url)}
                          className="w-full bg-white/50 hover:bg-white border border-gray-100 p-3.5 rounded-2xl flex items-center justify-between group transition-all"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-purple-100 text-purple-600 p-2 rounded-xl group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                              {s.icon}
                            </div>
                            <span className="font-semibold text-sm text-gray-700">{s.title}</span>
                          </div>
                          <ArrowRight size={16} className="text-gray-300 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-6 p-4 rounded-2xl bg-indigo-50 border border-indigo-100 relative overflow-hidden">
                      <div className="absolute -right-2 -bottom-2 opacity-10">
                        <Bot size={80} />
                      </div>
                      <h4 className="text-xs font-bold text-indigo-800 mb-1">Contextual Navigation</h4>
                      <p className="text-[11px] text-indigo-600/80 pr-6">I am analyzing your current page ({pathname}) to provide you with the most relevant next steps.</p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Floating Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center justify-center p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group relative
            ${isOpen ? "bg-gray-800 text-white rotate-90" : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"}`}
        >
          {isOpen ? (
            <X size={28} />
          ) : (
            <>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-full transition-opacity"></div>
              <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
              <Bot size={28} className="relative z-10" />
            </>
          )}
        </button>
      </div>
    </>
  );
}
