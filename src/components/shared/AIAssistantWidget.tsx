"use client";

import { useState } from "react";
import {
  Bot,
  Sparkles,
  X,
  Search,
  TrendingUp,
  Compass,
  ArrowRight,
  LayoutDashboard,
  ShoppingBag,
  Loader2,
  Star,
} from "lucide-react";
import { useAIFeatures } from "@/hooks/useAIFeatures";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";

type Tab = "search" | "foryou" | "trending" | "nav";

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "search", label: "Search", icon: <Search size={13} /> },
  { id: "foryou", label: "For you", icon: <Star size={13} /> },
  { id: "trending", label: "Trending", icon: <TrendingUp size={13} /> },
  { id: "nav", label: "Navigate", icon: <Compass size={13} /> },
];

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("search");

  const {
    searchQuery,
    setSearchQuery,
    searchSuggestions,
    personalizedRecommendations,
    trendingItems,
    loading,
  } = useAIFeatures();

  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();

  // ✅ Hide on dashboard routes
  const hiddenRoutes = ["/dashboard", "/seller-dashboard", "/admin-dashboard"];
  if (hiddenRoutes.some((route) => pathname.startsWith(route))) return null;

  const smartShortcuts = [
    ...(user?.id
      ? [
        { title: "My Dashboard", url: "/dashboard", icon: <LayoutDashboard size={15} /> },
        { title: "My Orders", url: "/dashboard/orders", icon: <ShoppingBag size={15} /> },
      ]
      : [{ title: "Sign in", url: "/login", icon: <ArrowRight size={15} /> }]),
    ...(!pathname.includes("/medicines")
      ? [{ title: "Browse Medicines", url: "/medicines", icon: <Search size={15} /> }]
      : []),
  ];

  const navigate = (url: string) => { setIsOpen(false); router.push(url); };

  return (
    // ✅ pointer-events-none on wrapper so it never blocks clicks behind it
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">

      {/* ── Panel ─────────────────────────────────────────────────── */}
      <div
        className={[
          "w-[360px] flex flex-col overflow-hidden",
          "bg-white dark:bg-neutral-900",
          "border border-neutral-200 dark:border-neutral-800",
          "rounded-2xl shadow-xl shadow-black/10",
          "transition-all duration-200 ease-out origin-bottom-right",
          "pointer-events-auto", // ✅ restore clicks on the panel
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-2 pointer-events-none",
        ].join(" ")}
        style={{ height: 540 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Bot size={15} className="text-neutral-700 dark:text-neutral-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                  AI Copilot
                </span>
                <span className="text-[10px] font-medium tracking-wide px-1.5 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                  BETA
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 leading-none">
                Intelligent store assistant
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 px-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11.5px] font-medium transition-colors",
                "border-b-2 -mb-px",
                activeTab === tab.id
                  ? "border-neutral-900 dark:border-white text-neutral-900 dark:text-white"
                  : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300",
              ].join(" ")}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-3 text-neutral-400">
              <Loader2 size={22} className="animate-spin" />
              <span className="text-xs">Thinking…</span>
            </div>
          ) : (
            <>
              {/* Search */}
              {activeTab === "search" && (
                <div className="p-4 flex flex-col gap-3">
                  <div className="relative">
                    <Search
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
                    />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Describe symptoms or medicine name…"
                      className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900/20 dark:focus:ring-white/20 transition"
                    />
                  </div>

                  {searchQuery.trim() ? (
                    <div className="flex flex-col gap-1">
                      <p className="text-[10.5px] font-semibold uppercase tracking-wider text-neutral-400 px-1 mb-1">
                        Results
                      </p>
                      {searchSuggestions.length > 0 ? (
                        searchSuggestions.map((med) => (
                          <button
                            key={med.id}
                            onClick={() => navigate(`/medicines/${med.id}`)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-left group border border-neutral-200 dark:border-neutral-800"
                          >
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                              {med.images?.[0] && (
                                <img
                                  src={med.images[0]}
                                  alt={med.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                                {med.name}
                              </p>
                              <p className="text-xs text-neutral-400 truncate">
                                {med.genericName ?? "Medicine"}
                              </p>
                            </div>
                            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 flex-shrink-0">
                              ৳{med.discountPrice ?? med.price}
                            </p>
                          </button>
                        ))
                      ) : (
                        <p className="text-sm text-neutral-400 text-center py-8">
                          No matches found.
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
                      <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                        <Search size={18} className="text-neutral-400" />
                      </div>
                      <p className="text-sm text-neutral-400 max-w-[200px] leading-relaxed">
                        Search by symptom, generic name, or brand.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* For You */}
              {activeTab === "foryou" && (
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-[10.5px] font-semibold uppercase tracking-wider text-neutral-400 px-1 mb-1">
                    Curated for you
                  </p>
                  {personalizedRecommendations.map((med) => (
                    <button
                      key={med.id}
                      onClick={() => navigate(`/medicines/${med.id}`)}
                      className="flex items-center gap-3 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all text-left"
                    >
                      <div className="w-11 h-11 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex-shrink-0">
                        {med.images?.[0] && (
                          <img src={med.images[0]} alt={med.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                            Recommended
                          </span>
                        </div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                          {med.name}
                        </p>
                        <p className="text-xs text-neutral-400 truncate">{med.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Trending */}
              {activeTab === "trending" && (
                <div className="p-4 flex flex-col gap-3">
                  <p className="text-[10.5px] font-semibold uppercase tracking-wider text-neutral-400 px-1">
                    Real-time demand
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {trendingItems.map((med, idx) => (
                      <button
                        key={med.id}
                        onClick={() => navigate(`/medicines/${med.id}`)}
                        className="flex flex-col p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all text-left"
                      >
                        <div className="flex items-center gap-1 mb-2">
                          <TrendingUp size={11} className="text-orange-400" />
                          <span className="text-[10px] font-semibold text-orange-500">
                            {idx === 0 ? "Hot" : `#${idx + 1}`}
                          </span>
                        </div>
                        <div className="w-full h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden flex items-center justify-center mb-2">
                          {med.images?.[0] && (
                            <img src={med.images[0]} alt={med.name} className="max-h-full max-w-full object-contain p-1" />
                          )}
                        </div>
                        <p className="text-xs font-medium text-neutral-900 dark:text-white truncate">
                          {med.name}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          ৳{med.discountPrice ?? med.price}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigate */}
              {activeTab === "nav" && (
                <div className="p-4 flex flex-col gap-2">
                  <p className="text-[10.5px] font-semibold uppercase tracking-wider text-neutral-400 px-1 mb-1">
                    Quick actions
                  </p>
                  {smartShortcuts.map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => navigate(s.url)}
                      className="flex items-center justify-between px-3 py-3 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
                          {s.icon}
                        </div>
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                          {s.title}
                        </span>
                      </div>
                      <ArrowRight
                        size={14}
                        className="text-neutral-300 group-hover:text-neutral-500 group-hover:translate-x-0.5 transition-all"
                      />
                    </button>
                  ))}

                  <div className="mt-2 px-3 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
                    <p className="text-[10.5px] font-semibold uppercase tracking-wider text-neutral-400 mb-1">
                      Current page
                    </p>
                    <p className="text-xs font-mono text-neutral-500 truncate">{pathname}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── FAB ───────────────────────────────────────────────────── */}
      <button
        onClick={() => setIsOpen((o) => !o)}
        className={[
          "w-12 h-12 rounded-2xl flex items-center justify-center",
          "pointer-events-auto", // ✅ restore clicks on the FAB
          "shadow-lg shadow-black/15 transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          isOpen
            ? "bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-200 rotate-90"
            : "bg-neutral-900 dark:bg-white hover:bg-neutral-700 dark:hover:bg-neutral-200 hover:scale-105 active:scale-95",
        ].join(" ")}
        aria-label={isOpen ? "Close AI assistant" : "Open AI assistant"}
      >
        {isOpen ? (
          <X size={20} className="text-white dark:text-neutral-900" />
        ) : (
          <Sparkles size={20} className="text-white dark:text-neutral-900" />
        )}
      </button>
    </div>
  );
}