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
                    url: "/admin-dashboard/all-users",
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
                    title: "All Category",
                    url: "/admin-dashboard/category",
               },
               {
                    title: "All Reviews",
                    url: "/admin-dashboard/all-reviews",
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