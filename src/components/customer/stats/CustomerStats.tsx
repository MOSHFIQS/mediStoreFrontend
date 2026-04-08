"use client"
import {
     ShoppingBag, DollarSign, TrendingUp, TrendingDown, Star,
     Bell, MapPin, CreditCard, Package, Clock,
     CheckCircle2, XCircle, Truck, RefreshCw, AlertCircle,
     Tag, BarChart3, Heart
} from "lucide-react";
import {
     AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, RadarChart, Radar,
     PolarGrid, PolarAngleAxis, LineChart, Line,
     XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ── Types ──────────────────────────────────────────────────────
type CustomerStats = {
     orders: {
          total: number; active: number; thisMonth: number; lastMonth: number;
          byStatus: {
               placed: number; confirmed: number; processing: number;
               shipped: number; delivered: number; cancelled: number; refunded: number;
          };
     };
     spending: {
          total: number; today: number; thisMonth: number; lastMonth: number;
          growth: number; couponSavings: number;
          monthly?: { month: string; amount: number }[];
     };
     payments: { total: number; success: number; pending: number; failed: number };
     reviews: { total: number; avgRating: number };
     addresses: { total: number };
     notifications: { total: number; unread: number };
     topOrderedMedicines: { medicineId: string; medicineName: string; totalQuantity: number; totalSpent: number }[];
     recentOrders: any[];
};

interface Props { stats?: CustomerStats }

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
               <span className="text-blue-500">{icon}</span>
               <h2 className="text-base font-bold text-gray-800">{title}</h2>
          </div>
     );
}

