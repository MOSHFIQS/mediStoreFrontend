"use server";

import { orderServiceServer } from "@/service/order.server.service";
import { paymentServiceServer } from "@/service/payment.server.service";
import { revalidatePath } from "next/cache";

// ── Single medicine "Buy Now" ──────────────────────────────
export async function createOrderAction({
     medicineId,
     quantity,
     addressId,
     addressSnapshot,
     notes,
}: {
     medicineId: string;
     quantity: number;
     addressId?: string;
     addressSnapshot?: { line1: string; city?: string; district?: string };
     notes?: string;
}) {
     try {
          if (!medicineId) throw new Error("Medicine ID is required");
          if (!quantity || quantity <= 0) throw new Error("Quantity must be greater than 0");
          if (!addressId && !addressSnapshot?.line1) throw new Error("Delivery address is required");

          const res = await orderServiceServer.create({
               items: [{ medicineId, quantity }],
               ...(addressId ? { addressId } : { addressSnapshot }),
               notes,
          });

          if (!res?.ok) throw new Error(res?.message || "Failed to create order");

          return { ok: true, message: "Order created successfully", data: res.data.data };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong" };
     }
}

// ── Cart order ─────────────────────────────────────────────
export async function createCartOrderAction({
     items,
     addressId,
     addressSnapshot,
     couponCode,
     notes,
     shippingFee,
}: {
     items: { medicineId: string; quantity: number }[];
     addressId?: string;
     addressSnapshot?: { line1: string; city?: string; district?: string, label?: string ,line2?: string ,postalCode?: string };
     couponCode?: string;
     notes?: string;
     shippingFee?: number;
}) {
     try {
          if (!items?.length) throw new Error("Cart is empty");
          if (!addressId && !addressSnapshot?.line1) throw new Error("Delivery address is required");

          const res = await orderServiceServer.create({
               items,
               ...(addressId ? { addressId } : { addressSnapshot }),
               couponCode,
               notes,
               shippingFee,
          });

          if (!res?.ok) throw new Error(res?.message || "Failed to create order");

          return { ok: true, message: "Order created successfully", data: res.data.data };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong" };
     }
}

// ── Initiate SSLCommerz payment ────────────────────────────
export async function initiatePaymentForOrderAction(orderId: string) {
     try {
          if (!orderId) throw new Error("Order ID is required");

          const res = await paymentServiceServer.initiate(orderId);

          if (!res?.ok) throw new Error(res?.message || "Failed to initiate payment");

          // res.data.data = { gatewayUrl, tranId }
          return { ok: true, message: "Payment initiated", data: res.data.data };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong" };
     }
}

// ── Update order status (seller) ───────────────────────────
export async function updateOrderStatusAction(orderId: string, status: string) {
     try {
          if (!orderId) throw new Error("Order ID is required");
          if (!status) throw new Error("Status is required");

          const allowed = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];
          if (!allowed.includes(status)) throw new Error(`Invalid status: ${status}`);

          const res = await orderServiceServer.updateStatus(orderId, status);

          if (!res?.ok) throw new Error(res?.message || "Failed to update status");

          revalidatePath("/seller-dashboard/orders");
          revalidatePath("/my-orders");

          return { ok: true, message: `Order marked as ${status}` };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong" };
     }
}

// ── Cancel order (customer) ────────────────────────────────
export async function cancelOrderAction(orderId: string) {
     try {
          if (!orderId) throw new Error("Order ID is required");

          const res = await orderServiceServer.cancel(orderId);

          if (!res?.ok) throw new Error(res?.message || "Failed to cancel order");

          revalidatePath("/my-orders");

          return { ok: true, message: "Order cancelled successfully", data: res.data.data };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong" };
     }
}