import {
     Package, DollarSign, ShoppingBag, TrendingUp, TrendingDown,
     Star, AlertTriangle, CheckCircle2, XCircle, BarChart3,
     Layers, Clock, Truck, RefreshCw, Activity, Archive
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────
type SellerStats = {
     medicines: {
          total: number; active: number; inactive: number;
          outOfStock: number; lowStock: number;  addedThisMonth: number;
          byCategory: { categoryId: string; categoryName: string; count: number }[];
     };
     orders: {
          total: number; delivered: number; processing: number; cancelled: number;
          today: number; thisMonth: number; lastMonth: number; growth: number;
     };
     revenue: {
          total: number; today: number; thisMonth: number; lastMonth: number; growth: number;
          daily: { date: string; amount: number }[];
     };
     reviews: { total: number; avgRating: number };
     batches: { total: number; active: number; expired: number };
     topSellingMedicines: { medicineId: string; medicineName: string; totalQuantity: number; totalRevenue: number }[];
     recentOrders: any[];
};

interface Props { stats?: SellerStats }

// ── Helpers ────────────────────────────────────────────────────
const fmt = (n: number) => new Intl.NumberFormat("en-US").format(n);
const fmtMoney = (n: number) => `৳${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;

function GrowthBadge({ value }: { value: number }) {
     const up = value >= 0;
     return (
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full
      ${up ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
               {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
               {Math.abs(value)}%
          </span>
     );
}

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
     return (
          <div className="flex items-center gap-2 mb-4">
               <span className="text-emerald-500">{icon}</span>
               <h2 className="text-base font-bold text-gray-800">{title}</h2>
          </div>
     );
}

const CATEGORY_COLORS = [
     "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700",
     "bg-emerald-100 text-emerald-700", "bg-amber-100 text-amber-700",
     "bg-pink-100 text-pink-700", "bg-cyan-100 text-cyan-700",
];

// ── Main ───────────────────────────────────────────────────────
export default function SellerStats({ stats }: Props) {
     if (!stats) return <p className="p-6 text-red-500">No statistics available.</p>;

     const { medicines, orders, revenue, reviews, batches, topSellingMedicines, recentOrders } = stats;

     return (
          <div className="p-6 space-y-8 bg-gray-50 min-h-screen">

               {/* Header */}
               <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                         <BarChart3 className="w-6 h-6 text-emerald-500" /> Seller Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Your store performance and revenue overview</p>
               </div>

               {/* ── Hero KPIs ── */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Revenue</span>
                              <DollarSign className="w-4 h-4 text-emerald-400" />
                         </div>
                         <p className="text-3xl font-bold text-gray-900">{fmtMoney(revenue.total)}</p>
                         <div className="flex items-center gap-2 mt-2">
                              <GrowthBadge value={revenue.growth} />
                              <span className="text-xs text-gray-400">vs last month</span>
                         </div>
                         <p className="text-xs text-gray-400 mt-1">Today: {fmtMoney(revenue.today)}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Orders</span>
                              <ShoppingBag className="w-4 h-4 text-blue-400" />
                         </div>
                         <p className="text-3xl font-bold text-gray-900">{orders.total}</p>
                         <div className="flex items-center gap-2 mt-2">
                              <GrowthBadge value={orders.growth} />
                              <span className="text-xs text-gray-400">vs last month</span>
                         </div>
                         <p className="text-xs text-gray-400 mt-1">Today: {orders.today} · This month: {orders.thisMonth}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Medicines</span>
                              <Package className="w-4 h-4 text-purple-400" />
                         </div>
                         <p className="text-3xl font-bold text-gray-900">{medicines.total}</p>
                         <p className="text-xs text-gray-400 mt-2">Active: {medicines.active}</p>
                         {medicines.outOfStock > 0 && (
                              <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                                   <AlertTriangle className="w-3 h-3" /> {medicines.outOfStock} out of stock
                              </p>
                         )}
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg Rating</span>
                              <Star className="w-4 h-4 text-amber-400" />
                         </div>
                         <p className="text-3xl font-bold text-gray-900">{reviews.avgRating}<span className="text-base font-normal text-gray-400">/5</span></p>
                         <p className="text-xs text-gray-400 mt-2">{reviews.total} total reviews</p>
                    </div>
               </div>

               {/* ── Revenue breakdown + Medicines health ── */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Revenue breakdown */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<DollarSign className="w-4 h-4" />} title="Revenue Breakdown" />
                         <div className="space-y-3">
                              {[
                                   { label: "This Month", value: revenue.thisMonth },
                                   { label: "Last Month", value: revenue.lastMonth },
                                   { label: "Today", value: revenue.today },
                              ].map((r) => (
                                   <div key={r.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-sm text-gray-500">{r.label}</span>
                                        <span className="text-sm font-bold text-gray-800">{fmtMoney(r.value)}</span>
                                   </div>
                              ))}
                         </div>

                         {/* Daily mini chart (text-based bars) */}
                         <div className="mt-4">
                              <p className="text-xs text-gray-400 mb-2">Last 7 days</p>
                              <div className="flex items-end gap-1 h-14">
                                   {revenue.daily.map((d) => {
                                        const max = Math.max(...revenue.daily.map((x) => x.amount), 1);
                                        const pct = Math.max((d.amount / max) * 100, 4);
                                        return (
                                             <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                                                  <div
                                                       className="w-full bg-emerald-200 rounded-t-sm transition-all"
                                                       style={{ height: `${pct}%` }}
                                                       title={`${d.date}: ${fmtMoney(d.amount)}`}
                                                  />
                                                  <span className="text-[9px] text-gray-300 rotate-45 origin-top-left translate-x-1">
                                                       {d.date.slice(5)}
                                                  </span>
                                             </div>
                                        );
                                   })}
                              </div>
                         </div>
                    </div>

                    {/* Medicine health */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<Package className="w-4 h-4" />} title="Inventory Health" />
                         <div className="space-y-3">
                              {[
                                   { label: "Active", value: medicines.active, dot: "bg-emerald-400" },
                                   { label: "Inactive", value: medicines.inactive, dot: "bg-gray-300" },
                                   { label: "Out of Stock", value: medicines.outOfStock, dot: "bg-red-400" },
                                   { label: "Low Stock (≤10)", value: medicines.lowStock, dot: "bg-amber-400" },
                                   { label: "Added This Month", value: medicines.addedThisMonth, dot: "bg-blue-400" },
                              ].map((m) => (
                                   <div key={m.label} className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-sm text-gray-500">
                                             <span className={`w-2 h-2 rounded-full ${m.dot}`} /> {m.label}
                                        </span>
                                        <span className="text-sm font-bold text-gray-800">{m.value}</span>
                                   </div>
                              ))}
                         </div>
                    </div>

                    {/* Orders + Batches */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">
                         <div>
                              <SectionTitle icon={<ShoppingBag className="w-4 h-4" />} title="Order Breakdown" />
                              <div className="grid grid-cols-2 gap-2">
                                   {[
                                        { label: "Delivered", value: orders.delivered, color: "bg-emerald-50 text-emerald-700" },
                                        { label: "Processing", value: orders.processing, color: "bg-amber-50 text-amber-700" },
                                        { label: "Cancelled", value: orders.cancelled, color: "bg-red-50 text-red-600" },
                                        { label: "This Month", value: orders.thisMonth, color: "bg-blue-50 text-blue-700" },
                                   ].map((o) => (
                                        <div key={o.label} className={`rounded-xl p-3 ${o.color}`}>
                                             <p className="text-xl font-bold">{o.value}</p>
                                             <p className="text-xs opacity-70 mt-0.5">{o.label}</p>
                                        </div>
                                   ))}
                              </div>
                         </div>

                         <div className="pt-3 border-t border-gray-50">
                              <p className="text-xs font-semibold text-gray-500 mb-3 flex items-center gap-1">
                                   <Archive className="w-3 h-3" /> Batches
                              </p>
                              <div className="flex gap-2">
                                   {[
                                        { label: "Total", value: batches.total, color: "bg-gray-50 text-gray-700" },
                                        { label: "Active", value: batches.active, color: "bg-emerald-50 text-emerald-700" },
                                        { label: "Expired", value: batches.expired, color: "bg-red-50 text-red-600" },
                                   ].map((b) => (
                                        <div key={b.label} className={`flex-1 rounded-lg p-2.5 text-center ${b.color}`}>
                                             <p className="text-lg font-bold">{b.value}</p>
                                             <p className="text-xs opacity-70">{b.label}</p>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </div>
               </div>

               {/* ── Categories ── */}
               {medicines.byCategory.length > 0 && (
                    <div>
                         <SectionTitle icon={<Layers className="w-4 h-4" />} title="Medicines by Category" />
                         <div className="flex flex-wrap gap-2">
                              {medicines.byCategory.map((c, i) => (
                                   <div key={c.categoryId} className={`rounded-xl px-4 py-2 flex items-center gap-2 ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}>
                                        <span className="text-sm font-semibold">{c.categoryName}</span>
                                        <span className="text-xs opacity-70 bg-white/40 px-1.5 py-0.5 rounded-full font-bold">{c.count}</span>
                                   </div>
                              ))}
                         </div>
                    </div>
               )}

               {/* ── Top Medicines + Recent Orders ── */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Top Selling */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<TrendingUp className="w-4 h-4" />} title="Top Selling Medicines" />
                         {topSellingMedicines.length === 0 ? (
                              <p className="text-sm text-gray-400 text-center py-6">No sales yet</p>
                         ) : (
                              <div className="space-y-3">
                                   {topSellingMedicines.map((m, i) => (
                                        <div key={m.medicineId} className="flex items-center gap-3">
                                             <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                  {i + 1}
                                             </span>
                                             <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-semibold text-gray-800 truncate">{m.medicineName}</p>
                                                  <p className="text-xs text-gray-400">{m.totalQuantity} units sold</p>
                                             </div>
                                             <span className="text-sm font-bold text-gray-700">{fmtMoney(m.totalRevenue)}</span>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<ShoppingBag className="w-4 h-4" />} title="Recent Orders" />
                         {recentOrders.length === 0 ? (
                              <p className="text-sm text-gray-400 text-center py-6">No orders yet</p>
                         ) : (
                              <div className="space-y-3">
                                   {recentOrders.map((o: any) => (
                                        <div key={o.id} className="py-2 border-b border-gray-50 last:border-0">
                                             <div className="flex items-center justify-between mb-1">
                                                  <p className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">{o.customer?.name}</p>
                                                  <span className="text-sm font-bold text-gray-700">
                                                       {fmtMoney(o.items?.reduce((s: number, i: any) => s + i.totalPrice, 0) || 0)}
                                                  </span>
                                             </div>
                                             <div className="flex items-center justify-between">
                                                  <p className="text-xs text-gray-400 truncate max-w-[160px]">
                                                       {o.items?.map((it: any) => it.medicineName).join(", ")}
                                                  </p>
                                                  <span className="text-xs text-gray-400">
                                                       {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                                  </span>
                                             </div>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </div>
               </div>

          </div>
     );
}