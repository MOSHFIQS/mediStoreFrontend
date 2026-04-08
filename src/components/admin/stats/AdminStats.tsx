"use client"
import {
     Users, ShoppingBag, Package, DollarSign, TrendingUp, TrendingDown,
     ShieldCheck, ShieldOff, Store, UserCheck, Activity, AlertTriangle,
     Star, Tag, Ticket, Receipt, FileText, Clock, CheckCircle2,
     XCircle, RefreshCw, Truck, BarChart3, Layers
} from "lucide-react";
import {
     AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
     LineChart, Line, ComposedChart, RadarChart, Radar, PolarGrid, PolarAngleAxis,
     XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

// ── Types ──────────────────────────────────────────────────────
type AdminStats = {
     users: {
          total: number; customers: number; sellers: number; admins: number;
          active: number; banned: number; suspended: number; verified: number;
          newToday: number; newThisMonth: number; newLastMonth: number; growth: number;
     };
     medicines: {
          total: number; active: number; inactive: number;
          outOfStock: number; lowStock: number;
     };
     orders: {
          total: number;
          byStatus: {
               placed: number; confirmed: number; processing: number;
               shipped: number; delivered: number; cancelled: number; refunded: number;
          };
          today: number; thisMonth: number; lastMonth: number; last7Days: number; growth: number;
          statusBreakdown: { status: string; count: number }[];
     };
     revenue: {
          total: number; today: number; thisMonth: number; lastMonth: number; growth: number;
          byPaymentMethod: { method: string; amount: number }[];
          daily: { date: string; amount: number }[];
     };
     payments: {
          total: number; success: number; pending: number; failed: number;
          refunded: number; totalRefunded: number;
     };
     reviews: { total: number; avgRating: number };
     categories: { total: number };
     coupons: { total: number; active: number };
     topSellingMedicines: { medicineId: string; medicineName: string; totalQuantity: number; totalRevenue: number }[];
     recentOrders: any[];
};

interface Props { stats?: AdminStats }

const fmt = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
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
               <span className="text-purple-500">{icon}</span>
               <h2 className="text-base font-bold text-gray-800">{title}</h2>
          </div>
     );
}

const ORDER_STATUS_COLOR: Record<string, string> = {
     PLACED: "bg-blue-100 text-blue-700",
     CONFIRMED: "bg-indigo-100 text-indigo-700",
     PROCESSING: "bg-amber-100 text-amber-700",
     SHIPPED: "bg-purple-100 text-purple-700",
     DELIVERED: "bg-emerald-100 text-emerald-700",
     CANCELLED: "bg-red-100 text-red-600",
     REFUNDED: "bg-gray-100 text-gray-600",
};

const ORDER_CHART_COLORS: Record<string, string> = {
     placed: "#3B82F6", confirmed: "#6366F1", processing: "#F59E0B",
     shipped: "#A855F7", delivered: "#10B981", cancelled: "#EF4444", refunded: "#9CA3AF",
};

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

