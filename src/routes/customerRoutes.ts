import { Route } from "@/types/routes.type";
import {
     LayoutDashboard,
     User,
     ShoppingCart,
     CreditCard,
     ClipboardList,
     Home,
     Store,
} from "lucide-react";

export const customerRoutes: Route[] = [
     {
          title: "Dashboard",
          items: [
               {
                    title: "Analytics",
                    url: "/dashboard",
                    icon: LayoutDashboard,
               },
          ],
     },

     {
          title: "Account",
          items: [
               {
                    title: "Profile",
                    url: "/dashboard/profile",
                    icon: User,
               },
          ],
     },

     {
          title: "Orders & Cart",
          items: [
               {
                    title: "My Orders",
                    url: "/dashboard/orders",
                    icon: ClipboardList,
               },
               {
                    title: "My Carts",
                    url: "/dashboard/my-cart",
                    icon: ShoppingCart,
               },
          ],
     },

     {
          title: "Payments",
          items: [
               {
                    title: "My Payments",
                    url: "/dashboard/payments",
                    icon: CreditCard,
               },
          ],
     },

     {
          title: "Navigation",
          items: [
               {
                    title: "Home",
                    url: "/",
                    icon: Home,
               },
               {
                    title: "Shop",
                    url: "/medicines",
                    icon: Store,
               },
          ],
     },
];