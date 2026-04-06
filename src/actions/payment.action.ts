"use server";

import { paymentServiceServer } from "@/service/payment.server.service";
import { revalidatePath } from "next/cache";

// Initiate payment
export async function initiatePaymentAction(orderId: string) {
     try {
          if (!orderId) return { ok: false, message: "Order ID is required" };

          const res = await paymentServiceServer.initiate(orderId);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to initiate payment" };
          }

          return { ok: true, message: res?.message || "Payment initiated successfully", data: res?.data?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while initiating payment" };
     }
}