export default function AdminStats({ stats }: Props) {
     if (!stats) return <p className="p-6 text-red-500">No statistics available.</p>;

     const { users, medicines, orders, revenue, payments, reviews, categories, coupons, topSellingMedicines, recentOrders } = stats;

     // Daily revenue for area chart
     const dailyData = revenue.daily.slice(-7).map(d => ({
          date: d.date.slice(5),
          amount: d.amount,
     }));

     // Order status for donut
     const orderStatusData = Object.entries(orders.byStatus).map(([key, count]) => ({
          name: key.charAt(0).toUpperCase() + key.slice(1),
          value: count,
          color: ORDER_CHART_COLORS[key] || "#9CA3AF",
     })).filter(d => d.value > 0);

     // Payment breakdown
     const paymentData = [
          { name: "Success",  value: payments.success,  color: "#10B981" },
          { name: "Pending",  value: payments.pending,  color: "#F59E0B" },
          { name: "Failed",   value: payments.failed,   color: "#EF4444" },
          { name: "Refunded", value: payments.refunded, color: "#A855F7" },
     ].filter(d => d.value > 0);

     // Revenue by payment method
     const paymentMethodData = revenue.byPaymentMethod.map(pm => ({
          name: pm.method.length > 12 ? pm.method.slice(0, 12) + "…" : pm.method,
          amount: pm.amount,
     }));

     // Revenue compare
     const revenueCompare = [
          { period: "Last Month", revenue: revenue.lastMonth, orders: orders.lastMonth },
          { period: "This Month", revenue: revenue.thisMonth, orders: orders.thisMonth },
     ];

     // User breakdown
     const userTypeData = [
          { name: "Customers", value: users.customers, color: "#3B82F6" },
          { name: "Sellers",   value: users.sellers,   color: "#6366F1" },
          { name: "Admins",    value: users.admins,    color: "#A855F7" },
     ].filter(d => d.value > 0);

     // User status
     const userStatusData = [
          { name: "Active",    value: users.active,    color: "#10B981" },
          { name: "Banned",    value: users.banned,    color: "#EF4444" },
          { name: "Suspended", value: users.suspended, color: "#F59E0B" },
          { name: "Verified",  value: users.verified,  color: "#6366F1" },
     ].filter(d => d.value > 0);

     // Medicines health
     const medicineData = [
          { name: "Active",        value: medicines.active,      color: "#10B981" },
          { name: "Inactive",      value: medicines.inactive,    color: "#9CA3AF" },
          { name: "Out of Stock",  value: medicines.outOfStock,  color: "#EF4444" },
          { name: "Low Stock",     value: medicines.lowStock,    color: "#F59E0B" },
     ].filter(d => d.value > 0);

     // Top selling
     const topSellingChartData = topSellingMedicines.slice(0, 6).map(m => ({
          name: m.medicineName.length > 14 ? m.medicineName.slice(0, 14) + "…" : m.medicineName,
          qty: m.totalQuantity,
          revenue: m.totalRevenue,
     }));

     return (
          <div className="p-6 space-y-8 min-h-screen">

               {/* Header */}
               <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                         <BarChart3 className="w-6 h-6 text-purple-500" /> Admin Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-0.5">Platform-wide overview and analytics</p>
               </div>

               {/* ── Hero KPIs ── */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Revenue</span>
                              <DollarSign className="w-4 h-4 text-purple-400" />
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
                         <p className="text-3xl font-bold text-gray-900">{fmt(orders.total)}</p>
                         <div className="flex items-center gap-2 mt-2">
                              <GrowthBadge value={orders.growth} />
                              <span className="text-xs text-gray-400">vs last month</span>
                         </div>
                         <p className="text-xs text-gray-400 mt-1">Today: {orders.today} · This month: {orders.thisMonth}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Total Users</span>
                              <Users className="w-4 h-4 text-emerald-400" />
                         </div>
                         <p className="text-3xl font-bold text-gray-900">{fmt(users.total)}</p>
                         <div className="flex items-center gap-2 mt-2">
                              <GrowthBadge value={users.growth} />
                              <span className="text-xs text-gray-400">vs last month</span>
                         </div>
                         <p className="text-xs text-gray-400 mt-1">New today: {users.newToday}</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Medicines</span>
                              <Package className="w-4 h-4 text-orange-400" />
                         </div>
                         <p className="text-3xl font-bold text-gray-900">{fmt(medicines.total)}</p>
                         <p className="text-xs text-gray-400 mt-2">Active: {medicines.active}</p>
                         {medicines.outOfStock > 0 && (
                              <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                                   <AlertTriangle className="w-3 h-3" /> {medicines.outOfStock} out of stock
                              </p>
                         )}
                    </div>
               </div>

               {/* ── CHARTS ROW 1: Revenue Area + Revenue/Orders Compare ── */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Daily Revenue */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 lg:col-span-2">
                         <SectionTitle icon={<TrendingUp className="w-4 h-4" />} title="Daily Revenue (Last 7 Days)" />
                         <div style={{ height: 220 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <AreaChart data={dailyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                                        <defs>
                                             <linearGradient id="adminRevGrad" x1="0" y1="0" x2="0" y2="1">
                                                  <stop offset="5%" stopColor="#A855F7" stopOpacity={0.15} />
                                                  <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                                             </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                                             tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip content={<MoneyTooltip />} />
                                        <Area type="monotone" dataKey="amount" name="Revenue" stroke="#A855F7" strokeWidth={2}
                                             fill="url(#adminRevGrad)" dot={{ r: 3, fill: "#A855F7" }} activeDot={{ r: 5 }} />
                                   </AreaChart>
                              </ResponsiveContainer>
                         </div>
                    </div>

                    {/* Month Compare Grouped Bar */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<BarChart3 className="w-4 h-4" />} title="Month Comparison" />
                         <div style={{ height: 220 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <BarChart data={revenueCompare} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                        <XAxis dataKey="period" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                                        <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                                             tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<MoneyTooltip />} />
                                        <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#A855F7" radius={[4, 4, 0, 0]} />
                                        <Bar yAxisId="right" dataKey="orders" name="Orders" fill="#E9D5FF" radius={[4, 4, 0, 0]} />
                                   </BarChart>
                              </ResponsiveContainer>
                         </div>
                    </div>
               </div>

               {/* ── CHARTS ROW 2: Users Type Donut + User Status Donut + Order Status Donut ── */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* User Types */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<Users className="w-4 h-4" />} title="User Types" />
                         <div style={{ height: 180 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <PieChart>
                                        <Pie data={userTypeData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
                                             paddingAngle={3} dataKey="value">
                                             {userTypeData.map((entry, i) => (
                                                  <Cell key={i} fill={entry.color} />
                                             ))}
                                        </Pie>
                                        <Tooltip />
                                   </PieChart>
                              </ResponsiveContainer>
                         </div>
                         <div className="space-y-1.5 mt-2">
                              {userTypeData.map(d => (
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

                    {/* User Status */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<Activity className="w-4 h-4" />} title="User Status" />
                         <div style={{ height: 180 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <PieChart>
                                        <Pie data={userStatusData} cx="50%" cy="50%" outerRadius={75}
                                             paddingAngle={2} dataKey="value">
                                             {userStatusData.map((entry, i) => (
                                                  <Cell key={i} fill={entry.color} />
                                             ))}
                                        </Pie>
                                        <Tooltip />
                                   </PieChart>
                              </ResponsiveContainer>
                         </div>
                         <div className="space-y-1.5 mt-2">
                              {userStatusData.map(d => (
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

                    {/* Order Status Donut */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<ShoppingBag className="w-4 h-4" />} title="Order Status" />
                         <div style={{ height: 180 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <PieChart>
                                        <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70}
                                             paddingAngle={2} dataKey="value">
                                             {orderStatusData.map((entry, i) => (
                                                  <Cell key={i} fill={entry.color} />
                                             ))}
                                        </Pie>
                                        <Tooltip />
                                   </PieChart>
                              </ResponsiveContainer>
                         </div>
                         <div className="space-y-1 mt-2">
                              {orderStatusData.map(d => (
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
               </div>

               {/* ── CHARTS ROW 3: Payments Donut + Medicine Health + Payment Method Bar ── */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Payments Donut */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<Receipt className="w-4 h-4" />} title="Payment Breakdown" />
                         <div style={{ height: 200 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <PieChart>
                                        <Pie data={paymentData} cx="50%" cy="50%" innerRadius={55} outerRadius={80}
                                             paddingAngle={3} dataKey="value">
                                             {paymentData.map((entry, i) => (
                                                  <Cell key={i} fill={entry.color} />
                                             ))}
                                        </Pie>
                                        <Tooltip />
                                   </PieChart>
                              </ResponsiveContainer>
                         </div>
                         <div className="grid grid-cols-2 gap-2 mt-2">
                              {[
                                   { label: "Total",    value: payments.total,    dot: "bg-gray-400" },
                                   { label: "Success",  value: payments.success,  dot: "bg-emerald-400" },
                                   { label: "Pending",  value: payments.pending,  dot: "bg-amber-400" },
                                   { label: "Failed",   value: payments.failed,   dot: "bg-red-400" },
                              ].map(p => (
                                   <div key={p.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.dot}`} />
                                        <span>{p.label}:</span>
                                        <span className="font-bold text-gray-800">{p.value}</span>
                                   </div>
                              ))}
                         </div>
                    </div>

                    {/* Medicine Health Bar */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<Package className="w-4 h-4" />} title="Medicine Health" />
                         <div style={{ height: 220 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <BarChart data={medicineData} margin={{ top: 5, right: 10, left: 0, bottom: 40 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false}
                                             tickLine={false} angle={-30} textAnchor="end" interval={0} />
                                        <YAxis tick={{ fontSize: 11, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                        <Tooltip />
                                        <Bar dataKey="value" name="Count" radius={[6, 6, 0, 0]}>
                                             {medicineData.map((entry, i) => (
                                                  <Cell key={i} fill={entry.color} />
                                             ))}
                                        </Bar>
                                   </BarChart>
                              </ResponsiveContainer>
                         </div>
                    </div>

                    {/* Revenue by Payment Method */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<DollarSign className="w-4 h-4" />} title="Revenue by Payment" />
                         {paymentMethodData.length === 0 ? (
                              <p className="text-sm text-gray-400 text-center py-6">No data</p>
                         ) : (
                              <div style={{ height: 220 }}>
                                   <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={paymentMethodData} layout="vertical"
                                             margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                                             <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                                             <XAxis type="number" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false}
                                                  tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                                             <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }}
                                                  axisLine={false} tickLine={false} width={80} />
                                             <Tooltip content={<MoneyTooltip />} />
                                             <Bar dataKey="amount" name="Revenue" radius={[0, 6, 6, 0]}>
                                                  {paymentMethodData.map((_, i) => (
                                                       <Cell key={i} fill={["#A855F7", "#6366F1", "#3B82F6", "#10B981"][i % 4]} />
                                                  ))}
                                             </Bar>
                                        </BarChart>
                                   </ResponsiveContainer>
                              </div>
                         )}
                    </div>
               </div>

               {/* ── CHARTS ROW 4: Top Selling Medicines Composed ── */}
               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <SectionTitle icon={<TrendingUp className="w-4 h-4" />} title="Top Selling Medicines — Units vs Revenue" />
                    {topSellingChartData.length === 0 ? (
                         <p className="text-sm text-gray-400 text-center py-6">No data yet</p>
                    ) : (
                         <div style={{ height: 260 }}>
                              <ResponsiveContainer width="100%" height="100%">
                                   <ComposedChart data={topSellingChartData} margin={{ top: 5, right: 20, left: 0, bottom: 50 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                        <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6B7280" }} axisLine={false}
                                             tickLine={false} angle={-30} textAnchor="end" interval={0} />
                                        <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#9CA3AF" }}
                                             axisLine={false} tickLine={false} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}k`} />
                                        <Tooltip content={<MoneyTooltip />} />
                                        <Bar yAxisId="left" dataKey="qty" name="Units Sold" fill="#DDD6FE" radius={[4, 4, 0, 0]} />
                                        <Line yAxisId="right" type="monotone" dataKey="revenue" name="Revenue"
                                             stroke="#A855F7" strokeWidth={2} dot={{ r: 4, fill: "#A855F7" }} />
                                   </ComposedChart>
                              </ResponsiveContainer>
                         </div>
                    )}
               </div>

               {/* ── Original: Users grid ── */}
               <div>
                    <SectionTitle icon={<Users className="w-4 h-4" />} title="Users" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                         {[
                              { label: "Customers",  value: users.customers,    icon: <UserCheck className="w-4 h-4" />,  color: "text-blue-500" },
                              { label: "Sellers",    value: users.sellers,      icon: <Store className="w-4 h-4" />,      color: "text-indigo-500" },
                              { label: "Admins",     value: users.admins,       icon: <ShieldCheck className="w-4 h-4" />,color: "text-purple-500" },
                              { label: "Active",     value: users.active,       icon: <Activity className="w-4 h-4" />,   color: "text-emerald-500" },
                              { label: "Banned",     value: users.banned,       icon: <ShieldOff className="w-4 h-4" />,  color: "text-red-500" },
                              { label: "Suspended",  value: users.suspended,    icon: <Clock className="w-4 h-4" />,      color: "text-amber-500" },
                              { label: "Verified",   value: users.verified,     icon: <CheckCircle2 className="w-4 h-4" />,color: "text-teal-500" },
                              { label: "This Month", value: users.newThisMonth, icon: <TrendingUp className="w-4 h-4" />, color: "text-cyan-500" },
                         ].map((s) => (
                              <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                                   <span className={`${s.color} flex justify-center mb-1`}>{s.icon}</span>
                                   <p className="text-xl font-bold text-gray-900">{s.value}</p>
                                   <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                              </div>
                         ))}
                    </div>
               </div>

               {/* ── Payments + misc ── */}
               <div>
                    <SectionTitle icon={<Receipt className="w-4 h-4" />} title="Payments" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                         {[
                              { label: "Total",    value: payments.total,                     color: "bg-gray-50 text-gray-700" },
                              { label: "Success",  value: payments.success,                   color: "bg-emerald-50 text-emerald-700" },
                              { label: "Pending",  value: payments.pending,                   color: "bg-amber-50 text-amber-700" },
                              { label: "Failed",   value: payments.failed,                    color: "bg-red-50 text-red-600" },
                              { label: "Refunded", value: payments.refunded,                  color: "bg-purple-50 text-purple-700" },
                              { label: "Refund ৳", value: fmtMoney(payments.totalRefunded),   color: "bg-pink-50 text-pink-600" },
                         ].map((p) => (
                              <div key={p.label} className={`rounded-2xl p-4 border border-gray-100 shadow-sm text-center ${p.color}`}>
                                   <p className="text-xl font-bold">{p.value}</p>
                                   <p className="text-xs mt-0.5 opacity-70">{p.label}</p>
                              </div>
                         ))}
                    </div>
               </div>

               {/* ── Top Medicines + Recent Orders ── */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<TrendingUp className="w-4 h-4" />} title="Top Selling Medicines" />
                         {topSellingMedicines.length === 0 ? (
                              <p className="text-sm text-gray-400 text-center py-6">No data yet</p>
                         ) : (
                              <div className="space-y-3">
                                   {topSellingMedicines.map((m, i) => (
                                        <div key={m.medicineId} className="flex items-center gap-3">
                                             <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                  {i + 1}
                                             </span>
                                             <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-semibold text-gray-800 truncate">{m.medicineName}</p>
                                                  <p className="text-xs text-gray-400">{m.totalQuantity} units sold</p>
                                             </div>
                                             <span className="text-sm font-bold text-gray-700 flex-shrink-0">{fmtMoney(m.totalRevenue)}</span>
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
                                        <div key={o.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                                             <div className="flex-1 min-w-0">
                                                  <p className="text-sm font-semibold text-gray-800 truncate">{o.customer?.name}</p>
                                                  <p className="text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</p>
                                             </div>
                                             <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${ORDER_STATUS_COLOR[o.status] || "bg-gray-100 text-gray-600"}`}>
                                                  {o.status}
                                             </span>
                                             <span className="text-sm font-bold text-gray-700 flex-shrink-0">{fmtMoney(o.totalPrice)}</span>
                                        </div>
                                   ))}
                              </div>
                         )}
                    </div>
               </div>

               {/* Misc stats */}
               <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                    <div className="grid grid-cols-3 gap-4">
                         <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                   <Star className="w-4 h-4 text-amber-400" />
                                   <span className="text-sm text-gray-500">Avg Rating</span>
                              </div>
                              <span className="text-sm font-bold text-gray-800">{reviews.avgRating} / 5</span>
                         </div>
                         <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                   <Ticket className="w-4 h-4 text-purple-400" />
                                   <span className="text-sm text-gray-500">Active Coupons</span>
                              </div>
                              <span className="text-sm font-bold text-gray-800">{coupons.active} / {coupons.total}</span>
                         </div>
                         <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                   <Layers className="w-4 h-4 text-blue-400" />
                                   <span className="text-sm text-gray-500">Categories</span>
                              </div>
                              <span className="text-sm font-bold text-gray-800">{categories.total}</span>
                         </div>
                    </div>
               </div>

          </div>
     );
}