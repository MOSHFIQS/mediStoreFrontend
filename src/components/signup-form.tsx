"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"
import {
     Select, SelectContent, SelectItem,
     SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { authService } from "@/service/auth.service"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthProvider"
import { useImageUpload } from "@/hooks/useImageUpload"
import ImageUploader from "@/components/shared/image/ImageUploader"
import {
     Pill, Mail, Lock, User, Phone,
     ArrowRight, Loader2, ShoppingBag, Store
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

const formSchema = z.object({
     name: z.string().min(1, "Name is required"),
     email: z.string().email("Invalid email address"),
     phone: z.string(),
     password: z.string().min(8, "Password must be at least 8 characters"),
     role: z.enum(["CUSTOMER", "SELLER"]),
})

const ROLES = [
     {
          value: "CUSTOMER",
          label: "Customer",
          description: "Buy medicines",
          icon: <ShoppingBag className="w-5 h-5" />,
     },
     {
          value: "SELLER",
          label: "Seller",
          description: "Sell medicines",
          icon: <Store className="w-5 h-5" />,
     },
] as const

export function SignupForm() {
     const { setCookie } = useAuth()
     const router = useRouter()
     const profileImage = useImageUpload({ max: 1 })

     const form = useForm({
          defaultValues: {
               name: "", email: "", phone: "", password: "", role: "CUSTOMER" as "CUSTOMER" | "SELLER",
          },
          validators: { onSubmit: formSchema },
          onSubmit: async ({ value }) => {
               const toastId = toast.loading("Creating your account...")
               try {
                    const result = await authService.signUp({
                         name: value.name,
                         email: value.email,
                         phone: value.phone,
                         password: value.password,
                         role: value.role,
                         image: profileImage.images[0]?.img,
                    })

                    if (!result.ok) {
                         toast.error(result.message || "Registration failed", { id: toastId })
                         return
                    }

                    setCookie(result.data.data.user, result.data.data.token)
                    toast.success("Account created! Welcome to MediStore 🎉", { id: toastId })
                    router.push("/")
               } catch (err: any) {
                    toast.error(err.message || "Something went wrong", { id: toastId })
               }
          },
     })

     return (
          <div className="flex items-center  justify-center w-full max-w-3xl mx-auto  bg-gray-50 px-4 py-12  border">
               <div className="space-y-8 w-full">

                    {/* Brand */}
                    <div className="text-center space-y-2">
                         <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-purple-600 shadow-lg mb-2">
                              <Pill className="w-7 h-7 text-white" />
                         </div>
                         <h1 className="text-3xl font-bold tracking-tight">MediStore</h1>
                         <p className="text-muted-foreground text-sm">
                              Your trusted online pharmacy
                         </p>
                    </div>

                    {/* Card */}
                    <div className="bg-white rounded-2xl shadow-sm border p-8 space-y-6">
                         <div>
                              <h2 className="text-xl font-bold">Create your account</h2>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                   Join thousands of customers and sellers
                              </p>
                         </div>

                         <form
                              id="signup-form"
                              onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
                              className="space-y-4"
                         >

                              {/* Role picker */}
                              <form.Field name="role">
                                   {(field) => (
                                        <div className="space-y-1.5">
                                             <p className="text-sm font-medium">I want to</p>
                                             <div className="grid grid-cols-2 gap-3">
                                                  {ROLES.map((r) => (
                                                       <button
                                                            key={r.value}
                                                            type="button"
                                                            onClick={() => field.handleChange(r.value)}
                                                            className={cn(
                                                                 "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition text-center",
                                                                 field.state.value === r.value
                                                                      ? "border-purple-500 bg-purple-50 text-purple-700"
                                                                      : "border-gray-200 hover:border-gray-300 text-muted-foreground"
                                                            )}
                                                       >
                                                            <span className={cn(
                                                                 "w-10 h-10 rounded-xl flex items-center justify-center",
                                                                 field.state.value === r.value
                                                                      ? "bg-purple-100 text-purple-600"
                                                                      : "bg-gray-100"
                                                            )}>
                                                                 {r.icon}
                                                            </span>
                                                            <div>
                                                                 <p className="text-sm font-semibold">{r.label}</p>
                                                                 <p className="text-xs opacity-70">{r.description}</p>
                                                            </div>
                                                       </button>
                                                  ))}
                                             </div>
                                        </div>
                                   )}
                              </form.Field>

                              {/* Name */}
                              <form.Field name="name">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Full Name</FieldLabel>
                                                  <div className="relative">
                                                       <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                       <Input
                                                            type="text" id={field.name} name={field.name}
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="John Doe"
                                                            className="pl-10"
                                                       />
                                                  </div>
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Email */}
                              <form.Field name="email">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Email address</FieldLabel>
                                                  <div className="relative">
                                                       <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                       <Input
                                                            type="email" id={field.name} name={field.name}
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="you@example.com"
                                                            className="pl-10"
                                                       />
                                                  </div>
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Phone */}
                              <form.Field name="phone">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>
                                                       Phone{" "}
                                                       <span className="text-muted-foreground font-normal">(optional)</span>
                                                  </FieldLabel>
                                                  <div className="relative">
                                                       <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                       <Input
                                                            type="text" id={field.name} name={field.name}
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="+880 1X XX XXX XXX"
                                                            className="pl-10"
                                                       />
                                                  </div>
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Password */}
                              <form.Field name="password">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                                  <div className="relative">
                                                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                       <Input
                                                            type="password" id={field.name} name={field.name}
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="Min. 8 characters"
                                                            className="pl-10"
                                                       />
                                                  </div>
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Profile photo */}
                              <div className="space-y-1.5">
                                   <p className="text-sm font-medium">
                                        Profile Photo{" "}
                                        <span className="text-muted-foreground font-normal">(optional)</span>
                                   </p>
                                   <ImageUploader
                                        label=""
                                        images={profileImage.images}
                                        onUpload={profileImage.upload}
                                        onDelete={profileImage.remove}
                                        multiple={false}
                                   />
                              </div>

                              {/* Submit */}
                              <form.Subscribe selector={(s) => s.isSubmitting}>
                                   {(isSubmitting) => (
                                        <Button
                                             form="signup-form"
                                             type="submit"
                                             disabled={isSubmitting}
                                             className="w-full rounded-full bg-purple-600 hover:bg-purple-700 h-11 text-base font-semibold gap-2 mt-2"
                                        >
                                             {isSubmitting ? (
                                                  <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</>
                                             ) : (
                                                  <><ArrowRight className="w-4 h-4" /> Create Account</>
                                             )}
                                        </Button>
                                   )}
                              </form.Subscribe>
                         </form>

                         <Separator />

                         <p className="text-center text-sm text-muted-foreground">
                              Already have an account?{" "}
                              <Link
                                   href="/login"
                                   className="font-semibold text-purple-600 hover:text-purple-700 hover:underline"
                              >
                                   Sign in
                              </Link>
                         </p>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                         By creating an account, you agree to our{" "}
                         <span className="underline cursor-pointer">Terms of Service</span> and{" "}
                         <span className="underline cursor-pointer">Privacy Policy</span>
                    </p>
               </div>
          </div>
     )
}