const ORDER_STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; dot: string; chartColor: string }> = {
     placed:     { label: "Placed",     icon: <Clock className="w-4 h-4" />,        color: "text-blue-500",   dot: "bg-blue-400",    chartColor: "#3B82F6" },
     confirmed:  { label: "Confirmed",  icon: <CheckCircle2 className="w-4 h-4" />, color: "text-indigo-500", dot: "bg-indigo-400",  chartColor: "#6366F1" },
     processing: { label: "Processing", icon: <RefreshCw className="w-4 h-4" />,    color: "text-amber-500",  dot: "bg-amber-400",   chartColor: "#F59E0B" },
     shipped:    { label: "Shipped",    icon: <Truck className="w-4 h-4" />,        color: "text-purple-500", dot: "bg-purple-400",  chartColor: "#A855F7" },
     delivered:  { label: "Delivered",  icon: <Package className="w-4 h-4" />,      color: "text-emerald-500",dot: "bg-emerald-400", chartColor: "#10B981" },
     cancelled:  { label: "Cancelled",  icon: <XCircle className="w-4 h-4" />,      color: "text-red-500",    dot: "bg-red-400",     chartColor: "#EF4444" },
     refunded:   { label: "Refunded",   icon: <RefreshCw className="w-4 h-4" />,    color: "text-gray-500",   dot: "bg-gray-400",    chartColor: "#9CA3AF" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
     if (active && payload && payload.length) {
          return (
               <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-3 py-2 text-xs">
                    {label && <p className="text-gray-500 mb-1">{label}</p>}
                    {payload.map((p: any) => (
                         <p key={p.name} className="font-semibold text-gray-800">
                              {p.name}: {typeof p.value === "number" && p.name?.toLowerCase().includes("amount") ? fmtMoney(p.value) : p.value}
                         </p>
                    ))}
               </div>
          );
     }
     return null;
};

const MoneyTooltip = ({ active, payload, label }: any) => {
     if (active && payload && payload.length) {
          return (
               <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-3 py-2 text-xs">
                    {label && <p className="text-gray-500 mb-1">{label}</p>}
                    {payload.map((p: any) => (
                         <p key={p.name} className="font-semibold text-gray-800">{fmtMoney(p.value)}</p>
                    ))}
               </div>
          );
     }
     return null;
};

export default function CustomerStats({ stats }: Props) {
     if (!stats) return <p className="p-6 text-red-500">No statistics available.</p>;

     const { orders, spending, payments, reviews, addresses, notifications, topOrderedMedicines, recentOrders } = stats;

     // Prepare chart data
     const orderStatusData = Object.entries(orders.byStatus)
          .map(([key, count]) => ({
               name: ORDER_STATUS_CONFIG[key]?.label || key,
               value: count,
               color: ORDER_STATUS_CONFIG[key]?.chartColor || "#9CA3AF",
          }))
          .filter(d => d.value > 0);

     const paymentData = [
          { name: "Success", value: payments.success, color: "#10B981" },
          { name: "Pending", value: payments.pending, color: "#F59E0B" },
          { name: "Failed",  value: payments.failed,  color: "#EF4444" },
     ].filter(d => d.value > 0);

     const spendingCompareData = [
          { period: "Last Month", amount: spending.lastMonth },
          { period: "This Month", amount: spending.thisMonth },
          { period: "Today",      amount: spending.today },
     ];

     const monthlySpending = spending.monthly || [
          { month: "Jan", amount: 0 }, { month: "Feb", amount: 0 },
          { month: "Mar", amount: 0 }, { month: "Apr", amount: 0 },
          { month: "May", amount: 0 }, { month: "Jun", amount: 0 },
     ];

     const topMedicinesChartData = topOrderedMedicines.slice(0, 5).map(m => ({
          name: m.medicineName.length > 14 ? m.medicineName.slice(0, 14) + "…" : m.medicineName,
          qty: m.totalQuantity,
          spent: m.totalSpent,
     }));

     const ordersCompareData = [
          { period: "Last Month", orders: orders.lastMonth },
          { period: "This Month", orders: orders.thisMonth },
     ];

     return (
          <div className="p-6 space-y-8 min-h-screen">

               {/* Header */}
               <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                         <BarChart3 className="w-6 h-6 text-blue-500" /> My Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Your orders, spending, and activity overview</p>
               </div>

               {/* ── Hero KPIs ── */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Spent</span>
                              <DollarSign className="w-4 h-4 text-blue-400" />
                         </div>
                         <p className="text-3xl font-bold text-gray-900">{fmtMoney(spending.total)}</p>
                         <div className="flex items-center gap-2 mt-2">
                              <GrowthBadge value={spending.growth} />
                              <span className="text-xs text-gray-400">vs last month</span>
                         </div>
                         <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                              <Tag className="w-3 h-3" /> Saved {fmtMoney(spending.couponSavings)} with coupons
                         </p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Orders</span>
                              <ShoppingBag className="w-4 h-4 text-indigo-400" />
                         </div>
                         <p className="text-3xl font-bold text-gray-900">{orders.total}</p>
                         <p className="text-xs text-gray-400 mt-2">Active: {orders.active}</p>
                         <p className="text-xs text-gray-400 mt-0.5">This month: {orders.thisMonth}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Reviews</span>
                              <Star className="w-4 h-4 text-amber-400" />
                         </div>
                         <p className="text-3xl font-bold text-gray-900">{reviews.avgRating}<span className="text-base font-normal text-gray-400">/5</span></p>
                         <p className="text-xs text-gray-400 mt-2">{reviews.total} reviews written</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Notifications</span>
                              <Bell className="w-4 h-4 text-orange-400" />
                         </div>
                         <p className="text-3xl font-bold text-gray-900">{notifications.total}</p>
                         {notifications.unread > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold mt-2 px-2 py-0.5 rounded-full bg-red-50 text-red-500">
                                   <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> {notifications.unread} unread
                              </span>
                         )}
                    </div>
               </div>

               {/* ── CHARTS ROW 1: Order Status Donut + Payment Donut ── */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Order Status Donut */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<ShoppingBag className="w-4 h-4" />} title="Orders by Status" />
                         <div className="flex items-center gap-4">
                              <div className="flex-shrink-0" style={{ width: 200, height: 200 }}>
                                   <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                             <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                                                  paddingAngle={2} dataKey="value">
                                                  {orderStatusData.map((entry, i) => (
                                                       <Cell key={i} fill={entry.color} />
                                                  ))}
                                             </Pie>
                                             <Tooltip formatter={(v: any, n: any) => [v, n]} />
                                        </PieChart>
                                   </ResponsiveContainer>
                              </div>
                              <div className="flex-1 space-y-2">
                                   {orderStatusData.map((d) => (
                                        <div key={d.name} className="flex items-center justify-between">
                                             <span className="flex items-center gap-2 text-xs text-gray-500">
                                                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                                                  {d.name}
                                             </span>
                                             <span className="text-xs font-bold text-gray-800">{d.value}</span>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </div>

                    {/* Payment Donut */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<CreditCard className="w-4 h-4" />} title="Payment Status" />
                         <div className="flex items-center gap-4">
                              <div className="flex-shrink-0" style={{ width: 200, height: 200 }}>
                                   <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                             <Pie data={paymentData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                                                  paddingAngle={2} dataKey="value">
                                                  {paymentData.map((entry, i) => (
                                                       <Cell key={i} fill={entry.color} />
                                                  ))}
                                             </Pie>
                                             <Tooltip />
                                        </PieChart>
                                   </ResponsiveContainer>
                              </div>
                              <div className="flex-1 space-y-3">
                                   {[
                                        { label: "Total",   value: payments.total,   dot: "bg-gray-400" },
                                        { label: "Success", value: payments.success, dot: "bg-emerald-400" },
                                        { label: "Pending", value: payments.pending, dot: "bg-amber-400" },
                                        { label: "Failed",  value: payments.failed,  dot: "bg-red-400" },
                                   ].map((p) => (
                                        <div key={p.label} className="flex items-center justify-between">
                                             <span className="flex items-center gap-2 text-xs text-gray-500">
                                                  <span className={`w-2 h-2 rounded-full ${p.dot}`} /> {p.label}
                                             </span>
                                             <span className="text-xs font-bold text-gray-800">{p.value}</span>
                                        </div>
                                   ))}
                              </div>
                         </div>
                    </div>
               </div>

               {/* ── CHARTS ROW 2: Spending Over Time (Area) + Orders Month Compare (Bar) ── */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Monthly Spending Area Chart */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
                         <SectionTitle icon={<TrendingUp className="w-4 h-4" />} title="Spending Trend" />
                         <div style={{ height: 220 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <AreaChart data={monthlySpending} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                        <defs>
                                             <linearGradient id="spendGrad" x1="0" y1="0" x2="0" y2="1">
                                                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15} />
                                                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                                             </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                                             tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip content={<MoneyTooltip />} />
                                        <Area type="monotone" dataKey="amount" name="Spending" stroke="#3B82F6" strokeWidth={2}
                                             fill="url(#spendGrad)" dot={{ r: 3, fill: "#3B82F6" }} activeDot={{ r: 5 }} />
                                   </AreaChart>
                              </ResponsiveContainer>
                         </div>
                    </div>

                    {/* Spending Compare Bar */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<DollarSign className="w-4 h-4" />} title="Spending Breakdown" />
                         <div style={{ height: 220 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <BarChart data={spendingCompareData} layout="vertical"
                                        margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                        <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                                             tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                                        <YAxis type="category" dataKey="period" tick={{ fontSize: 11, fill: "#6B7280" }}
                                             axisLine={false} tickLine={false} width={72} />
                                        <Tooltip content={<MoneyTooltip />} />
                                        <Bar dataKey="amount" name="Amount" radius={[0, 6, 6, 0]}>
                                             {spendingCompareData.map((_, i) => (
                                                  <Cell key={i} fill={i === 1 ? "#3B82F6" : i === 0 ? "#93C5FD" : "#BFDBFE"} />
                                             ))}
                                        </Bar>
                                   </BarChart>
                              </ResponsiveContainer>
                         </div>
                         <div className="mt-3 space-y-1">
                              <div className="flex justify-between text-xs">
                                   <span className="text-gray-400">Coupon Savings</span>
                                   <span className="font-bold text-emerald-600">{fmtMoney(spending.couponSavings)}</span>
                              </div>
                         </div>
                    </div>
               </div>

               {/* ── CHARTS ROW 3: Top Medicines Bar + Order Status bar ── */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Top Medicines Bar */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<Heart className="w-4 h-4" />} title="Most Ordered Medicines" />
                         {topMedicinesChartData.length === 0 ? (
                              <p className="text-sm text-gray-400 text-center py-6">No purchases yet</p>
                         ) : (
                              <div style={{ height: 220 }}>
                                   <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={topMedicinesChartData} layout="vertical"
                                             margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                             <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                             <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                             <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }}
                                                  axisLine={false} tickLine={false} width={90} />
                                             <Tooltip />
                                             <Bar dataKey="qty" name="Qty" fill="#6366F1" radius={[0, 6, 6, 0]} />
                                        </BarChart>
                                   </ResponsiveContainer>
                              </div>
                         )}
                    </div>

                    {/* Order Status Horizontal Bar */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<ShoppingBag className="w-4 h-4" />} title="Order Status Breakdown" />
                         <div style={{ height: 220 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <BarChart data={orderStatusData} layout="vertical"
                                        margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                        <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                        <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }}
                                             axisLine={false} tickLine={false} width={72} />
                                        <Tooltip />
                                        <Bar dataKey="value" name="Orders" radius={[0, 6, 6, 0]}>
                                             {orderStatusData.map((entry, i) => (
                                                  <Cell key={i} fill={entry.color} />
                                             ))}
                                        </Bar>
                                   </BarChart>
                              </ResponsiveContainer>
                         </div>
                    </div>
               </div>

               {/* ── Original Tables: Top Ordered + Recent Orders ── */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<Heart className="w-4 h-4" />} title="Your Most Ordered" />
                         {topOrderedMedicines.length === 0 ? (
                              <p className="text-sm text-gray-400 text-center py-6">No purchases yet</p>
                         ) : (
                              <div className="space-y-3">
                                   {topOrderedMedicines.map((m, i) => (
                                        <div key={m.medicineId} className="flex items-center gap-3">
                                             <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                  {i + 1}
                                             </span>
                                             <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-semibold text-gray-800 truncate">{m.medicineName}</p>
                                                  <p className="text-xs text-gray-400">{m.totalQuantity} units ordered</p>
                                             </div>
                                             <span className="text-sm font-bold text-gray-700">{fmtMoney(m.totalSpent)}</span>
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
                                   {recentOrders.map((o: any) => {
                                        const statusKey = o.status?.toLowerCase();
                                        const cfg = ORDER_STATUS_CONFIG[statusKey] || {};
                                        return (
                                             <div key={o.id} className="py-2 border-b border-gray-50 last:border-0">
                                                  <div className="flex items-center justify-between">
                                                       <p className="text-xs text-gray-400">
                                                            {new Date(o.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                                       </p>
                                                       <span className="text-xs font-bold text-gray-800">{fmtMoney(o.totalPrice)}</span>
                                                  </div>
                                                  <div className="flex items-center justify-between mt-1">
                                                       <p className="text-sm text-gray-600 truncate max-w-[180px]">
                                                            {o.items?.slice(0, 2).map((it: any) => it.medicineName).join(", ")}
                                                            {o.items?.length > 2 ? ` +${o.items.length - 2}` : ""}
                                                       </p>
                                                       <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                        ${ORDER_STATUS_CONFIG[statusKey]?.dot?.replace("bg-", "bg-").replace("400", "100") || "bg-gray-100"}
                        ${cfg.color || "text-gray-600"}`}>
                                                            {o.status}
                                                       </span>
                                                  </div>
                                             </div>
                                        );
                                   })}
                              </div>
                         )}
                    </div>
               </div>

               {/* ── Activity mini stats ── */}
               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <SectionTitle icon={<Star className="w-4 h-4" />} title="Activity" />
                    <div className="grid grid-cols-3 gap-3">
                         <div className="bg-amber-50 rounded-xl p-4 text-center">
                              <p className="text-2xl font-bold text-amber-700">{reviews.avgRating}</p>
                              <p className="text-xs text-amber-600 mt-0.5">Avg Rating</p>
                         </div>
                         <div className="bg-blue-50 rounded-xl p-4 text-center">
                              <p className="text-2xl font-bold text-blue-700">{reviews.total}</p>
                              <p className="text-xs text-blue-600 mt-0.5">Reviews Written</p>
                         </div>
                         <div className="bg-purple-50 rounded-xl p-4 text-center">
                              <p className="text-2xl font-bold text-purple-700">{addresses.total}</p>
                              <p className="text-xs text-purple-600 mt-0.5">Saved Addresses</p>
                         </div>
                    </div>
               </div>

          </div>
     );
}