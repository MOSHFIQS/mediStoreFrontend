"use server";

import { orderServiceServer } from "@/service/order.server.service";
import { revalidatePath } from "next/cache";

// Server action to create an order
export async function createOrderAction({
     medicineId,
     quantity,
     address,
}: {
     medicineId: string;
     quantity: number;
     address: string;
}) {
     // Get token from cookie

     const res = await orderServiceServer.create({
          address,
          items: [{ medicineId, quantity }],
     });

     if (!res.ok) throw new Error(res.message);

     return res;
}


export async function createCartOrderAction({
     items,
     address,
}: {
     items: { medicineId: string; quantity: number }[];
     address: string;
}) {
     if (!address) throw new Error("Address is required");
     if (!items || items.length === 0) throw new Error("Cart is empty");

     const res = await orderServiceServer.create({
          address,
          items,
     });

     if (!res.ok) throw new Error(res.message);

     return res;
}

export async function updateOrderStatusAction(
     orderId: string,
     status: string
) {
     const res = await orderServiceServer.updateStatus(orderId, status);

     if (!res.ok) {
          return { success: false, message: res.message };
     }

     revalidatePath("/my-orders");
     return { success: true };
}


export async function cancelOrderAction(orderId: string) {

     const res = await orderServiceServer.cancel(orderId);
     if (!res.ok) throw new Error(res.message);

     return res;
}