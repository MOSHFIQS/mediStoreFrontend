"use server";

import { orderServiceServer } from "@/service/order.server.service";
import { paymentServiceServer } from "@/service/payment.server.service";
import { buildQueryString } from "@/utils/buildQueryString";
import { revalidatePath } from "next/cache";

// ── Single medicine "Buy Now" ──────────────────────────────
export async function createOrderAction({
     medicineId,
     quantity,
     addressId,
     addressSnapshot,
     notes
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
               notes
          });

          if (!res?.ok) throw new Error(res?.message || "Failed to create order");

          return { ok: true, message: "Order created successfully", data: res.data };
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
     addressSnapshot?: { line1: string; city?: string; district?: string, label?: string, line2?: string, postalCode?: string };
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

          return { ok: true, message: "Order created successfully", data: res.data };
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

          return { ok: true, message: "Payment initiated", data: res.data };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong" };
     }
}

// ── Update order status (seller) ───────────────────────────
export async function updateOrderStatusAction(orderId: string, status: string) {
     try {
          if (!orderId) throw new Error("Order ID is required");
          if (!status) throw new Error("Status is required");

          const allowed = ["CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED","CANCELLED"];
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

          return { ok: true, message: "Order cancelled successfully", data: res.data };
     } catch (err: any) {
          return { ok: false, message: err.message || "Something went wrong" };
     }
}



// Get orders of the logged-in seller
export async function getSellerOrdersAction(page?: number, limit?: number) {
     try {
           const query = buildQueryString({
            page,
            limit
        });
          const res = await orderServiceServer.getSellerOrders?.(query);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to fetch seller orders", data: [] };
          }

          return { ok: true, message: res?.message || "Seller orders fetched successfully", data: res?.data || [] };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while fetching seller orders", data: [] };
     }
}

// Get orders of the logged-in user
export async function getMyOrdersAction(page?: number, limit?: number) {
     try {
          const query = buildQueryString({
               page,
               limit
          });
          const res = await orderServiceServer.getMyOrders?.(query);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to fetch your orders", data: [] };
          }

          return { ok: true, message: res?.message || "Your orders fetched successfully", data: res?.data || [] };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while fetching your orders", data: [] };
     }
}

// Get order by ID
export async function getOrderByIdAction(id: string) {
     try {
          const res = await orderServiceServer.getById?.(id);

          if (!res?.ok) {
               return { ok: false, message: res?.message || "Failed to fetch order", data: null };
          }

          return { ok: true, message: res?.message || "Order fetched successfully", data: res?.data || null };
     } catch (err: any) {
          return { ok: false, message: err?.message || "Something went wrong while fetching order", data: null };
     }
}