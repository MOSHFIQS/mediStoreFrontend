import { getAddressesAction } from "@/actions/address.action";
import Cart from "@/components/ui/Cart";
import { sessionService } from "@/service/token.service";
import { Roles } from "@/constants/roles";
import React from "react";

export const dynamic = "force-dynamic";

const CartPage = async () => {
     let addresses: any[] = [];

     try {
          const user = await sessionService.getUserFromToken().catch(() => null);
          const isCustomer = user?.role === Roles.customer;

          if (isCustomer) {
               const res = await getAddressesAction().catch(() => null);
               if (res?.ok && res.data) {
                    addresses = res.data;
               }
          }
     } catch {
          addresses = [];
     }

     return (
          <div className="py-6">
               <Cart addresses={addresses} />
          </div>
     );
};

export default CartPage;
