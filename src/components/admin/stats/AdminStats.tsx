import {
     Users, ShoppingBag, Package, DollarSign, TrendingUp, TrendingDown,
     ShieldCheck, ShieldOff, Store, UserCheck, Activity, AlertTriangle,
     Star, Tag, Ticket, Receipt, FileText, Clock, CheckCircle2,
     XCircle, RefreshCw, Truck, BarChart3, Layers
} from "lucide-react";

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

// ── Helpers ────────────────────────────────────────────────────
function StatCard({
     icon, label, value, sub, color = "bg-white", iconColor = "text-purple-500"
}: {
     icon: React.ReactNode; label: string; value: string | number; sub?: string;
     color?: string; iconColor?: string;
}) {
     return (
          <div className={`${color} rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4`}>
               <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 ${iconColor}`}>
                    {icon}
               </div>
               <div className="min-w-0">
                    <p className="text-xs text-gray-500 font-medium">{label}</p>
                    <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
                    {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
               </div>
          </div>
     );
}

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

const fmt = (n: number) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(n);
const fmtMoney = (n: number) => `৳${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)}`;

const ORDER_STATUS_COLOR: Record<string, string> = {
     PLACED: "bg-blue-100 text-blue-700",
     CONFIRMED: "bg-indigo-100 text-indigo-700",
     PROCESSING: "bg-amber-100 text-amber-700",
     SHIPPED: "bg-purple-100 text-purple-700",
     DELIVERED: "bg-emerald-100 text-emerald-700",
     CANCELLED: "bg-red-100 text-red-600",
     REFUNDED: "bg-gray-100 text-gray-600",
};

// ── Main ───────────────────────────────────────────────────────
export default function AdminStats({ stats }: Props) {
     if (!stats) return <p className="p-6 text-red-500">No statistics available.</p>;

     const { users, medicines, orders, revenue, payments, reviews, categories, coupons, topSellingMedicines, recentOrders } = stats;

     return (
          <div className="p-6 space-y-8  min-h-screen">

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

               {/* ── Users ── */}
               <div>
                    <SectionTitle icon={<Users className="w-4 h-4" />} title="Users" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                         {[
                              { label: "Customers", value: users.customers, icon: <UserCheck className="w-4 h-4" />, color: "text-blue-500" },
                              { label: "Sellers", value: users.sellers, icon: <Store className="w-4 h-4" />, color: "text-indigo-500" },
                              { label: "Admins", value: users.admins, icon: <ShieldCheck className="w-4 h-4" />, color: "text-purple-500" },
                              { label: "Active", value: users.active, icon: <Activity className="w-4 h-4" />, color: "text-emerald-500" },
                              { label: "Banned", value: users.banned, icon: <ShieldOff className="w-4 h-4" />, color: "text-red-500" },
                              { label: "Suspended", value: users.suspended, icon: <Clock className="w-4 h-4" />, color: "text-amber-500" },
                              { label: "Verified", value: users.verified, icon: <CheckCircle2 className="w-4 h-4" />, color: "text-teal-500" },
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

               {/* ── Orders status ── */}
               <div>
                    <SectionTitle icon={<ShoppingBag className="w-4 h-4" />} title="Orders by Status" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                         {Object.entries(orders.byStatus).map(([status, count]) => (
                              <div key={status} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                                   <p className="text-xl font-bold text-gray-900">{count}</p>
                                   <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block
                ${ORDER_STATUS_COLOR[status.toUpperCase()] || "bg-gray-100 text-gray-600"}`}>
                                        {status.charAt(0) + status.slice(1).toLowerCase()}
                                   </span>
                              </div>
                         ))}
                    </div>
               </div>

               {/* ── Revenue + Medicines  ── */}
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
                              {revenue.byPaymentMethod.map((pm) => (
                                   <div key={pm.method} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-xs text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">{pm.method}</span>
                                        <span className="text-sm font-semibold text-gray-700">{fmtMoney(pm.amount)}</span>
                                   </div>
                              ))}
                         </div>
                    </div>

                    {/* Medicines */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<Package className="w-4 h-4" />} title="Medicines" />
                         <div className="space-y-3">
                              {[
                                   { label: "Active", value: medicines.active, dot: "bg-emerald-400" },
                                   { label: "Inactive", value: medicines.inactive, dot: "bg-gray-300" },
                                   { label: "Out of Stock", value: medicines.outOfStock, dot: "bg-red-400" },
                                   { label: "Low Stock (≤10)", value: medicines.lowStock, dot: "bg-amber-400" },
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

                    {/* Reviews, etc. */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-5">

                         <div className="flex items-center justify-between pt-3 border-t border-gray-50">
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

               {/* ── Payments ── */}
               <div>
                    <SectionTitle icon={<Receipt className="w-4 h-4" />} title="Payments" />
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                         {[
                              { label: "Total", value: payments.total, color: "bg-gray-50 text-gray-700" },
                              { label: "Success", value: payments.success, color: "bg-emerald-50 text-emerald-700" },
                              { label: "Pending", value: payments.pending, color: "bg-amber-50 text-amber-700" },
                              { label: "Failed", value: payments.failed, color: "bg-red-50 text-red-600" },
                              { label: "Refunded", value: payments.refunded, color: "bg-purple-50 text-purple-700" },
                              { label: "Refund ৳", value: fmtMoney(payments.totalRefunded), color: "bg-pink-50 text-pink-600" },
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

                    {/* Top Selling Medicines */}
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

                    {/* Recent Orders */}
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

          </div>
     );
}