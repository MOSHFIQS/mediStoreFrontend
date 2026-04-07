import { Route } from "@/types/routes.type";


export const sellerRoutes: Route[] = [
     {
          title: "seller sidebar",
          items: [
               {
                    title: "Profile",
                    url: "/seller-dashboard/profile",
               },
               {
                    title: "Create Medicine",
                    url: "/seller-dashboard/medicine/create",
               },
               {
                    title: "All Medicine",
                    url: "/seller-dashboard/medicine",
               },
               {
                    title: "All Payments",
                    url: "/seller-dashboard/payments",
               },

               {
                    title: "My Orders",
                    url: "/seller-dashboard/orders",
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