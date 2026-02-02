import * as React from "react"

import {
     Sidebar,
     SidebarContent,
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



export function AppSidebar({ user, ...props }: { user: { role: string } & React.ComponentProps<typeof Sidebar> }) {
     let routes: Route[] = []

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
          <Sidebar {...props}>
               <SidebarContent>
                    <Link href={"/"} className="flex items-center gap-2 justify-start pt-4 pl-4">
                         <img src={"https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg"} className="max-h-8 dark:invert" alt={"logo"} />
                         <span className="text-lg font-semibold tracking-tighter">
                              Medi Store
                         </span>
                    </Link>
                    {routes.map((item) => (
                         <SidebarGroup key={item.title}>
                              <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                              <SidebarGroupContent>
                                   <SidebarMenu>
                                        {item.items.map((item) => (
                                             <SidebarMenuItem key={item.title}>
                                                  <SidebarMenuButton asChild>
                                                       <Link href={item.url}>{item.title}</Link>
                                                  </SidebarMenuButton>
                                             </SidebarMenuItem>
                                        ))}
                                   </SidebarMenu>
                              </SidebarGroupContent>
                         </SidebarGroup>
                    ))}
               </SidebarContent>
               <SidebarRail />
          </Sidebar>
     )
}
