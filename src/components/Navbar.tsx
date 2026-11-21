"use client";

import {
     Menu,
     User,
     LayoutDashboard,
     LogOut,
     Settings,
     ShoppingBag,
     ShoppingCart,
     ShieldCheck,
     Sparkles,
     Cross,
     ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
     Sheet,
     SheetContent,
     SheetHeader,
     SheetTitle,
     SheetTrigger,
} from "@/components/ui/sheet";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuLabel,
     DropdownMenuSeparator,
     DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useAuth } from "@/context/AuthProvider";
import { usePathname, useRouter } from "next/navigation";
import NotificationBell from "./notifications/NotificationBell";
import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/lib/cart";

const Navbar = () => {
     const { user, logout, loading } = useAuth();
     const router = useRouter();
     const pathname = usePathname();

     const { data: cart = [] } = useQuery({
          queryKey: ["cart"],
          queryFn: () => Promise.resolve(getCart()),
     });

     const cartTotalItems = cart.reduce((total: number, item: any) => total + (item.quantity || 1), 0);

     const handleLogout = () => {
          logout();
          router.push("/");
     };

     const menu = [
          { title: "Home", url: "/" },
          { title: "All Medicines", url: "/medicines" },
          { title: "About Us", url: "/about" },
          { title: "Contact Us", url: "/contact" },
     ];

     const isActive = (url: string) => {
          if (url === "/") return pathname === "/";
          return pathname === url || pathname.startsWith(url + "/");
     };

     if (loading) {
          return (
               <section className="py-4 border-b border-border/40 bg-background/80 backdrop-blur-md">
                    <div className="container mx-auto px-4 h-10 flex items-center justify-between animate-pulse">
                         <div className="w-32 h-6 bg-muted rounded-md" />
                         <div className="w-64 h-6 bg-muted rounded-full" />
                         <div className="w-24 h-6 bg-muted rounded-full" />
                    </div>
               </section>
          );
     }

     return (
          <header className="sticky top-0 z-50 w-full border-b border-slate-200/70 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-300">
               <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {/* ===== DESKTOP NAVBAR ===== */}
                    <nav className="hidden lg:flex items-center justify-between h-20">
                         {/* Brand Logo */}
                         <Link href="/" className="flex items-center gap-3 group">
                              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform duration-300">
                                   <Cross className="w-5 h-5 fill-white" />
                              </div>
                              <div className="flex flex-col">
                                   <div className="flex items-center gap-1.5">
                                        <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                             Medi<span className="text-teal-600 dark:text-teal-400">Store</span>
                                        </span>
                                        <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/60">
                                             +24/7
                                        </span>
                                   </div>
                                   <span className="text-[10px] font-medium text-slate-400 -mt-1 tracking-wider uppercase">
                                        Verified Pharmacy
                                   </span>
                              </div>
                         </Link>

                         {/* Navigation Links */}
                         <div className="flex items-center gap-1.5 bg-slate-100/70 dark:bg-slate-800/60 p-1.5 rounded-full border border-slate-200/60 dark:border-slate-700/60 shadow-inner">
                              {menu.map((item) => {
                                   const active = isActive(item.url);
                                   return (
                                        <Link
                                             key={item.title}
                                             href={item.url}
                                             className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
                                                  active
                                                       ? "bg-teal-600 text-white shadow-sm shadow-teal-600/30 font-semibold"
                                                       : "text-slate-600 dark:text-slate-300 hover:text-teal-700 dark:hover:text-teal-400 hover:bg-white dark:hover:bg-slate-800"
                                             }`}
                                        >
                                             {item.title}
                                        </Link>
                                   );
                              })}
                         </div>

                         {/* Actions: Cart + Notifications + User Auth */}
                         <div className="flex items-center gap-3">
                              {/* Cart Button */}
                              <Link
                                   href="/cart"
                                   className={`relative flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-medium transition-all duration-200 ${
                                        isActive("/cart")
                                             ? "bg-teal-50 dark:bg-teal-950/50 text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700"
                                             : "border-slate-200 dark:border-slate-700 hover:border-teal-400 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
                                   }`}
                              >
                                   <ShoppingCart className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                   <span>Cart</span>
                                   {cartTotalItems > 0 && (
                                        <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full text-xs font-bold bg-teal-600 text-white animate-in zoom-in-50">
                                             {cartTotalItems}
                                        </span>
                                   )}
                              </Link>

                              {user?.id ? (
                                   <>
                                        {user?.role === "CUSTOMER" && <NotificationBell />}

                                        {/* Profile Dropdown */}
                                        <DropdownMenu>
                                             <DropdownMenuTrigger asChild>
                                                  <button className="flex items-center gap-2.5 rounded-full pl-2 pr-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-teal-400 dark:hover:border-teal-600 shadow-sm transition-all duration-200 group focus:outline-none">
                                                       <div className="w-8 h-8 rounded-full overflow-hidden border border-teal-500/40 group-hover:border-teal-500 transition-colors">
                                                            <img
                                                                 src={
                                                                      user.image ||
                                                                      "https://i.ibb.co.com/LhN7fmfM/5578a3db8b5f1101c971bdf120e63784.jpg"
                                                                 }
                                                                 alt="User avatar"
                                                                 className="w-full h-full object-cover"
                                                                 onError={(e) => {
                                                                      e.currentTarget.src =
                                                                           "https://i.ibb.co.com/LhN7fmfM/5578a3db8b5f1101c971bdf120e63784.jpg";
                                                                 }}
                                                            />
                                                       </div>
                                                       <div className="text-left hidden xl:block">
                                                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 max-w-[110px] truncate leading-tight">
                                                                 {user.name || "My Account"}
                                                            </p>
                                                            <p className="text-[10px] font-medium text-teal-600 dark:text-teal-400 uppercase tracking-wider">
                                                                 {user.role || "MEMBER"}
                                                            </p>
                                                       </div>
                                                       <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 transition-transform group-data-[state=open]:rotate-180" />
                                                  </button>
                                             </DropdownMenuTrigger>

                                             <DropdownMenuContent
                                                  align="end"
                                                  sideOffset={10}
                                                  className="w-64 p-2 rounded-2xl shadow-xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg"
                                             >
                                                  <DropdownMenuLabel className="p-2 mb-1 rounded-xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40">
                                                       <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-500/50 shrink-0">
                                                                 <img
                                                                      src={
                                                                           user.image ||
                                                                           "https://i.ibb.co.com/LhN7fmfM/5578a3db8b5f1101c971bdf120e63784.jpg"
                                                                      }
                                                                      alt="User avatar"
                                                                      className="w-full h-full object-cover"
                                                                 />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                 <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                                      {user.name || "User"}
                                                                 </p>
                                                                 <p className="text-xs text-slate-500 truncate">{user.email || ""}</p>
                                                            </div>
                                                       </div>
                                                  </DropdownMenuLabel>

                                                  <DropdownMenuItem
                                                       className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                       onClick={() => router.push("/dashboard")}
                                                  >
                                                       <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 flex items-center justify-center">
                                                            <LayoutDashboard className="w-4 h-4" />
                                                       </div>
                                                       <div>
                                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Dashboard</p>
                                                            <p className="text-[11px] text-slate-400">Overview and metrics</p>
                                                       </div>
                                                  </DropdownMenuItem>

                                                  <DropdownMenuItem
                                                       className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                       onClick={() => router.push("/dashboard/orders")}
                                                  >
                                                       <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                                            <ShoppingBag className="w-4 h-4" />
                                                       </div>
                                                       <div>
                                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">My Orders</p>
                                                            <p className="text-[11px] text-slate-400">Track shipments</p>
                                                       </div>
                                                  </DropdownMenuItem>

                                                  <DropdownMenuItem
                                                       className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                                       onClick={() => router.push("/dashboard/profile")}
                                                  >
                                                       <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                                                            <Settings className="w-4 h-4" />
                                                       </div>
                                                       <div>
                                                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Settings</p>
                                                            <p className="text-[11px] text-slate-400">Profile & preferences</p>
                                                       </div>
                                                  </DropdownMenuItem>

                                                  <DropdownMenuSeparator className="my-1.5" />

                                                  <DropdownMenuItem
                                                       className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                                       onClick={handleLogout}
                                                  >
                                                       <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
                                                            <LogOut className="w-4 h-4 text-rose-600" />
                                                       </div>
                                                       <span className="text-sm font-semibold">Sign Out</span>
                                                  </DropdownMenuItem>
                                             </DropdownMenuContent>
                                        </DropdownMenu>
                                   </>
                              ) : (
                                   <div className="flex items-center gap-2">
                                        <Button asChild variant="ghost" className="rounded-full text-slate-700 dark:text-slate-200 hover:text-teal-700">
                                             <Link href={`/login?redirect=${pathname}`}>Login</Link>
                                        </Button>
                                        <Button
                                             asChild
                                             className="rounded-full bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white shadow-md shadow-teal-700/20 px-5 font-semibold"
                                        >
                                             <Link href="/register">Register</Link>
                                        </Button>
                                   </div>
                              )}
                         </div>
                    </nav>

                    {/* ===== MOBILE NAVBAR ===== */}
                    <div className="flex items-center justify-between h-16 lg:hidden">
                         <Link href="/" className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/25">
                                   <Cross className="w-4 h-4 fill-white" />
                              </div>
                              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                   Medi<span className="text-teal-600">Store</span>
                              </span>
                         </Link>

                         <div className="flex items-center gap-2">
                              <Link
                                   href="/cart"
                                   className="relative p-2 rounded-full border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
                              >
                                   <ShoppingCart className="w-5 h-5 text-teal-600" />
                                   {cartTotalItems > 0 && (
                                        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold bg-teal-600 text-white">
                                             {cartTotalItems}
                                        </span>
                                   )}
                              </Link>

                              {user?.id && user?.role === "CUSTOMER" && <NotificationBell />}

                              <Sheet>
                                   <SheetTrigger asChild>
                                        <Button variant="outline" size="icon" className="rounded-full">
                                             <Menu className="w-5 h-5" />
                                        </Button>
                                   </SheetTrigger>

                                   <SheetContent side="right" className="w-[300px] p-6 flex flex-col justify-between">
                                        <div>
                                             <SheetHeader className="text-left pb-4 border-b">
                                                  <div className="flex items-center gap-2.5">
                                                       <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white">
                                                            <Cross className="w-4 h-4 fill-white" />
                                                       </div>
                                                       <SheetTitle className="text-xl font-black">
                                                            Medi<span className="text-teal-600">Store</span>
                                                       </SheetTitle>
                                                  </div>
                                             </SheetHeader>

                                             {user?.id && (
                                                  <div className="flex items-center gap-3 p-3 mt-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-100 dark:border-teal-900/40">
                                                       <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-500/50 shrink-0">
                                                            <img
                                                                 src={
                                                                      user.image ||
                                                                      "https://i.ibb.co.com/LhN7fmfM/5578a3db8b5f1101c971bdf120e63784.jpg"
                                                                 }
                                                                 alt="User avatar"
                                                                 className="w-full h-full object-cover"
                                                            />
                                                       </div>
                                                       <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                                                                 {user.name || "User"}
                                                            </p>
                                                            <p className="text-xs text-slate-500 truncate">{user.email || ""}</p>
                                                       </div>
                                                  </div>
                                             )}

                                             {/* Mobile Navigation Links */}
                                             <div className="flex flex-col gap-2 mt-6">
                                                  {menu.map((item) => (
                                                       <Link key={item.title} href={item.url}>
                                                            <Button
                                                                 variant={isActive(item.url) ? "default" : "outline"}
                                                                 className={`w-full justify-start rounded-xl ${
                                                                      isActive(item.url)
                                                                           ? "bg-teal-600 text-white font-semibold"
                                                                           : "border-slate-200 dark:border-slate-800"
                                                                 }`}
                                                            >
                                                                 {item.title}
                                                            </Button>
                                                       </Link>
                                                  ))}
                                             </div>
                                        </div>

                                        {/* Mobile Auth Actions */}
                                        <div className="pt-6 border-t flex flex-col gap-2">
                                             {user?.id ? (
                                                  <>
                                                       <Button
                                                            className="w-full rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold"
                                                            onClick={() => router.push("/dashboard")}
                                                       >
                                                            <LayoutDashboard className="w-4 h-4 mr-2" />
                                                            Dashboard
                                                       </Button>
                                                       <Button
                                                            variant="outline"
                                                            className="w-full rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                            onClick={handleLogout}
                                                        >
                                                            <LogOut className="w-4 h-4 mr-2" />
                                                            Logout
                                                       </Button>
                                                  </>
                                             ) : (
                                                  <>
                                                       <Button asChild variant="outline" className="w-full rounded-xl">
                                                            <Link href={`/login?redirect=${pathname}`}>Login</Link>
                                                       </Button>
                                                       <Button asChild className="w-full rounded-xl bg-teal-600 text-white">
                                                            <Link href="/register">Create Account</Link>
                                                       </Button>
                                                  </>
                                             )}
                                        </div>
                                   </SheetContent>
                              </Sheet>
                         </div>
                    </div>
               </div>
          </header>
     );
};

export { Navbar };
