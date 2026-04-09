"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
     Dialog, DialogContent, DialogHeader,
     DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateProfileAction } from "@/actions/user.action";
import { useImageUpload } from "@/hooks/useImageUpload";
import ImageUploader from "../shared/image/ImageUploader";
import {
     User, Mail, Phone, Shield, Clock,
     CheckCircle2, XCircle, Pencil, Calendar,
     BadgeCheck, LogIn
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface UserData {
     id: string;
     name: string;
     email: string;
     phone?: string;
     image?: string;
     role: string;
     status: string;
     createdAt: string;
     updatedAt: string;
     lastLoginAt?: string | null;
     emailVerifiedAt?: string | null;
}

const ROLE_CONFIG: Record<string, { className: string; icon: React.ReactNode }> = {
     ADMIN: { className: "bg-red-50 text-red-700 border border-red-200", icon: <Shield className="w-3 h-3" /> },
     SELLER: { className: "bg-blue-50 text-blue-700 border border-blue-200", icon: <BadgeCheck className="w-3 h-3" /> },
     CUSTOMER: { className: "bg-purple-50 text-purple-700 border border-purple-200", icon: <User className="w-3 h-3" /> },
};

const STATUS_CONFIG: Record<string, { className: string; icon: React.ReactNode }> = {
     ACTIVE: { className: "bg-green-50 text-green-700 border border-green-200", icon: <CheckCircle2 className="w-3 h-3" /> },
     BANNED: { className: "bg-red-50 text-red-600 border border-red-200", icon: <XCircle className="w-3 h-3" /> },
     SUSPENDED: { className: "bg-yellow-50 text-yellow-700 border border-yellow-200", icon: <Clock className="w-3 h-3" /> },
};

const fmt = (date?: string | null) =>
     date
          ? new Date(date).toLocaleDateString("en-GB", {
               day: "2-digit", month: "short", year: "numeric",
          })
          : "—";

const fmtTime = (date?: string | null) =>
     date
          ? new Date(date).toLocaleString("en-GB", {
               day: "2-digit", month: "short", year: "numeric",
               hour: "2-digit", minute: "2-digit",
          })
          : "—";

function InfoRow({
     icon, label, value, valueClass,
}: {
     icon: React.ReactNode;
     label: string;
     value: React.ReactNode;
     valueClass?: string;
}) {
     return (
          <div className="flex items-center justify-between py-3">
               <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    {icon}
                    {label}
               </div>
               <div className={cn("text-sm font-medium text-right", valueClass)}>
                    {value}
               </div>
          </div>
     );
}

export default function UserProfile({ initialUser }: { initialUser: UserData }) {
     const [user, setUser] = useState(initialUser);
     const [form, setForm] = useState(initialUser);
     const [loading, setLoading] = useState(false);
     const [open, setOpen] = useState(false);

     const userImage = useImageUpload({
          max: 1,
          defaultImages: initialUser?.image ? [initialUser.image] : [],
     });

     const handleDialogChange = (state: boolean) => {
          if (!state) {
               // Dialog closing without save — discard any removed images, restore queue
               userImage.discardDeletes();
          }
          setOpen(state);
          if (state) setForm(user);
     };

     const handleSubmit = async () => {
          if (!form.name.trim()) { toast.error("Name is required"); return; }
          setLoading(true);
          const res = await updateProfileAction({
               name: form.name,
               phone: form.phone as string,
               image: userImage.images[0]?.img ?? null,
          });
          if (res.ok) {
               // ✅ DB saved — now safe to delete removed image from Cloudinary
               await userImage.commitDeletes();
               toast.success(res.message || "Profile updated");
               setUser({ ...user, ...form, image: userImage.images[0]?.img ?? user.image });
               setOpen(false);
          } else {
               toast.error(res.message || "Update failed");
          }
          setLoading(false);
     };

     const roleCfg = ROLE_CONFIG[user.role] ?? ROLE_CONFIG["CUSTOMER"];
     const statusCfg = STATUS_CONFIG[user.status] ?? STATUS_CONFIG["ACTIVE"];

     return (
          <div className="max-w-3xl mx-auto w-full px-4 py-8 space-y-6">

               {/* ── Hero card ── */}
               <Card className="overflow-hidden pt-0">
                    {/* Purple banner */}
                    <div className="h-24 bg-gradient-to-r from-purple-500 to-violet-600" />

                    <CardContent className="px-6 pb-6">
                         {/* Avatar row */}
                         <div className="flex items-end justify-between -mt-12 mb-4">
                              <div className="relative">
                                   <div className="w-24 h-24 rounded-2xl border-4 border-background overflow-hidden bg-gray-100 shadow-md">
                                        <Image
                                             src={user.image || "/avatar.png"}
                                             alt={user.name}
                                             width={96} height={96}
                                             className="object-cover w-full h-full"
                                        />
                                   </div>
                                   {/* Online dot */}
                                   <span className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-background" />
                              </div>

                              {/* Edit button */}
                              <Dialog open={open} onOpenChange={handleDialogChange}>
                                   <DialogTrigger asChild>
                                        <Button variant="outline" className="rounded-full gap-1.5 mb-1">
                                             <Pencil className="w-3.5 h-3.5" /> Edit Profile
                                        </Button>
                                   </DialogTrigger>

                                   <DialogContent className="max-w-md">
                                        <DialogHeader>
                                             <DialogTitle className="flex items-center gap-2">
                                                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                                                       <Pencil className="w-4 h-4 text-purple-600" />
                                                  </div>
                                                  Edit Profile
                                             </DialogTitle>
                                        </DialogHeader>

                                        <div className="space-y-4 mt-2">
                                             <div className="space-y-1.5">
                                                  <Label>Full Name <span className="text-red-400">*</span></Label>
                                                  <Input
                                                       value={form.name}
                                                       onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                       placeholder="Your full name"
                                                  />
                                             </div>

                                             <div className="space-y-1.5">
                                                  <Label>Email</Label>
                                                  <Input
                                                       value={user.email} disabled
                                                       className="bg-muted text-muted-foreground cursor-not-allowed"
                                                  />
                                                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                                             </div>

                                             <div className="space-y-1.5">
                                                  <Label>Phone</Label>
                                                  <Input
                                                       value={form.phone || ""}
                                                       onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                       placeholder="+880 1X XX XXX XXX"
                                                  />
                                             </div>

                                             <ImageUploader
                                                  label="Profile Photo"
                                                  images={userImage.images}
                                                  onUpload={userImage.upload}
                                                  onDelete={userImage.remove}
                                                  multiple={false}
                                             />

                                             <div className="flex gap-2 pt-1">
                                                  <Button
                                                       variant="outline" className="flex-1 rounded-full"
                                                       onClick={() => setOpen(false)}
                                                  >
                                                       Cancel
                                                  </Button>
                                                  <Button
                                                       onClick={handleSubmit}
                                                       disabled={loading}
                                                       className="flex-1 rounded-full bg-purple-600 hover:bg-purple-700"
                                                  >
                                                       {loading ? "Saving..." : "Save Changes"}
                                                  </Button>
                                             </div>
                                        </div>
                                   </DialogContent>
                              </Dialog>
                         </div>

                         {/* Name + badges */}
                         <div className="space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                   <h2 className="text-xl font-bold">{user.name}</h2>
                                   {user.emailVerifiedAt && (
                                        <span title="Email verified">
                                             <BadgeCheck className="w-5 h-5 text-blue-500" />
                                        </span>
                                   )}
                              </div>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                              <div className="flex items-center gap-2 flex-wrap pt-1">
                                   <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full", roleCfg.className)}>
                                        {roleCfg.icon} {user.role}
                                   </span>
                                   <span className={cn("inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full", statusCfg.className)}>
                                        {statusCfg.icon} {user.status}
                                   </span>
                              </div>
                         </div>
                    </CardContent>
               </Card>

               {/* ── Info card ── */}
               <Card>
                    <CardContent className="px-6 py-2 divide-y">

                         <InfoRow
                              icon={<Mail className="w-4 h-4" />}
                              label="Email address"
                              value={user.email}
                         />

                         <InfoRow
                              icon={<Phone className="w-4 h-4" />}
                              label="Phone number"
                              value={user.phone || <span className="text-muted-foreground font-normal italic text-xs">Not provided</span>}
                         />

                         <InfoRow
                              icon={<BadgeCheck className="w-4 h-4" />}
                              label="Email verified"
                              value={
                                   user.emailVerifiedAt ? (
                                        <span className="inline-flex items-center gap-1 text-green-700 text-xs font-semibold bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                                             <CheckCircle2 className="w-3 h-3" /> Verified
                                        </span>
                                   ) : (
                                        <span className="inline-flex items-center gap-1 text-red-600 text-xs font-semibold bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                                             <XCircle className="w-3 h-3" /> Not verified
                                        </span>
                                   )
                              }
                         />

                         <InfoRow
                              icon={<Calendar className="w-4 h-4" />}
                              label="Member since"
                              value={fmt(user.createdAt)}
                         />

                         <InfoRow
                              icon={<LogIn className="w-4 h-4" />}
                              label="Last login"
                              value={fmtTime(user.lastLoginAt)}
                         />

                         <InfoRow
                              icon={<Clock className="w-4 h-4" />}
                              label="Last updated"
                              value={fmtTime(user.updatedAt)}
                         />

                    </CardContent>
               </Card>

               {/* ── Account ID card ── */}
               <Card>
                    <CardContent className="px-6 py-4">
                         <p className="text-xs text-muted-foreground mb-1">Account ID</p>
                         <p className="font-mono text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg break-all">
                              {user.id}
                         </p>
                    </CardContent>
               </Card>

          </div>
     );
}