import { Route } from "@/types/routes.type";


export const adminRoutes: Route[] = [
     {
          title: "admin sidebar",
          items: [
               {
                    title: "Analytics",
                    url: "/admin-dashboard",
               },
               {
                    title: "Profile",
                    url: "/admin-dashboard/profile",
               },
               {
                    title: "All Users",
                    url: "/admin-dashboard/users",
               },
               {
                    title: "Coupons",
                    url: "/admin-dashboard/coupons",
               },
               {
                    title: "Create Category",
                    url: "/admin-dashboard/category/create",
               },
               {
                    title: "Create Coupons",
                    url: "/admin-dashboard/coupons/create",
               },
               {
                    title: "All Category",
                    url: "/admin-dashboard/category",
               },
               {
                    title: "All Reviews",
                    url: "/admin-dashboard/reviews",
               },
               {
                    title: "Audit Logs",
                    url: "/admin-dashboard/audit",
               },
               {
                    title: "All Payments",
                    url: "/admin-dashboard/payments",
               },
               {
                    title: "Home",
                    url: "/",
               },
               {
                    title: "Shop",
                    url: "/medicines",
               }
          ],
     }
]