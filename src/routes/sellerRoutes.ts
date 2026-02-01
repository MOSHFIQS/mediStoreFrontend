import { Route } from "@/types/routes.type";


export const sellerRoutes: Route[] = [
     {
          title: "seller sidebar",
          items: [
               {
                    title: "Create Medicine",
                    url: "/seller-dashboard/create-medicine",
               },
               {
                    title: "All Medicine",
                    url: "/seller-dashboard/seller-medicines",
               },
               
               {
                    title: "My Orders",
                    url: "/seller-dashboard/my-orders",
               },
               {
                    title: "Home",
                    url: "/",
               }

          ],
     }
]