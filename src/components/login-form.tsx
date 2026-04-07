"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"
import { authService } from "@/service/auth.service"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/context/AuthProvider"
import { Pill, Mail, Lock, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

const formSchema = z.object({
     email: z.string().email("Invalid email address"),
     password: z.string().min(8, "Password must be at least 8 characters"),
})

export function LoginForm() {
     const { setCookie } = useAuth()
     const router = useRouter()
     const searchParams = useSearchParams()
     const redirect = searchParams.get("redirect") || "/"

     const form = useForm({
          defaultValues: { email: "", password: "" },
          validators: { onSubmit: formSchema },
          onSubmit: async ({ value }) => {
               const toastId = toast.loading("Signing in...")
               try {
                    const result = await authService.signIn(value)
                    if (!result.ok) {
                         toast.error(result.message || "Invalid credentials", { id: toastId })
                         return
                    }
                    setCookie(result.data.data.user, result.data.data.token)
                    toast.success("Welcome back!", { id: toastId })
                    router.push(redirect)
               } catch {
                    toast.error("Something went wrong", { id: toastId })
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
                              <h2 className="text-xl font-bold">Welcome back</h2>
                              <p className="text-sm text-muted-foreground mt-0.5">
                                   Sign in to your account to continue
                              </p>
                         </div>

                         <form
                              id="login-form"
                              onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
                              className="space-y-4"
                         >
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
                                                            type="email"
                                                            id={field.name}
                                                            name={field.name}
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
                                                            type="password"
                                                            id={field.name}
                                                            name={field.name}
                                                            value={field.state.value}
                                                            onChange={(e) => field.handleChange(e.target.value)}
                                                            placeholder="••••••••"
                                                            className="pl-10"
                                                       />
                                                  </div>
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Submit */}
                              <form.Subscribe selector={(s) => s.isSubmitting}>
                                   {(isSubmitting) => (
                                        <Button
                                             form="login-form"
                                             type="submit"
                                             disabled={isSubmitting}
                                             className="w-full rounded-full bg-purple-600 hover:bg-purple-700 h-11 text-base font-semibold gap-2 mt-2"
                                        >
                                             {isSubmitting ? (
                                                  <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
                                             ) : (
                                                  <><ArrowRight className="w-4 h-4" /> Sign In</>
                                             )}
                                        </Button>
                                   )}
                              </form.Subscribe>
                         </form>

                         <Separator />

                         <p className="text-center text-sm text-muted-foreground">
                              Don't have an account?{" "}
                              <Link
                                   href={`/register${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ""}`}
                                   className="font-semibold text-purple-600 hover:text-purple-700 hover:underline"
                              >
                                   Create one free
                              </Link>
                         </p>
                    </div>

                    <p className="text-center text-xs text-muted-foreground">
                         By signing in, you agree to our{" "}
                         <span className="underline cursor-pointer">Terms of Service</span> and{" "}
                         <span className="underline cursor-pointer">Privacy Policy</span>
                    </p>
               </div>
          </div>
     )
}