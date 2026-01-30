import { Route } from "@/types/routes.type";


export const adminRoutes: Route[] = [
     {
          title: "admin sidebar",
          items: [
               {
                    title: "All Category",
                    url: "/admin-dashboard/all-category",
               },
               {
                    title: "Create Category",
                    url: "/admin-dashboard/create-category",
               },
               {
                    title: "Home",
                    url: "/",
               }
          ],
     }
]