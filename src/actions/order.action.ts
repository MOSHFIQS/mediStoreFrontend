"use server";

import { orderServiceServer } from "@/service/order.server.service";
import { paymentServiceServer } from "@/service/payment.server.service";
import { revalidatePath } from "next/cache";

// Create a single medicine order
export async function createOrderAction({
     medicineId,
     quantity,
     address,
}: {
     medicineId: string;
     quantity: number;
     address: string;
}) {
     try {
          if (!address) return { ok: false, message: "Address is required" };
          if (!medicineId) return { ok: false, message: "Medicine ID is required" };
          if (!quantity || quantity <= 0) return { ok: false, message: "Quantity must be greater than 0" };

          const res = await orderServiceServer.create({
               address,
               items: [{ medicineId, quantity }],
          });

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to create order" };
          }

          return { ok: true, message: res?.message || "Order created successfully", data: res?.data?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while creating order" };
     }
}

// Create order from cart
export async function createCartOrderAction({
     items,
     address,
     couponCode,
}: {
     items: { medicineId: string; quantity: number }[];
     address: string;
     couponCode?: string;
}) {
     try {
          if (!address) return { ok: false, message: "Address is required" };
          if (!items?.length) return { ok: false, message: "Cart is empty" };

          const res = await orderServiceServer.create({ address, items, couponCode });

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to create cart order" };
          }

          return { ok: true, message: res?.message || "Cart order created successfully", data: res?.data?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while creating cart order" };
     }
}

// Initiate payment for order
export async function initiatePaymentForOrderAction(orderId: string) {
     try {
          if (!orderId) return { ok: false, message: "Order ID is required" };

          const res = await paymentServiceServer.initiate(orderId);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Payment initiation failed" };
          }

          return { ok: true, message: res?.message || "Payment initiated successfully", data: res?.data?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while initiating payment" };
     }
}

// Update order status
export async function updateOrderStatusAction(orderId: string, status: string) {
     try {
          if (!orderId) return { ok: false, message: "Order ID is required" };
          if (!status) return { ok: false, message: "Status is required" };

          const res = await orderServiceServer.updateStatus(orderId, status);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to update order status" };
          }

          revalidatePath("/my-orders");

          return { ok: true, message: res?.message || "Order status updated successfully" };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while updating order status" };
     }
}

// Cancel order
export async function cancelOrderAction(orderId: string) {
     try {
          if (!orderId) return { ok: false, message: "Order ID is required" };

          const res = await orderServiceServer.cancel(orderId);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to cancel order" };
          }

          revalidatePath("/my-orders");

          return { ok: true, message: res?.message || "Order cancelled successfully", data: res?.data };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while cancelling order" };
     }
}