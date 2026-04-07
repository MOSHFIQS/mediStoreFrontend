import { Route } from "@/types/routes.type";
import {
     LayoutDashboard,
     User,
     Pill,
     List,
     Plus,
     CreditCard,
     ShoppingCart,
     Home,
     Store,
} from "lucide-react";

export const sellerRoutes: Route[] = [
     {
          title: "Dashboard",
          items: [
               {
                    title: "Analytics",
                    url: "/seller-dashboard",
                    icon: LayoutDashboard,
               },
          ],
     },

     {
          title: "Account",
          items: [
               {
                    title: "Profile",
                    url: "/seller-dashboard/profile",
                    icon: User,
               },
          ],
     },

     {
          title: "Medicine Management",
          items: [
               {
                    title: "All Medicine",
                    url: "/seller-dashboard/medicine",
                    icon: Pill,
               },
               {
                    title: "Create Medicine",
                    url: "/seller-dashboard/medicine/create",
                    icon: Plus,
               },
          ],
     },

     {
          title: "Orders",
          items: [
               {
                    title: "My Orders",
                    url: "/seller-dashboard/orders",
                    icon: ShoppingCart,
               },
          ],
     },

     {
          title: "Payments",
          items: [
               {
                    title: "All Payments",
                    url: "/seller-dashboard/payments",
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