"use server";

import { orderServiceServer } from "@/service/order.server.service";

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
