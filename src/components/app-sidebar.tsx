"use client"
import * as React from "react"
import {
     Sidebar,
     SidebarContent,
     SidebarFooter,
     SidebarGroup,
     SidebarGroupContent,
     SidebarGroupLabel,
     SidebarMenu,
     SidebarMenuButton,
     SidebarMenuItem,
     SidebarRail,
} from "@/components/ui/sidebar"
import { Roles } from "@/constants/roles";
import { adminRoutes } from "@/routes/adminRoutes";
import { customerRoutes } from "@/routes/customerRoutes";
import { sellerRoutes } from "@/routes/sellerRoutes";
import Link from "next/link";
import { Route } from "@/types/routes.type";
import { usePathname } from "next/navigation";
import { NavUser } from "./ui/nav-user";
import { Cross } from "lucide-react";

export function AppSidebar({ user, ...props }: { user: { role: string } & React.ComponentProps<typeof Sidebar> }) {
     let routes: Route[] = []
     const pathname = usePathname();

     switch (user.role) {
          case Roles.admin:
               routes = adminRoutes
               break;
          case Roles.customer:
               routes = customerRoutes
               break;
          case Roles.seller:
               routes = sellerRoutes
               break;
          default:
               routes = []
               break;
     }

     return (
          <Sidebar {...props} variant="floating">
               <SidebarContent className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl flex flex-col justify-between px-3 py-4 shadow-sm overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {/* TOP */}
                    <div className="space-y-6">
                         {/* LOGO */}
                         <Link href={"/"} className="flex items-center gap-2.5 px-3 py-2 group">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-teal-500/25 group-hover:scale-105 transition-transform duration-200">
                                   <Cross className="w-4 h-4 fill-white" />
                              </div>
                              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                                   Medi<span className="text-teal-600 dark:text-teal-400">Store</span>
                              </span>
                         </Link>

                         {/* GROUPS */}
                         <div className="space-y-3">
                              {routes.map((group) => (
                                   <SidebarGroup key={group.title} className="p-0">
                                        <SidebarGroupLabel className="px-3 mb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                             {group.title}
                                        </SidebarGroupLabel>

                                        <SidebarGroupContent>
                                             <SidebarMenu className="gap-1">
                                                  {group.items.map((item) => {
                                                       const isActive = pathname === item.url;
                                                       const Icon = item.icon;

                                                       return (
                                                            <SidebarMenuItem key={item.title}>
                                                                 <SidebarMenuButton
                                                                      asChild
                                                                      className={`w-full px-3 py-2.5 rounded-xl flex items-center gap-2.5 text-sm font-medium transition-all duration-200 ${
                                                                           isActive
                                                                                ? "bg-teal-600 text-white shadow-md shadow-teal-600/25 font-semibold"
                                                                                : "text-slate-600 dark:text-slate-300 hover:bg-teal-50/80 dark:hover:bg-slate-800/80 hover:text-teal-700 dark:hover:text-teal-300"
                                                                      }`}
                                                                 >
                                                                      <Link href={item.url} className="flex items-center gap-2.5 w-full">
                                                                           {Icon && <Icon size={18} className={isActive ? "text-white" : "text-teal-600 dark:text-teal-400"} />}
                                                                           <span className="truncate">{item.title}</span>
                                                                      </Link>
                                                                 </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                       );
                                                  })}
                                             </SidebarMenu>
                                        </SidebarGroupContent>
                                   </SidebarGroup>
                              ))}
                         </div>
                    </div>
               </SidebarContent>

               <SidebarFooter className="pt-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl mt-2 p-2 shadow-sm">
                    <NavUser />
               </SidebarFooter>

               <SidebarRail />
          </Sidebar>
     )
}
