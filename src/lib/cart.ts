export interface CartItem {
     medicineId: string;
     quantity: number;
     image : string ,
     name : string,
     price : number
}

export const getCart = (): CartItem[] => {
     if (typeof window === "undefined") return [];
     const cart = localStorage.getItem("cart");
     return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart: CartItem[]) => {
     if (typeof window === "undefined") return[];
     localStorage.setItem("cart", JSON.stringify(cart));
};

export const addToCart = (item: CartItem) => {
     const cart = getCart();
     const existingIndex = cart.findIndex(i => i.medicineId === item.medicineId);

     if (existingIndex !== -1) {
          cart[existingIndex].quantity += item.quantity;
     } else {
          cart.push(item);
     }

     saveCart(cart);
};




export const removeFromCart = (medicineId: string) => {
     const cart = getCart();
     const updatedCart = cart.filter(i => i.medicineId !== medicineId);
     saveCart(updatedCart);
};

export const clearCart = () => {
     localStorage.removeItem("cart");
};
