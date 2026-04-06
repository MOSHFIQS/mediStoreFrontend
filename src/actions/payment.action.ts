"use server";

import { paymentServiceServer } from "@/service/payment.server.service";
import { revalidatePath } from "next/cache";

export async function initiatePaymentAction(orderId: string) {
     const res = await paymentServiceServer.initiate(orderId);
     if (!res.ok) throw new Error(res.message || "Failed to initiate payment");
     return res.data.data; // { gatewayUrl, tranId }
}