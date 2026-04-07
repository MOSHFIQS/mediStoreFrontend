import { Route } from "@/types/routes.type";
import {
     LayoutDashboard,
     User,
     Users,
     Tags,
     Ticket,
     Star,
     FileText,
     CreditCard,
     Home,
     Store,
     Plus,
} from "lucide-react";

export const adminRoutes: Route[] = [
     {
          title: "Dashboard",
          items: [
               {
                    title: "Analytics",
                    url: "/admin-dashboard",
                    icon: LayoutDashboard,
               },
          ],
     },

     {
          title: "Account",
          items: [
               {
                    title: "Profile",
                    url: "/admin-dashboard/profile",
                    icon: User,
               },
          ],
     },

     {
          title: "User Management",
          items: [
               {
                    title: "All Users",
                    url: "/admin-dashboard/users",
                    icon: Users,
               },
          ],
     },

     {
          title: "Catalog Management",
          items: [
               {
                    title: "All Category",
                    url: "/admin-dashboard/category",
                    icon: Tags,
               },
               {
                    title: "Create Category",
                    url: "/admin-dashboard/category/create",
                    icon: Plus,
               },
          ],
     },

     {
          title: "Marketing",
          items: [
               {
                    title: "Coupons",
                    url: "/admin-dashboard/coupons",
                    icon: Ticket,
               },
               {
                    title: "Create Coupons",
                    url: "/admin-dashboard/coupons/create",
                    icon: Plus,
               },
          ],
     },

     {
          title: "Engagement",
          items: [
               {
                    title: "All Reviews",
                    url: "/admin-dashboard/reviews",
                    icon: Star,
               },
          ],
     },

     {
          title: "System",
          items: [
               {
                    title: "Audit Logs",
                    url: "/admin-dashboard/audit",
                    icon: FileText,
               },
          ],
     },

     {
          title: "Payments",
          items: [
               {
                    title: "All Payments",
                    url: "/admin-dashboard/payments",
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