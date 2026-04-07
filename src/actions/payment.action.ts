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

export async function getMyPaymentsAction() {
     try {
          const res = await paymentServiceServer.getMy();
          if (!res?.ok) throw new Error(res?.message || "Failed to fetch payments");
          return { ok: true, data: res.data };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong", data: [] };
     }
}

export async function getSellerPaymentsAction() {
     try {
          const res = await paymentServiceServer.getSeller();
          if (!res?.ok) throw new Error(res?.message || "Failed to fetch payments");
          return { ok: true, data: res.data };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong", data: [] };
     }
}

export async function getAllPaymentsAction() {
     try {
          const res = await paymentServiceServer.getAll();
          if (!res?.ok) throw new Error(res?.message || "Failed to fetch payments");
          return { ok: true, data: res.data };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong", data: [] };
     }
}

export async function refundPaymentAction(paymentId: string) {
     try {
          if (!paymentId) throw new Error("Payment ID is required");
          const res = await paymentServiceServer.refund(paymentId);
          if (!res?.ok) throw new Error(res?.message || "Failed to refund payment");
          revalidatePath("/admin-dashboard/payments");
          return { ok: true, message: "Payment refunded successfully" };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong" };
     }
}