"use server";

import { orderServiceServer } from "@/service/order.server.service";
import { paymentServiceServer } from "@/service/payment.server.service";
import { revalidatePath } from "next/cache";

export async function createOrderAction({
     medicineId,
     quantity,
     address,
}: {
     medicineId: string;
     quantity: number;
     address: string;
}) {
     const res = await orderServiceServer.create({
          address,
          items: [{ medicineId, quantity }],
     });
     if (!res.ok) throw new Error(res.message);
     return res.data.data;
}

export async function createCartOrderAction({
     items,
     address,
     couponCode,
}: {
     items: { medicineId: string; quantity: number }[];
     address: string;
     couponCode?: string;
}) {
     if (!address) throw new Error("Address is required");
     if (!items?.length) throw new Error("Cart is empty");

     const res = await orderServiceServer.create({ address, items, couponCode });
     if (!res.ok) throw new Error(res.message);
     return res.data.data; // returns { id, ... }
}

export async function initiatePaymentForOrderAction(orderId: string) {
     const res = await paymentServiceServer.initiate(orderId);
     if (!res.ok) throw new Error(res.message || "Payment initiation failed");
     return res.data.data; // { gatewayUrl }
}

export async function updateOrderStatusAction(orderId: string, status: string) {
     const res = await orderServiceServer.updateStatus(orderId, status);
     if (!res.ok) return { success: false, message: res.message };
     revalidatePath("/my-orders");
     return { success: true };
}

export async function cancelOrderAction(orderId: string) {
     const res = await orderServiceServer.cancel(orderId);
     if (!res.ok) throw new Error(res.message);
     revalidatePath("/my-orders");
     return res;
}