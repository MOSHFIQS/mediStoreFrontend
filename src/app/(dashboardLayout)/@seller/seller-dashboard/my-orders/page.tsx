"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
     Table,
     TableHeader,
     TableRow,
     TableHead,
     TableBody,
     TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { orderService } from "@/service/order.service";

interface SellerOrderItem {
     id: string;
     quantity: number;
     price: number;
     medicine: {
          name: string;
     };
}

interface SellerOrder {
     id: string;
     buyer: string;
     address: string;
     totalPrice: number;
     status: string;
     createdAt: string;
     items: SellerOrderItem[];
}

// const fetchSellerOrders = async (): Promise<SellerOrder[]> => {
//      const res = await apiFetch("/orders/seller");
//      if (!res.ok) throw new Error(res.message);
//      return res.data.data;
// };

const statusColor = (status: string) => {
     switch (status) {
          case "CANCELLED":
               return "red";
          case "DELIVERED":
               return "green";
          case "PROCESSING":
               return "yellow";
          default:
               return "blue";
     }
};

export default function MyOrdersPage() {
     const { data: orders = [], isLoading,error } = useQuery<SellerOrder[]>({
               queryKey: ["my-orders"],
               queryFn: async () => {
                    const res = await orderService.getSellerOrders();
                    if (!res.ok) throw new Error(res.message);
                    return res.data.data;
               },
          });
          console.log(orders);

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
                                        <TableHead>ID</TableHead>
                                        <TableHead>Buyer</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Total Price</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Items</TableHead>
                                        <TableHead>Placed On</TableHead>
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {orders.map((order) => (
                                        <TableRow key={order.id}>
                                             <TableCell>{order.id}</TableCell>
                                             <TableCell>{order.buyer}</TableCell>
                                             <TableCell>{order.address}</TableCell>
                                             <TableCell>{order.totalPrice} tk</TableCell>
                                             <TableCell>
                                                  <Badge variant="outline" className={`bg-${statusColor(order.status)}-100 text-${statusColor(order.status)}-700`}>
                                                       {order.status}
                                                  </Badge>
                                             </TableCell>
                                             <TableCell>
                                                  <ul className="list-disc list-inside">
                                                       {order.items.map((item) => (
                                                            <li key={item.id}>
                                                                 {item.medicine.name} × {item.quantity} ({item.price * item.quantity} tk)
                                                            </li>
                                                       ))}
                                                  </ul>
                                             </TableCell>
                                             <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                                        </TableRow>
                                   ))}
                              </TableBody>
                         </Table>
                    </CardContent>
               </Card>
          </div>
     );
}
