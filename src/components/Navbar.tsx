"use client";

import { Menu, User, LayoutDashboard, LogOut, Settings, ShoppingBag } from "lucide-react";
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

const Navbar = () => {
     const { user, logout, loading } = useAuth();
     const router = useRouter();
     const pathname = usePathname();

     const handleLogout = () => {
          logout();
          router.push("/");
     };

     const menu = [
          { title: "Home", url: "/" },
          { title: "All Medicines", url: "/medicines" },
          { title: "About Us", url: "/about" },
          { title: "Contact Us", url: "/contact" },
          { title: "My Cart", url: "/cart" },
     ];

     const isActive = (url: string) => {
          if (url === "/") return pathname === "/";
          return pathname === url || pathname.startsWith(url + "/");
     };

     if (loading) {
          return (
               <section className="py-4">
                    <div className="h-10" />
               </section>
          );
     }

     return (
          <section className="py-6 sticky top-0 z-50 bg-[#EFE9E3]">
               <div>
                    {/* ===== DESKTOP ===== */}
                    <nav className="hidden items-center justify-between lg:flex px-4">
                         {/* Logo */}
                         <div className="flex items-center justify-center gap-10">
                              <Link href="/" className="flex items-center gap-2">
                                   <img src="/logo.png" className="max-h-8" />
                                   <span className="text-lg font-semibold">Medi Store</span>
                              </Link>
                         </div>

                         {/* Menu */}
                         <div className="flex items-center gap-3">
                              {menu.map((item) => (
                                   <button key={item.title}>
                                        <Link
                                             href={item.url}
                                             className={`px-2 py-1 text-md font-medium transition ${isActive(item.url)
                                                  ? "bg-[#FE7743] text-white rounded-full"
                                                  : "bg-gray-50 hover:bg-muted"
                                                  }`}
                                        >
                                             {item.title}
                                        </Link>
                                   </button>
                              ))}
                         </div>

                         {/* Search + Auth */}
                         <div className="flex items-center gap-3">
                              {user?.id ? (
                                   <>
                                        {user?.role === 'CUSTOMER' && <NotificationBell />}

                                        {/* Profile Dropdown */}
                                        <DropdownMenu>
                                             <DropdownMenuTrigger asChild>
                                                  <button className="relative flex items-center gap-2 rounded-full pl-2 pr-3 py-1 border border-gray-200 bg-white hover:bg-gray-50 shadow-sm transition-all hover:shadow-md group focus:outline-none">
                                                       {/* Avatar */}
                                                       <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#FE7743]/30 group-hover:border-[#FE7743]/60 transition-colors">
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
                                                       {/* Name */}
                                                       <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                                                            {user.name || "My Account"}
                                                       </span>
                                                       {/* Chevron */}
                                                       <svg
                                                            className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#FE7743] transition-colors"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2.5}
                                                       >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                       </svg>
                                                  </button>
                                             </DropdownMenuTrigger>

                                             <DropdownMenuContent
                                                  align="end"
                                                  sideOffset={8}
                                                  className="w-64 p-0 overflow-hidden rounded shadow-xl border border-gray-100"
                                             >
                                                  {/* Header */}
                                                  <DropdownMenuLabel className="p-0">
                                                       <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-br from-[#FE7743]/10 to-[#FE7743]/5 border-b border-gray-100">
                                                            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FE7743]/40 shrink-0">
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
                                                            <div className="flex-1 min-w-0">
                                                                 <p className="text-sm font-semibold text-gray-900 truncate">
                                                                      {user.name || "User"}
                                                                 </p>
                                                                 <p className="text-xs text-gray-500 truncate">{user.email || ""}</p>
                                                                 <span className="inline-flex items-center mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#FE7743]/15 text-[#FE7743]">
                                                                      {user.role || "Member"}
                                                                 </span>
                                                            </div>
                                                       </div>
                                                  </DropdownMenuLabel>

                                                  {/* Menu Items */}
                                                  <div className="p-1.5">
                                                       <DropdownMenuItem
                                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 group"
                                                            onClick={() => router.push("/dashboard")}
                                                       >
                                                            <div className="w-8 h-8 rounded-lg bg-[#FE7743]/10 flex items-center justify-center group-hover:bg-[#FE7743]/20 transition-colors">
                                                                 <LayoutDashboard className="w-4 h-4 text-[#FE7743]" />
                                                            </div>
                                                            <div>
                                                                 <p className="text-sm font-medium text-gray-800">Dashboard</p>
                                                                 <p className="text-xs text-gray-400">Manage your account</p>
                                                            </div>
                                                       </DropdownMenuItem>

                                                       <DropdownMenuItem
                                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 group"
                                                            onClick={() => router.push("/dashboard/orders")}
                                                       >
                                                            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                                                 <ShoppingBag className="w-4 h-4 text-blue-500" />
                                                            </div>
                                                            <div>
                                                                 <p className="text-sm font-medium text-gray-800">My Orders</p>
                                                                 <p className="text-xs text-gray-400">Track your purchases</p>
                                                            </div>
                                                       </DropdownMenuItem>

                                                       <DropdownMenuItem
                                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 group"
                                                            onClick={() => router.push("/dashboard/profile")}
                                                       >
                                                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                                                 <Settings className="w-4 h-4 text-purple-500" />
                                                            </div>
                                                            <div>
                                                                 <p className="text-sm font-medium text-gray-800">Settings</p>
                                                                 <p className="text-xs text-gray-400">Profile & preferences</p>
                                                            </div>
                                                       </DropdownMenuItem>
                                                  </div>

                                                  <DropdownMenuSeparator className="my-0" />

                                                  {/* Logout */}
                                                  <div className="p-1.5">
                                                       <DropdownMenuItem
                                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-red-50 group"
                                                            onClick={handleLogout}
                                                       >
                                                            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                                                 <LogOut className="w-4 h-4 text-red-500" />
                                                            </div>
                                                            <p className="text-sm font-medium text-red-600">Logout</p>
                                                       </DropdownMenuItem>
                                                  </div>
                                             </DropdownMenuContent>
                                        </DropdownMenu>
                                   </>
                              ) : (
                                   <>
                                        <Button asChild variant="outline" className="rounded-full">
                                             <Link href={`/login?redirect=${pathname}`}>Login</Link>
                                        </Button>
                                        <Button asChild variant="outline" className="rounded-full">
                                             <Link href="/register">Register</Link>
                                        </Button>
                                   </>
                              )}
                         </div>
                    </nav>

                    {/* ===== MOBILE ===== */}
                    <div className="flex items-center justify-between lg:hidden px-4">
                         <Link href="/" className="flex items-center gap-2">
                              <img src="/logo.png" className="h-8" />
                              <span className="font-semibold">PLANORA</span>
                         </Link>

                         <div>
                              {
                                   user?.id && user?.role === 'CUSTOMER' && <NotificationBell />
                              }
                              <Sheet>
                                   <SheetTrigger asChild>
                                        <Button variant="outline" size="icon">
                                             <Menu className="w-5 h-5" />
                                        </Button>
                                   </SheetTrigger>

                                   <SheetContent side="right" className="w-[280px] px-3">
                                        <SheetHeader>
                                             <SheetTitle className="text-center text-xl font-bold">PLANORA</SheetTitle>
                                        </SheetHeader>

                                        <div className="flex flex-col gap-4 mt-6">
                                             {/* Mobile Profile Card */}
                                             {user?.id && (
                                                  <div className="flex items-center gap-3 p-3 rounded-2xl bg-gradient-to-br from-[#FE7743]/10 to-[#FE7743]/5 border border-[#FE7743]/15">
                                                       <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#FE7743]/30 shrink-0">
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
                                                       <div className="flex-1 min-w-0">
                                                            <p className="text-sm font-semibold text-gray-900 truncate">
                                                                 {user.name || "User"}
                                                            </p>
                                                            <p className="text-xs text-gray-500 truncate">{user.email || ""}</p>
                                                       </div>
                                                  </div>
                                             )}

                                             {/* Menu */}
                                             <div className="flex flex-col gap-2">
                                                  {menu.map((item) => (
                                                       <Link key={item.title} href={item.url}>
                                                            <Button
                                                                 variant={isActive(item.url) ? "orange" : "outline"}
                                                                 className="w-full justify-start"
                                                            >
                                                                 {item.title}
                                                            </Button>
                                                       </Link>
                                                  ))}
                                             </div>

                                             <div className="border-t my-2" />

                                             {/* Auth */}
                                             <div className="flex flex-col gap-2">
                                                  {user?.id ? (
                                                       <>

                                                            <Button
                                                                 variant="violet"
                                                                 className="w-full rounded-full"
                                                                 onClick={() => router.push("/dashboard")}
                                                            >
                                                                 <LayoutDashboard className="w-4 h-4 mr-2" />
                                                                 Dashboard
                                                            </Button>
                                                            <Button
                                                                 variant="outline"
                                                                 className="w-full rounded-full text-red-500 border-red-200 hover:bg-red-50"
                                                                 onClick={handleLogout}
                                                            >
                                                                 <LogOut className="w-4 h-4 mr-2" />
                                                                 Logout
                                                            </Button>
                                                       </>
                                                  ) : (
                                                       <>
                                                            <Button asChild variant="outline" className="w-full rounded-full">
                                                                 <Link href={`/login?redirect=${pathname}`}>Login</Link>
                                                            </Button>
                                                            <Button asChild className="w-full rounded-full">
                                                                 <Link href="/register">Register</Link>
                                                            </Button>
                                                       </>
                                                  )}
                                             </div>
                                        </div>
                                   </SheetContent>
                              </Sheet>
                         </div>
                    </div>
               </div>
          </section>
     );
};

export { Navbar };