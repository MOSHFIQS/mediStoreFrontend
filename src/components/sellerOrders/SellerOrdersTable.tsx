"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
     Table,
     TableHeader,
     TableRow,
     TableHead,
     TableBody,
     TableCell,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { updateOrderStatusAction } from "@/actions/order.action";

interface Customer {
     id: string;
     name: string;
     phone: string | null;
}

interface OrderItem {
     id: string;
     medicine: {
          name: string;
     };
     price: number;
     quantity: number;
}

export interface SellerOrder {
     id: string;
     customer: Customer;
     address: string;
     items: OrderItem[];
     status: string;
     totalPrice: number;
     createdAt: string;
}

export default function SellerOrdersTable({ orders }: { orders: SellerOrder[] }) {
     const [pendingId, setPendingId] = useState<string | null>(null);
     const [isPending, startTransition] = useTransition();

     const handleStatusChange = (id: string, status: string) => {
          setPendingId(id);

          startTransition(async () => {
               const res = await updateOrderStatusAction(id, status);

               if (res.success) toast.success("Order updated");
               else toast.error(res.message);

               setPendingId(null);
          });
     };

     return (
          <Card>
               <CardHeader>
                    <CardTitle>Seller Orders</CardTitle>
               </CardHeader>

               <CardContent>
                    <Table>
                         <TableHeader>
                              <TableRow>
                                   {["Buyer", "Phone", "Address", "Total", "Items", "Placed On", "Status"].map(
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
                                             {order.customer.phone ?? "N/A"}
                                        </TableCell>

                                        <TableCell className="text-center">{order.address}</TableCell>

                                        <TableCell className="text-center font-semibold">
                                             {order.totalPrice} tk
                                        </TableCell>

                                        <TableCell className="text-center space-y-1">
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

                                        {
                                             order.status === "CANCELLED" ?
                                                  <TableCell className="text-center">
                                                       CANCELLED
                                                  </TableCell>
                                                  :
                                                  <TableCell className="text-center">
                                                       {pendingId === order.id ? (
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

                                        }
                                   </TableRow>
                              ))}
                         </TableBody>
                    </Table>
               </CardContent>
          </Card>
     );
}
