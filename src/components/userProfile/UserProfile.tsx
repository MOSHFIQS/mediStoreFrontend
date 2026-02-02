"use client";

import { useState } from "react";
import {
     Card,
     CardContent,
     CardHeader,
     CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
     Dialog,
     DialogContent,
     DialogHeader,
     DialogTitle,
     DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { updateProfileAction } from "@/actions/user.action";

interface User {
     id: string;
     name: string;
     email: string;
     phone?: string;
     image?: string;
     role: string;
     status: string;
     createdAt: string;
     updatedAt: string;
}


interface Props {
     initialUser: User;
}

const formatDate = (date: string) =>
     new Date(date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
     });



export default function UserProfile({ initialUser }: Props) {
     const [user, setUser] = useState(initialUser);
     const [form, setForm] = useState(initialUser);
     const [loading, setLoading] = useState(false);
     const [open, setOpen] = useState(false);
     const [selectedFile, setSelectedFile] = useState<File | null>(null);


     // 🔹 Simple handler
     const handleChange = (key: keyof User, value: string) => {
          setForm({ ...form, [key]: value });
     };

     // 🔹 When dialog opens → sync form with latest user
     const handleDialogChange = (state: boolean) => {
          setOpen(state);
          if (state) setForm(user);
     };

     const handleSubmit = async () => {
          setLoading(true);

          const formData = new FormData();
          formData.append("name", form.name);
          formData.append("phone", form.phone || "");

          if (selectedFile) {
               formData.append("image", selectedFile);
          }

          const res = await updateProfileAction(formData);

          if (res.ok) {
               toast.success(res.message);
               setUser({ ...user, ...form }); // update UI
               setOpen(false);
          } else {
               toast.error(res.message);
          }

          setLoading(false);
     };


     return (
          <div className=" p-6 space-y-6">
               <Card className="max-w-5xl mx-auto">
                    <CardHeader className="flex justify-between items-center">
                         <CardTitle>My Profile</CardTitle>

                         <Dialog open={open} onOpenChange={handleDialogChange}>
                              <DialogTrigger asChild>
                                   <Button>Edit Profile</Button>
                              </DialogTrigger>

                              <DialogContent>
                                   <DialogHeader>
                                        <DialogTitle>Edit Profile</DialogTitle>
                                   </DialogHeader>

                                   <div className="space-y-4 mt-4">
                                        <div>
                                             <Label>Name</Label>
                                             <Input
                                                  value={form.name}
                                                  onChange={(e) =>
                                                       handleChange("name", e.target.value)
                                                  }
                                             />
                                        </div>

                                        <div>
                                             <Label>Email</Label>
                                             <Input value={user.email} disabled />
                                        </div>

                                        <div>
                                             <Label>Phone</Label>
                                             <Input
                                                  value={form.phone || ""}
                                                  onChange={(e) =>
                                                       handleChange("phone", e.target.value)
                                                  }
                                             />
                                        </div>

                                        <div>
                                             <Label>Profile Image</Label>
                                             <Input
                                                  type="file"
                                                  accept="image/*"
                                                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                             />
                                        </div>


                                        <Button
                                             onClick={handleSubmit}
                                             disabled={loading}
                                             className="w-full"
                                        >
                                             {loading ? "Saving..." : "Save Changes"}
                                        </Button>
                                   </div>
                              </DialogContent>
                         </Dialog>
                    </CardHeader>

                    <CardContent className="space-y-6 ">

                         <div className="flex items-center gap-4">
                              <img
                                   src={user.image || "/avatar.png"}
                                   alt="Profile"
                                   className="w-24 h-24 rounded-full object-cover border"
                              />
                              <div>
                                   <h2 className="text-xl font-semibold">{user.name}</h2>
                                   <p className="text-sm text-muted-foreground">{user.email}</p>
                                   <span className="text-xs bg-muted px-2 py-1 rounded">
                                        {user.role}
                                   </span>
                              </div>
                         </div>

                         {/* Info Grid */}
                         <div className="grid grid-cols-2 gap-4 text-sm">

                              <div>
                                   <p className="text-muted-foreground">Phone</p>
                                   <p className="font-medium">{user.phone || "Not provided"}</p>
                              </div>

                              <div>
                                   <p className="text-muted-foreground">Account Status</p>
                                   <p className="font-medium">{user.status}</p>
                              </div>

                              {/* <div>
                                   <p className="text-muted-foreground">User ID</p>
                                   <p className="font-medium break-all">{user.id}</p>
                              </div> */}

                              <div>
                                   <p className="text-muted-foreground">Joined</p>
                                   <p className="font-medium">{formatDate(user.createdAt)}</p>
                              </div>

                              <div>
                                   <p className="text-muted-foreground">Last Updated</p>
                                   <p className="font-medium">{formatDate(user.updatedAt)}</p>
                              </div>

                         </div>
                    </CardContent>

               </Card>
          </div>
     );
}
