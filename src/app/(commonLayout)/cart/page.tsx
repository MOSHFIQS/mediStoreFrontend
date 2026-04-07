import { getAddressesAction } from "@/actions/address.action";
import Cart from "@/components/ui/Cart";
import { sessionService } from "@/service/token.service";
import { Roles } from "@/constants/roles";
import React from "react";

const CartPage = async () => {
     const user = await sessionService.getUserFromToken();

     const isCustomer = user?.role === Roles.customer;

     const res = isCustomer
          ? await getAddressesAction()
          : null;

     if (isCustomer && !res?.ok) {
          return (
               <p className="p-6 text-red-600">
                    Failed to load addresses
               </p>
          );
     }

     return (
          <div>
               <Cart addresses={res?.data ?? []} />
          </div>
     );
};

export default CartPage;