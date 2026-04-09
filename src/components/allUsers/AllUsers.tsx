"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import { updateUserStatusAction, deleteUserAction } from "@/actions/admin.action";
import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
     Table,
     TableBody,
     TableCell,
     TableHead,
     TableHeader,
     TableRow,
} from "@/components/ui/table";
import {
     Search,
     Trash2,
     ShieldCheck,
     Shield,
     Users,
     UserCheck,
     Store,
     ChevronUp,
     ChevronDown,
     ChevronsUpDown,
     Phone,
     Calendar,
     AlertTriangle,
     X,
} from "lucide-react";
import Image from "next/image";
import { AppImage } from "../shared/image/AppImage";

interface User {
     id: string;
     name: string;
     email: string;
     role: string;
     status: string;
     phone?: string;
     image?: string;
     isEmailVerified: boolean;
     lastLoginAt?: string;
     createdAt: string;
}

interface Props {
     initialUsers: User[];
}

/* ── helpers ─────────────────────────────────────────────── */
const ROLE_CONFIG: Record<
     string,
     { label: string; icon: React.ReactNode; color: string }
> = {
     ADMIN: {
          label: "Admin",
          icon: <Shield className="w-3 h-3" />,
          color: "bg-purple-100 text-purple-700",
     },
     SELLER: {
          label: "Seller",
          icon: <Store className="w-3 h-3" />,
          color: "bg-blue-100 text-blue-700",
     },
     CUSTOMER: {
          label: "Customer",
          icon: <UserCheck className="w-3 h-3" />,
          color: "bg-gray-100 text-gray-600",
     },
};

const STATUS_CONFIG: Record<
     string,
     { dot: string; text: string; label: string }
> = {
     ACTIVE: {
          dot: "bg-emerald-400",
          text: "text-emerald-700",
          label: "Active",
     },
     BANNED: { dot: "bg-red-400", text: "text-red-600", label: "Banned" },
     SUSPENDED: {
          dot: "bg-amber-400",
          text: "text-amber-700",
          label: "Suspended",
     },
};

function Avatar({ user }: { user: User }) {
     if (user.image) {
          return (
               <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-sm">
                    <AppImage src={user.image} alt={user.name} width={32} height={32} className="object-cover" />
               </div>
          );
     }
     return (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
               {user.name.charAt(0).toUpperCase()}
          </div>
     );
}

type SortKey = "name" | "role" | "status" | "createdAt";
type SortDir = "asc" | "desc";

/* ── Delete confirm modal ─────────────────────────────────── */
function DeleteModal({
     user,
     onConfirm,
     onCancel,
     loading,
}: {
     user: User;
     onConfirm: () => void;
     onCancel: () => void;
     loading: boolean;
}) {
     return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
               <div
                    className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    onClick={onCancel}
               />
               <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
                    <div className="flex items-start gap-3">
                         <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              <AlertTriangle className="w-5 h-5 text-red-500" />
                         </div>
                         <div>
                              <p className="font-semibold text-gray-900">Delete user?</p>
                              <p className="text-sm text-gray-500 mt-0.5">
                                   <span className="font-medium text-gray-700">{user.name}</span> (
                                   {user.email}) will be permanently removed. This cannot be undone.
                              </p>
                         </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                         <Button
                              variant="outline"
                              className="flex-1 rounded-xl"
                              onClick={onCancel}
                              disabled={loading}
                         >
                              Cancel
                         </Button>
                         <Button
                              className="flex-1 rounded-xl bg-red-500 hover:bg-red-600 text-white"
                              onClick={onConfirm}
                              disabled={loading}
                         >
                              {loading ? (
                                   <span className="flex items-center gap-2">
                                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Deleting…
                                   </span>
                              ) : (
                                   <span className="flex items-center gap-2">
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                   </span>
                              )}
                         </Button>
                    </div>
               </div>
          </div>
     );
}

