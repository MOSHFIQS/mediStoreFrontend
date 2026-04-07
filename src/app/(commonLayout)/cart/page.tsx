import { getAddressesAction } from '@/actions/address.action';
import Cart from '@/components/ui/Cart';
import React from 'react';

const CartPage = async () => {
     const res = await getAddressesAction();

     console.log(res);

     if (!res?.ok) {
          return (
               <p className="p-6 text-red-600">
                    Failed to load addresses
               </p>
          );
     }
     return (
          <div>
               <Cart addresses={res.data} />
          </div>
     );
};

export default CartPage;