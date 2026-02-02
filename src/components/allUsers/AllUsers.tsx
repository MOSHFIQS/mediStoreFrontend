"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { updateUserStatusAction } from "@/actions/admin.action";

interface User {
     id: string;
     name: string;
     email: string;
     role: string;
     status: string;
     createdAt: string;
}

interface Props {
     initialUsers: User[];
}

export default function AllUsersClient({ initialUsers }: Props) {
     const [users, setUsers] = useState<User[]>(initialUsers);
     const [updatingId, setUpdatingId] = useState<string | null>(null);

     const handleStatusChange = async (id: string, status: string) => {
          setUpdatingId(id);
          const res = await updateUserStatusAction(id, status);
          if (res.ok) {
               setUsers((prev) =>
                    prev.map((user) => (user.id === id ? { ...user, status } : user))
               );
               toast.success(res.message);
          } else {
               toast.error(res.message);
          }
          setUpdatingId(null);
     };

     if (!users.length) return <p className="p-6 text-center">No users found</p>;

     return (
          <div className="p-6">
               <Card>
                    <CardHeader>
                         <CardTitle>All Users</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <Table>
                              <TableHeader>
                                   <TableRow>
                                        {["#", "Name", "Email", "Role", "Status", "Created At"].map(
                                             (head) => (
                                                  <TableHead key={head}>{head}</TableHead>
                                             )
                                        )}
                                   </TableRow>
                              </TableHeader>
                              <TableBody>
                                   {users.map((user, index) => (
                                        <TableRow key={user.id}>
                                             <TableCell>{index + 1}</TableCell>
                                             <TableCell>{user.name}</TableCell>
                                             <TableCell>{user.email}</TableCell>
                                             <TableCell>{user.role}</TableCell>
                                             <TableCell>
                                                  <Select
                                                       value={user.status}
                                                       onValueChange={(value) => handleStatusChange(user.id, value)}
                                                       disabled={updatingId === user.id}
                                                  >
                                                       <SelectTrigger className="w-[130px]">
                                                            <SelectValue placeholder="Status" />
                                                       </SelectTrigger>

                                                       <SelectContent>
                                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                                            <SelectItem value="BANNED">Banned</SelectItem>
                                                       </SelectContent>
                                                  </Select>
                                             </TableCell>
                                             <TableCell>
                                                  {new Date(user.createdAt).toLocaleDateString()}
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
