import { Route } from "@/types/routes.type";


export const adminRoutes: Route[] = [
     {
          title: "admin sidebar",
          items: [
               {
                    title: "Profile",
                    url: "/admin-dashboard/profile",
               },
               {
                    title: "All Users",
                    url: "/admin-dashboard/all-users",
               },
               {
                    title: "Create Category",
                    url: "/admin-dashboard/create-category",
               },
               {
                    title: "All Category",
                    url: "/admin-dashboard/all-category",
               },
               {
                    title: "All Reviews",
                    url: "/admin-dashboard/all-reviews",
               },
               {
                    title: "Home",
                    url: "/",
               }
          ],
     }
]