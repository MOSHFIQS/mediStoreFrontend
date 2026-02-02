import { Route } from "@/types/routes.type";


export const customerRoutes: Route[] = [
     {
          title: "customer sidebar",
          items: [
               {
                    title: "Profile",
                    url: "/dashboard/profile",
               },
               {
                    title: "My Orders",
                    url: "/dashboard/my-orders",
               },
               {
                    title: "Home",
                    url: "/",
               }

          ],
     }
]