import {
     ShoppingBag, DollarSign, TrendingUp, TrendingDown, Star,
     FileText, Bell, MapPin, CreditCard, Package, Clock,
     CheckCircle2, XCircle, Truck, RefreshCw, AlertCircle,
     Tag, BarChart3, Heart
} from "lucide-react";

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
     };
     payments: { total: number; success: number; pending: number; failed: number };
     reviews: { total: number; avgRating: number };
     addresses: { total: number };
     notifications: { total: number; unread: number };
     topOrderedMedicines: { medicineId: string; medicineName: string; totalQuantity: number; totalSpent: number }[];
     recentOrders: any[];
};

interface Props { stats?: CustomerStats }

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
               <span className="text-blue-500">{icon}</span>
               <h2 className="text-base font-bold text-gray-800">{title}</h2>
          </div>
     );
}

const ORDER_STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; dot: string }> = {
     placed: { label: "Placed", icon: <Clock className="w-4 h-4" />, color: "text-blue-500", dot: "bg-blue-400" },
     confirmed: { label: "Confirmed", icon: <CheckCircle2 className="w-4 h-4" />, color: "text-indigo-500", dot: "bg-indigo-400" },
     processing: { label: "Processing", icon: <RefreshCw className="w-4 h-4" />, color: "text-amber-500", dot: "bg-amber-400" },
     shipped: { label: "Shipped", icon: <Truck className="w-4 h-4" />, color: "text-purple-500", dot: "bg-purple-400" },
     delivered: { label: "Delivered", icon: <Package className="w-4 h-4" />, color: "text-emerald-500", dot: "bg-emerald-400" },
     cancelled: { label: "Cancelled", icon: <XCircle className="w-4 h-4" />, color: "text-red-500", dot: "bg-red-400" },
     refunded: { label: "Refunded", icon: <RefreshCw className="w-4 h-4" />, color: "text-gray-500", dot: "bg-gray-400" },
};



// ── Main ───────────────────────────────────────────────────────
export default function CustomerStats({ stats }: Props) {
     if (!stats) return <p className="p-6 text-red-500">No statistics available.</p>;

     const { orders, spending, payments,  reviews, addresses, notifications, topOrderedMedicines, recentOrders } = stats;

     return (
          <div className="p-6 space-y-8  min-h-screen">

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

               {/* ── Order Status Breakdown ── */}
               <div>
                    <SectionTitle icon={<ShoppingBag className="w-4 h-4" />} title="Orders by Status" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                         {Object.entries(orders.byStatus).map(([key, count]) => {
                              const cfg = ORDER_STATUS_CONFIG[key];
                              return (
                                   <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
                                        <span className={`${cfg?.color || "text-gray-400"} flex justify-center mb-1`}>{cfg?.icon}</span>
                                        <p className="text-xl font-bold text-gray-900">{count}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">{cfg?.label || key}</p>
                                   </div>
                              );
                         })}
                    </div>
               </div>

               {/* ── Spending + Payments + Reviews ── */}
               <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                    {/* Spending breakdown */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<DollarSign className="w-4 h-4" />} title="Spending Breakdown" />
                         <div className="space-y-3">
                              {[
                                   { label: "This Month", value: spending.thisMonth },
                                   { label: "Last Month", value: spending.lastMonth },
                                   { label: "Today", value: spending.today },
                              ].map((s) => (
                                   <div key={s.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                        <span className="text-sm text-gray-500">{s.label}</span>
                                        <span className="text-sm font-bold text-gray-800">{fmtMoney(s.value)}</span>
                                   </div>
                              ))}
                              <div className="flex items-center justify-between py-2">
                                   <span className="text-sm text-emerald-600 flex items-center gap-1"><Tag className="w-3 h-3" /> Coupon Savings</span>
                                   <span className="text-sm font-bold text-emerald-600">{fmtMoney(spending.couponSavings)}</span>
                              </div>
                         </div>
                    </div>

                    {/* Payments */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                         <SectionTitle icon={<CreditCard className="w-4 h-4" />} title="Payments" />
                         <div className="space-y-3">
                              {[
                                   { label: "Total", value: payments.total, dot: "bg-gray-400" },
                                   { label: "Success", value: payments.success, dot: "bg-emerald-400" },
                                   { label: "Pending", value: payments.pending, dot: "bg-amber-400" },
                                   { label: "Failed", value: payments.failed, dot: "bg-red-400" },
                              ].map((p) => (
                                   <div key={p.label} className="flex items-center justify-between">
                                        <span className="flex items-center gap-2 text-sm text-gray-500">
                                             <span className={`w-2 h-2 rounded-full ${p.dot}`} /> {p.label}
                                        </span>
                                        <span className="text-sm font-bold text-gray-800">{p.value}</span>
                                   </div>
                              ))}
                         </div>
                    </div>

                    {/* Reviews + misc */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                         <SectionTitle icon={<Star className="w-4 h-4" />} title="Activity" />
                         <div className="grid grid-cols-2 gap-3">
                              <div className="bg-amber-50 rounded-xl p-4 text-center">
                                   <p className="text-2xl font-bold text-amber-700">{reviews.avgRating}</p>
                                   <p className="text-xs text-amber-600 mt-0.5">Avg Rating Given</p>
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

               {/* ── Top Ordered Medicines + Recent Orders ── */}
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                    {/* Top Ordered */}
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

                    {/* Recent Orders */}
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

               
          </div>
     );
}