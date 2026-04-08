"use client"
import {
     Package, DollarSign, ShoppingBag, TrendingUp, TrendingDown,
     Star, AlertTriangle, CheckCircle2, XCircle, BarChart3,
     Layers, Clock, Truck, RefreshCw, Activity, Archive
} from "lucide-react";
import {
     AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
     XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
     ComposedChart
} from "recharts";

// ── Types ──────────────────────────────────────────────────────
type SellerStats = {
     medicines: {
          total: number; active: number; inactive: number;
          outOfStock: number; lowStock: number; addedThisMonth: number;
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

const CHART_COLORS = ["#6366F1", "#A855F7", "#3B82F6", "#10B981", "#F59E0B", "#EC4899"];

const MoneyTooltip = ({ active, payload, label }: any) => {
     if (active && payload && payload.length) {
          return (
               <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-3 py-2 text-xs">
                    {label && <p className="text-gray-500 mb-1">{label}</p>}
                    {payload.map((p: any, i: number) => (
                         <p key={i} className="font-semibold text-gray-800">
                              {p.name}: {p.name?.toLowerCase().includes("revenue") || p.name?.toLowerCase().includes("amount")
                                   ? fmtMoney(p.value) : p.value}
                         </p>
                    ))}
               </div>
          );
     }
     return null;
};

export default function SellerStats({ stats }: Props) {
     if (!stats) return <p className="p-6 text-red-500">No statistics available.</p>;

     const { medicines, orders, revenue, reviews, batches, topSellingMedicines, recentOrders } = stats;

     // Daily revenue data (last 7 or all available)
     const dailyData = revenue.daily.slice(-7).map(d => ({
          date: d.date.slice(5), // MM-DD
          amount: d.amount,
     }));

     // Orders breakdown data
     const orderBreakdownData = [
          { name: "Delivered",  value: orders.delivered,  color: "#10B981" },
          { name: "Processing", value: orders.processing, color: "#F59E0B" },
          { name: "Cancelled",  value: orders.cancelled,  color: "#EF4444" },
     ].filter(d => d.value > 0);

     // Revenue compare
     const revenueCompareData = [
          { period: "Last Month", revenue: revenue.lastMonth },
          { period: "This Month", revenue: revenue.thisMonth },
          { period: "Today",      revenue: revenue.today },
     ];

     // Inventory health donut
     const inventoryData = [
          { name: "Active",     value: medicines.active,      color: "#10B981" },
          { name: "Inactive",   value: medicines.inactive,    color: "#9CA3AF" },
          { name: "Out of Stock", value: medicines.outOfStock, color: "#EF4444" },
          { name: "Low Stock",  value: medicines.lowStock,    color: "#F59E0B" },
     ].filter(d => d.value > 0);

     // Top selling chart
     const topSellingChartData = topSellingMedicines.slice(0, 5).map(m => ({
          name: m.medicineName.length > 14 ? m.medicineName.slice(0, 14) + "…" : m.medicineName,
          qty: m.totalQuantity,
          revenue: m.totalRevenue,
     }));

     // Category bar
     const categoryChartData = medicines.byCategory.slice(0, 8).map(c => ({
          name: c.categoryName.length > 10 ? c.categoryName.slice(0, 10) + "…" : c.categoryName,
          count: c.count,
     }));

     // Batch data
     const batchData = [
          { name: "Active",  value: batches.active,  color: "#10B981" },
          { name: "Expired", value: batches.expired, color: "#EF4444" },
     ].filter(d => d.value > 0);

     return (
          <div className="p-6 space-y-8 min-h-screen">

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

               {/* ── CHARTS ROW 1: Daily Revenue Area + Revenue Compare Bar ── */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Daily Revenue Area */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
                         <SectionTitle icon={<TrendingUp className="w-4 h-4" />} title="Daily Revenue (Last 7 Days)" />
                         <div style={{ height: 220 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <AreaChart data={dailyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                        <defs>
                                             <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                                                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                             </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                                             tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip content={<MoneyTooltip />} />
                                        <Area type="monotone" dataKey="amount" name="Revenue" stroke="#10B981" strokeWidth={2}
                                             fill="url(#revenueGrad)" dot={{ r: 3, fill: "#10B981" }} activeDot={{ r: 5 }} />
                                   </AreaChart>
                              </ResponsiveContainer>
                         </div>
                    </div>

                    {/* Revenue breakdown */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<DollarSign className="w-4 h-4" />} title="Revenue Breakdown" />
                         <div style={{ height: 220 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <BarChart data={revenueCompareData} layout="vertical"
                                        margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                        <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                                             tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                                        <YAxis type="category" dataKey="period" tick={{ fontSize: 11, fill: "#6B7280" }}
                                             axisLine={false} tickLine={false} width={80} />
                                        <Tooltip content={<MoneyTooltip />} />
                                        <Bar dataKey="revenue" name="Revenue" radius={[0, 6, 6, 0]}>
                                             {revenueCompareData.map((_, i) => (
                                                  <Cell key={i} fill={i === 1 ? "#10B981" : i === 0 ? "#6EE7B7" : "#A7F3D0"} />
                                             ))}
                                        </Bar>
                                   </BarChart>
                              </ResponsiveContainer>
                         </div>
                    </div>
               </div>

               {/* ── CHARTS ROW 2: Inventory Donut + Orders Donut + Batch ── */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Inventory Health Donut */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<Package className="w-4 h-4" />} title="Inventory Health" />
                         <div style={{ height: 180 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <PieChart>
                                        <Pie data={inventoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                                             paddingAngle={2} dataKey="value">
                                             {inventoryData.map((entry, i) => (
                                                  <Cell key={i} fill={entry.color} />
                                             ))}
                                        </Pie>
                                        <Tooltip />
                                   </PieChart>
                              </ResponsiveContainer>
                         </div>
                         <div className="space-y-1.5 mt-2">
                              {inventoryData.map(d => (
                                   <div key={d.name} className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-2 text-gray-500">
                                             <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                                             {d.name}
                                        </span>
                                        <span className="font-bold text-gray-800">{d.value}</span>
                                   </div>
                              ))}
                         </div>
                    </div>

                    {/* Orders Donut */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<ShoppingBag className="w-4 h-4" />} title="Order Breakdown" />
                         <div style={{ height: 180 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <PieChart>
                                        <Pie data={orderBreakdownData} cx="50%" cy="50%" outerRadius={75}
                                             paddingAngle={2} dataKey="value">
                                             {orderBreakdownData.map((entry, i) => (
                                                  <Cell key={i} fill={entry.color} />
                                             ))}
                                        </Pie>
                                        <Tooltip />
                                   </PieChart>
                              </ResponsiveContainer>
                         </div>
                         <div className="space-y-1.5 mt-2">
                              {orderBreakdownData.map(d => (
                                   <div key={d.name} className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-2 text-gray-500">
                                             <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                                             {d.name}
                                        </span>
                                        <span className="font-bold text-gray-800">{d.value}</span>
                                   </div>
                              ))}
                         </div>
                    </div>

                    {/* Batch Donut + stats */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<Archive className="w-4 h-4" />} title="Batch Overview" />
                         <div style={{ height: 180 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <PieChart>
                                        <Pie data={batchData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                                             paddingAngle={3} dataKey="value">
                                             {batchData.map((entry, i) => (
                                                  <Cell key={i} fill={entry.color} />
                                             ))}
                                        </Pie>
                                        <Tooltip />
                                   </PieChart>
                              </ResponsiveContainer>
                         </div>
                         <div className="flex gap-2 mt-2">
                              {[
                                   { label: "Total",   value: batches.total,   color: "bg-gray-50 text-gray-700" },
                                   { label: "Active",  value: batches.active,  color: "bg-emerald-50 text-emerald-700" },
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

               {/* ── CHARTS ROW 3: Top Selling Composed + Categories Bar ── */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Top Selling Composed (qty bar + revenue line) */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<TrendingUp className="w-4 h-4" />} title="Top Selling — Qty & Revenue" />
                         {topSellingChartData.length === 0 ? (
                              <p className="text-sm text-gray-400 text-center py-6">No sales yet</p>
                         ) : (
                              <div style={{ height: 240 }}>
                                   <ResponsiveContainer width="100%" height="100%">
                                        <ComposedChart data={topSellingChartData} layout="vertical"
                                             margin={{ top: 0, right: 60, left: 0, bottom: 0 }}>
                                             <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                             <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                             <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }}
                                                  axisLine={false} tickLine={false} width={90} />
                                             <Tooltip content={<MoneyTooltip />} />
                                             <Bar dataKey="qty" name="Units Sold" fill="#6EE7B7" radius={[0, 4, 4, 0]} />
                                        </ComposedChart>
                                   </ResponsiveContainer>
                              </div>
                         )}
                    </div>

                    {/* Categories Bar */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<Layers className="w-4 h-4" />} title="Medicines by Category" />
                         {categoryChartData.length === 0 ? (
                              <p className="text-sm text-gray-400 text-center py-6">No categories yet</p>
                         ) : (
                              <div style={{ height: 240 }}>
                                   <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={categoryChartData} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
                                             <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                             <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false}
                                                  tickLine={false} angle={-35} textAnchor="end" interval={0} />
                                             <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                             <Tooltip />
                                             <Bar dataKey="count" name="Medicines" radius={[6, 6, 0, 0]}>
                                                  {categoryChartData.map((_, i) => (
                                                       <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                                                  ))}
                                             </Bar>
                                        </BarChart>
                                   </ResponsiveContainer>
                              </div>
                         )}
                    </div>
               </div>

               {/* ── Categories chips ── */}
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

               {/* ── Top Selling Table + Recent Orders ── */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

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