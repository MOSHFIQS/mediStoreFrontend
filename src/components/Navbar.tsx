


"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
     NavigationMenu,
     NavigationMenuItem,
     NavigationMenuLink,
     NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
     Sheet,
     SheetContent,
     SheetHeader,
     SheetTitle,
     SheetTrigger,
} from "@/components/ui/sheet";
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

          // show only when logged in
          ...(user?.id
               ? [
                    { title: "My Cart", url: "/cart" },
                    { title: "My Orders", url: "/my-orders" },
               ]
               : []),
     ];


     const isActive = (url: string) => {
          if (url === "/") {
               return pathname === "/";
          }
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
          <section className="py-6  sticky top-0 z-50 bg-white">
               <div>

                    <nav className="hidden items-center justify-between lg:flex px-4">

                         <div className="flex items-center justify-center gap-10">
                              {/* Logo */}
                              <Link href="/" className="flex items-center gap-2">
                                   <img src="/logo.png" className="max-h-8" />
                                   <span className="text-lg font-semibold">Medi Store</span>
                              </Link>

                              {/* Menu */}
                              <div className="flex items-center gap-3">
                                   {menu.map((item) => (
                                        <button key={item.title} className={""}>
                                             <Link
                                                  href={item.url}
                                                  className={`px-2 py-1 text-md font-medium   transition
                                             ${isActive(item.url)
                                                            ? "bg-[#FE7743] text-white rounded-full"
                                                            : "bg-gray-50 hover:bg-muted"
                                                       }
                                             `}
                                             >
                                                  {item.title}
                                             </Link>
                                        </button>
                                   ))}
                              </div>
                         </div>

                         {/* Search + Auth */}
                         <div className="flex items-center gap-3">


                              {user?.id ? (
                                   <>
                                        <NotificationBell />
                                        <Button
                                             variant="outline"
                                             className="rounded-full"
                                             onClick={() => router.push("/dashboard")}
                                        >
                                             Dashboard
                                        </Button>

                                        <Button variant="outline" className="rounded-full" onClick={handleLogout}>
                                             Logout
                                        </Button>
                                        <div className="rounded-full border border-gray-300 w-[35px] h-[35px] overflow-hidden">
                                             <img
                                                  src={user.image || "https://i.ibb.co.com/LhN7fmfM/5578a3db8b5f1101c971bdf120e63784.jpg"}
                                                  alt="User avatar"
                                                  className="rounded-full object-cover w-full h-full"
                                                  onError={(e) => {
                                                       e.currentTarget.src =
                                                            "https://i.ibb.co.com/LhN7fmfM/5578a3db8b5f1101c971bdf120e63784.jpg"
                                                  }}
                                             />

                                        </div>
                                   </>
                              ) : (
                                   <>
                                        <Button asChild variant="outline" className="rounded-full">
                                             <Link href={`/login?redirect=${pathname}`}>Login</Link>
                                        </Button>

                                        <Button asChild variant={"outline"} className="rounded-full">
                                             <Link href="/register">Register</Link>
                                        </Button>
                                   </>
                              )}
                         </div>
                    </nav>

                    {/* ================= MOBILE ================= */}
                    <div className="flex items-center justify-between lg:hidden px-4">

                         {/* Logo */}
                         <Link href="/" className="flex items-center gap-2">
                              <img src="/logo.png" className="h-8" />
                              <span className="font-semibold">PLANORA</span>
                         </Link>

                         <Sheet>
                              <SheetTrigger asChild>
                                   <Button variant="outline" size="icon">
                                        <Menu className="w-5 h-5" />
                                   </Button>
                              </SheetTrigger>

                              <SheetContent side="right" className="w-[280px] px-3">
                                   <SheetHeader>
                                        <SheetTitle className="text-center text-xl font-bold">
                                             PLANORA
                                        </SheetTitle>
                                   </SheetHeader>

                                   <div className="flex flex-col gap-4 mt-6">


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

                                        {/* Divider */}
                                        <div className="border-t my-2" />

                                        {/* Auth */}
                                        <div className="flex flex-col gap-2">
                                             {user?.id ? (
                                                  <>
                                                       <NotificationBell />
                                                       <Button
                                                            variant="violet"
                                                            className="w-full rounded-full"

                                                            onClick={() => router.push("/dashboard")}
                                                       >
                                                            Dashboard
                                                       </Button>

                                                       <Button
                                                            className="w-full rounded-full"
                                                            onClick={handleLogout}
                                                       >
                                                            Logout
                                                       </Button>
                                                  </>
                                             ) : (
                                                  <>
                                                       <Button asChild variant="outline" className="w-full rounded-full">
                                                            <Link href={`/login?redirect=${pathname}`}>
                                                                 Login
                                                            </Link>
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
          </section>
     );
};

export { Navbar };