/* ── Main component ──────────────────────────────────────── */
export default function AllUsersClient({ initialUsers }: Props) {
     const [users, setUsers] = useState<User[]>(initialUsers);
     const [updatingId, setUpdatingId] = useState<string | null>(null);
     const [deletingUser, setDeletingUser] = useState<User | null>(null);
     const [deleteLoading, setDeleteLoading] = useState(false);

     // Filters
     const [search, setSearch] = useState("");
     const [roleFilter, setRoleFilter] = useState("ALL");
     const [statusFilter, setStatusFilter] = useState("ALL");

     // Sort
     const [sortKey, setSortKey] = useState<SortKey>("createdAt");
     const [sortDir, setSortDir] = useState<SortDir>("desc");

     /* ── handlers ── */
     const handleStatusChange = async (id: string, newStatus: string) => {
          setUpdatingId(id);
          const res = await updateUserStatusAction(id, newStatus);
          if (res.ok) {
               setUsers((prev) =>
                    prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
               );
               toast.success(res.message);
          } else {
               toast.error(res.message);
          }
          setUpdatingId(null);
     };

     const handleDeleteConfirm = async () => {
          if (!deletingUser) return;
          setDeleteLoading(true);
          const res = await deleteUserAction(deletingUser.id);
          if (res.ok) {
               setUsers((prev) => prev.filter((u) => u.id !== deletingUser.id));
               toast.success(res.message);
          } else {
               toast.error(res.message);
          }
          setDeleteLoading(false);
          setDeletingUser(null);
     };

     const toggleSort = (key: SortKey) => {
          if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
          else {
               setSortKey(key);
               setSortDir("asc");
          }
     };

     /* ── derived data ── */
     const filtered = useMemo(() => {
          let list = [...users];

          if (search.trim()) {
               const q = search.toLowerCase();
               list = list.filter(
                    (u) =>
                         u.name.toLowerCase().includes(q) ||
                         u.email.toLowerCase().includes(q) ||
                         u.phone?.includes(q)
               );
          }
          if (roleFilter !== "ALL") list = list.filter((u) => u.role === roleFilter);
          if (statusFilter !== "ALL")
               list = list.filter((u) => u.status === statusFilter);

          list.sort((a, b) => {
               let av: string = (a[sortKey] ?? "") as string;
               let bv: string = (b[sortKey] ?? "") as string;
               av = av.toLowerCase();
               bv = bv.toLowerCase();
               if (av < bv) return sortDir === "asc" ? -1 : 1;
               if (av > bv) return sortDir === "asc" ? 1 : -1;
               return 0;
          });

          return list;
     }, [users, search, roleFilter, statusFilter, sortKey, sortDir]);

     const SortIcon = ({ k }: { k: SortKey }) => {
          if (sortKey !== k)
               return <ChevronsUpDown className="w-3 h-3 opacity-40 inline ml-1" />;
          return sortDir === "asc" ? (
               <ChevronUp className="w-3 h-3 text-purple-600 inline ml-1" />
          ) : (
               <ChevronDown className="w-3 h-3 text-purple-600 inline ml-1" />
          );
     };

     /* ── stats bar ── */
     const total = users.length;
     const active = users.filter((u) => u.status === "ACTIVE").length;
     const banned = users.filter((u) => u.status === "BANNED").length;
     const sellers = users.filter((u) => u.role === "SELLER").length;

     return (
          <>
               {deletingUser && (
                    <DeleteModal
                         user={deletingUser}
                         onConfirm={handleDeleteConfirm}
                         onCancel={() => setDeletingUser(null)}
                         loading={deleteLoading}
                    />
               )}

               <div className="p-6 space-y-5">
                    {/* ── Page header ── */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                         <div>
                              <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                   <Users className="w-5 h-5 text-purple-500" /> User Management
                              </h1>
                              <p className="text-sm text-gray-500 mt-0.5">
                                   Manage accounts, roles, and access control
                              </p>
                         </div>
                    </div>

                    {/* ── Stats row ── */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                         {[
                              {
                                   label: "Total Users",
                                   value: total,
                                   color: "bg-purple-50 text-purple-700",
                                   dot: "bg-purple-400",
                              },
                              {
                                   label: "Active",
                                   value: active,
                                   color: "bg-emerald-50 text-emerald-700",
                                   dot: "bg-emerald-400",
                              },
                              {
                                   label: "Banned",
                                   value: banned,
                                   color: "bg-red-50 text-red-600",
                                   dot: "bg-red-400",
                              },
                              {
                                   label: "Sellers",
                                   value: sellers,
                                   color: "bg-blue-50 text-blue-700",
                                   dot: "bg-blue-400",
                              },
                         ].map((s) => (
                              <div
                                   key={s.label}
                                   className={`rounded-xl px-4 py-3 flex items-center gap-3 ${s.color}`}
                              >
                                   <span
                                        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dot}`}
                                   />
                                   <div>
                                        <p className="text-xl font-bold leading-none">{s.value}</p>
                                        <p className="text-xs mt-0.5 opacity-70">{s.label}</p>
                                   </div>
                              </div>
                         ))}
                    </div>

                    {/* ── Filters ── */}
                    <div className="flex flex-wrap gap-2 items-center">
                         <div className="relative flex-1 min-w-[200px] max-w-xs">
                              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <Input
                                   placeholder="Search name, email, phone…"
                                   value={search}
                                   onChange={(e) => setSearch(e.target.value)}
                                   className="pl-9 h-9 text-sm rounded-xl"
                              />
                              {search && (
                                   <button
                                        onClick={() => setSearch("")}
                                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                   >
                                        <X className="w-3.5 h-3.5" />
                                   </button>
                              )}
                         </div>

                         <Select value={roleFilter} onValueChange={setRoleFilter}>
                              <SelectTrigger className="w-36 h-9 text-sm rounded-xl">
                                   <SelectValue placeholder="All roles" />
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="ALL">All roles</SelectItem>
                                   <SelectItem value="CUSTOMER">Customer</SelectItem>
                                   <SelectItem value="SELLER">Seller</SelectItem>
                                   <SelectItem value="ADMIN">Admin</SelectItem>
                              </SelectContent>
                         </Select>

                         <Select value={statusFilter} onValueChange={setStatusFilter}>
                              <SelectTrigger className="w-36 h-9 text-sm rounded-xl">
                                   <SelectValue placeholder="All statuses" />
                              </SelectTrigger>
                              <SelectContent>
                                   <SelectItem value="ALL">All statuses</SelectItem>
                                   <SelectItem value="ACTIVE">Active</SelectItem>
                                   <SelectItem value="BANNED">Banned</SelectItem>
                                   <SelectItem value="SUSPENDED">Suspended</SelectItem>
                              </SelectContent>
                         </Select>

                         {(search || roleFilter !== "ALL" || statusFilter !== "ALL") && (
                              <button
                                   onClick={() => {
                                        setSearch("");
                                        setRoleFilter("ALL");
                                        setStatusFilter("ALL");
                                   }}
                                   className="text-xs text-purple-600 hover:text-purple-800 font-medium flex items-center gap-1"
                              >
                                   <X className="w-3 h-3" /> Clear filters
                              </button>
                         )}

                         <span className="ml-auto text-xs text-gray-400">
                              {filtered.length} of {total} users
                         </span>
                    </div>

                    {/* ── Table ── */}
                    <div className="bg-white rounded border border-gray-100 shadow-sm overflow-hidden">
                         {filtered.length === 0 ? (
                              <div className="text-center py-16 text-gray-400">
                                   <Users className="w-10 h-10 mx-auto opacity-20 mb-3" />
                                   <p className="font-medium">No users found</p>
                                   <p className="text-xs mt-1">
                                        Try adjusting your search or filters
                                   </p>
                              </div>
                         ) : (
                              <div className="overflow-x-auto">
                                   <Table>
                                        <TableHeader>
                                             <TableRow className="bg-gray-50 hover:bg-gray-50 border-b border-gray-100 ">
                                                  <TableHead className="w-10 text-xs font-semibold text-gray-500 uppercase tracking-wider pl-10">
                                                       #
                                                  </TableHead>
                                                  <TableHead
                                                       className="text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none whitespace-nowrap"
                                                       onClick={() => toggleSort("name")}
                                                  >
                                                       User <SortIcon k="name" />
                                                  </TableHead>
                                                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                       Contact
                                                  </TableHead>
                                                  <TableHead
                                                       className="text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none whitespace-nowrap"
                                                       onClick={() => toggleSort("role")}
                                                  >
                                                       Role <SortIcon k="role" />
                                                  </TableHead>
                                                  <TableHead
                                                       className="text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none whitespace-nowrap"
                                                       onClick={() => toggleSort("status")}
                                                  >
                                                       Status <SortIcon k="status" />
                                                  </TableHead>
                                                  <TableHead
                                                       className="text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-800 select-none whitespace-nowrap"
                                                       onClick={() => toggleSort("createdAt")}
                                                  >
                                                       Joined <SortIcon k="createdAt" />
                                                  </TableHead>
                                                  <TableHead className="text-xs font-semibold text-gray-500 uppercase tracking-wider text-right pr-10">
                                                       Actions
                                                  </TableHead>
                                             </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                             {filtered.map((user, index) => {
                                                  const roleCfg =
                                                       ROLE_CONFIG[user.role] ?? ROLE_CONFIG.CUSTOMER;
                                                  const statusCfg =
                                                       STATUS_CONFIG[user.status] ?? STATUS_CONFIG.ACTIVE;
                                                  const isUpdating = updatingId === user.id;

                                                  return (
                                                       <TableRow
                                                            key={user.id}
                                                            className="hover:bg-gray-50/60 transition-colors group border-b border-gray-50 last:border-0"
                                                       >
                                                            {/* # */}
                                                            <TableCell className="text-xs text-gray-400 font-mono pl-10">
                                                                 {index + 1}
                                                            </TableCell>

                                                            {/* User */}
                                                            <TableCell>
                                                                 <div className="flex items-center gap-2.5">
                                                                      <Avatar user={user} />
                                                                      <div className="min-w-0">
                                                                           <p className="text-sm font-semibold text-gray-800 truncate max-w-[140px]">
                                                                                {user.name}
                                                                           </p>
                                                                           <p className="text-xs text-gray-400 truncate max-w-[140px]">
                                                                                {user.email}
                                                                           </p>
                                                                      </div>
                                                                      {user.isEmailVerified && (
                                                                           <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                                                                      )}
                                                                 </div>
                                                            </TableCell>

                                                            {/* Contact */}
                                                            <TableCell>
                                                                 {user.phone ? (
                                                                      <span className="flex items-center gap-1 text-xs text-gray-500">
                                                                           <Phone className="w-3 h-3" /> {user.phone}
                                                                      </span>
                                                                 ) : (
                                                                      <span className="text-xs text-gray-300">—</span>
                                                                 )}
                                                            </TableCell>

                                                            {/* Role */}
                                                            <TableCell>
                                                                 <span
                                                                      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${roleCfg.color}`}
                                                                 >
                                                                      {roleCfg.icon} {roleCfg.label}
                                                                 </span>
                                                            </TableCell>

                                                            {/* Status */}
                                                            <TableCell>
                                                                 <Select
                                                                      value={user.status}
                                                                      onValueChange={(v) =>
                                                                           handleStatusChange(user.id, v)
                                                                      }
                                                                      disabled={isUpdating}
                                                                 >
                                                                      <SelectTrigger
                                                                           className={`w-32 h-7 text-xs rounded-full border px-2.5 font-semibold
                                ${statusCfg.text} bg-white focus:ring-1 focus:ring-purple-300
                                ${isUpdating ? "opacity-50" : ""}`}
                                                                      >
                                                                           <span className="flex items-center gap-1.5">
                                                                                <span
                                                                                     className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`}
                                                                                />
                                                                                <SelectValue />
                                                                           </span>
                                                                      </SelectTrigger>
                                                                      <SelectContent>
                                                                           <SelectItem value="ACTIVE">Active</SelectItem>
                                                                           <SelectItem value="BANNED">Banned</SelectItem>
                                                                           <SelectItem value="SUSPENDED">
                                                                                Suspended
                                                                           </SelectItem>
                                                                      </SelectContent>
                                                                 </Select>
                                                            </TableCell>

                                                            {/* Joined */}
                                                            <TableCell>
                                                                 <span className="flex items-center gap-1 text-xs text-gray-500">
                                                                      <Calendar className="w-3 h-3" />
                                                                      {new Date(user.createdAt).toLocaleDateString(
                                                                           "en-GB",
                                                                           {
                                                                                day: "numeric",
                                                                                month: "short",
                                                                                year: "numeric",
                                                                           }
                                                                      )}
                                                                 </span>
                                                            </TableCell>

                                                            {/* Actions */}
                                                            <TableCell className="text-right pr-10">
                                                                 <Button
                                                                      onClick={() => setDeletingUser(user)}
                                                                      className="rounded-full"
                                                                      title="Delete user"
                                                                 >
                                                                      <Trash2 className="w-3.5 h-3.5" />
                                                                      <span>Delete</span>
                                                                 </Button>
                                                            </TableCell>
                                                       </TableRow>
                                                  );
                                             })}
                                        </TableBody>
                                   </Table>
                              </div>
                         )}
                    </div>
               </div>
          </>
     );
}