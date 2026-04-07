"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAddressAction, deleteAddressAction, updateAddressAction } from "@/actions/address.action";
import { MapPin, Star, Trash2, Plus } from "lucide-react";

export default function AddressesClient({ initialAddresses }: { initialAddresses: any[] }) {
     const router = useRouter();
     const [showForm, setShowForm] = useState(false);
     const [loading, setLoading] = useState(false);
     const [form, setForm] = useState({
          label: "", line1: "", line2: "", city: "", district: "", postalCode: "", isDefault: false,
     });

     const handleSubmit = async (e: React.FormEvent) => {
          e.preventDefault();
          if (!form.line1 || !form.city || !form.district) return toast.error("Please fill required fields");
          setLoading(true);
          try {
               await createAddressAction(form);
               toast.success("Address added");
               setShowForm(false);
               setForm({ label: "", line1: "", line2: "", city: "", district: "", postalCode: "", isDefault: false });
               router.refresh();
          } catch (err: any) {
               toast.error(err.message);
          } finally {
               setLoading(false);
          }
     };

     const handleDelete = async (id: string) => {
          try {
               await deleteAddressAction(id);
               toast.success("Address removed");
               router.refresh();
          } catch (err: any) {
               toast.error(err.message);
          }
     };

     const handleSetDefault = async (id: string) => {
          try {
               await updateAddressAction(id, { isDefault: true });
               toast.success("Default address updated");
               router.refresh();
          } catch (err: any) {
               toast.error(err.message);
          }
     };

     return (
          <div className="max-w-2xl mx-auto p-4 space-y-4">
               <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">My Addresses</h1>
                    <Button onClick={() => setShowForm(!showForm)} variant="outline">
                         <Plus className="w-4 h-4 mr-1" /> Add Address
                    </Button>
               </div>

               {/* Add form */}
               {showForm && (
                    <Card>
                         <CardContent className="p-4">
                              <form onSubmit={handleSubmit} className="space-y-3">
                                   <Input placeholder="Label (e.g. Home, Office)" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
                                   <Input placeholder="Address line 1 *" required value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
                                   <Input placeholder="Address line 2" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
                                   <div className="grid grid-cols-2 gap-2">
                                        <Input placeholder="City *" required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                                        <Input placeholder="District *" required value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
                                   </div>
                                   <Input placeholder="Postal code" value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
                                   <label className="flex items-center gap-2 text-sm cursor-pointer">
                                        <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} />
                                        Set as default address
                                   </label>
                                   <div className="flex gap-2">
                                        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Address"}</Button>
                                        <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                                   </div>
                              </form>
                         </CardContent>
                    </Card>
               )}

               {/* Address list */}
               {initialAddresses.length === 0 ? (
                    <p className="text-center text-muted-foreground py-10">No addresses saved yet.</p>
               ) : (
                    initialAddresses.map((addr) => (
                         <Card key={addr.id} className={addr.isDefault ? "border-blue-400 border-2" : ""}>
                              <CardContent className="p-4 flex items-start gap-3">
                                   <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                                   <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                             {addr.label && <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded">{addr.label}</span>}
                                             {addr.isDefault && <span className="text-xs text-blue-600 font-semibold flex items-center gap-1"><Star className="w-3 h-3" />Default</span>}
                                        </div>
                                        <p className="text-sm mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}</p>
                                        <p className="text-sm text-muted-foreground">{addr.city}, {addr.district}{addr.postalCode ? ` - ${addr.postalCode}` : ""}</p>
                                   </div>
                                   <div className="flex gap-2">
                                        {!addr.isDefault && (
                                             <Button size="sm" variant="ghost" onClick={() => handleSetDefault(addr.id)} title="Set as default">
                                                  <Star className="w-4 h-4" />
                                             </Button>
                                        )}
                                        <Button size="sm" variant="ghost" className="text-red-500" onClick={() => handleDelete(addr.id)}>
                                             <Trash2 className="w-4 h-4" />
                                        </Button>
                                   </div>
                              </CardContent>
                         </Card>
                    ))
               )}
          </div>
     );
}