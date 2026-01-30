"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
     Table,
     TableHeader,
     TableRow,
     TableHead,
     TableBody,
     TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { orderService } from "@/service/order.service";

interface Customer {
     id: string;
     name: string;
     phone: string | null;
}

interface OrderItem {
     id: string;
     medicineId: string;
     medicine: {
          id: string;
          name: string;
          price: number;
     };
     orderId: string;
     price: number;
     quantity: number;
}

export interface SellerOrder {
     id: string;
     customerId: string;
     customer: Customer;
     address: string;
     items: OrderItem[];
     status: string;
     totalPrice: number;
     createdAt: string;
     updatedAt: string;
}

export default function MyOrdersPage() {
     const queryClient = useQueryClient();
     const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

     const { data: orders = [], isLoading, error } = useQuery<SellerOrder[]>({
          queryKey: ["my-orders"],
          queryFn: async () => {
               const res = await orderService.getSellerOrders();
               if (!res.ok) throw new Error(res.message);
               return res.data.data;
          },
     });

     const updateStatusMutation = useMutation({
          mutationFn: ({ id, status }: { id: string; status: string }) =>
               orderService.updateStatus(id, status),

          onMutate: ({ id }) => {
               setUpdatingOrderId(id); // track updating row
          },

          onSettled: () => {
               setUpdatingOrderId(null);
               queryClient.invalidateQueries({ queryKey: ["my-orders"] });
          },
     });

     const handleStatusChange = (orderId: string, newStatus: string) => {
          updateStatusMutation.mutate({ id: orderId, status: newStatus });
     };

     if (isLoading) return <p className="p-6">Loading orders...</p>;
     if (error) return <p className="p-6 text-red-600">Failed to load orders</p>;
     if (!orders.length) return <p className="p-6">No orders found</p>;

     return (
          <div className="p-6">
               <h1 className="text-2xl font-bold mb-4">Seller Orders</h1>

               <Card>
                    <CardHeader>
                         <CardTitle>Orders Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        {["Buyer", "Address", "Total Price", "Items", "Placed On", "Status"].map(
                                             (head) => (
                                                  <TableHead key={head} className="text-center">
                                                       {head}
                                                  </TableHead>
                                             )
                                        )}
                                   </TableRow>
                              </TableHeader>

                              <TableBody>
                                   {orders.map((order) => (
                                        <TableRow key={order.id}>
                                             <TableCell className="text-center">
                                                  {order.customer.name}
                                             </TableCell>

                                             <TableCell className="text-center">
                                                  {order.address}
                                             </TableCell>

                                             <TableCell className="text-center">
                                                  {order.totalPrice} tk
                                             </TableCell>

                                             <TableCell className="text-center">
                                                  {order.items.map((item) => (
                                                       <div key={item.id}>
                                                            {item.medicine.name} × {item.quantity} (
                                                            {item.price * item.quantity} tk)
                                                       </div>
                                                  ))}
                                             </TableCell>

                                             <TableCell className="text-center">
                                                  {new Date(order.createdAt).toLocaleString()}
                                             </TableCell>

                                             <TableCell className="text-center">
                                                  {updatingOrderId === order.id ? (
                                                       <span className="text-sm text-gray-500 animate-pulse">
                                                            Updating...
                                                       </span>
                                                  ) : (
                                                       <select
                                                            value={order.status}
                                                            onChange={(e) =>
                                                                 handleStatusChange(order.id, e.target.value)
                                                            }
                                                            className="border rounded px-2 py-1"
                                                       >
                                                            <option value="PENDING">Pending</option>
                                                            <option value="PROCESSING">Processing</option>
                                                            <option value="SHIPPED">Shipped</option>
                                                            <option value="DELIVERED">Delivered</option>
                                                            <option value="CANCELLED">Cancelled</option>
                                                       </select>
                                                  )}
                                             </TableCell>
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>
          </div>
     );
}
