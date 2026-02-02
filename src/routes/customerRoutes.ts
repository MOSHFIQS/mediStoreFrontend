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
                    title: "My Carts",
                    url: "/dashboard/my-cart",
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