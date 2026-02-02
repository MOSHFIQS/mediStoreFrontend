"use client"
import { Button } from "@/components/ui/button"
import {
     Card,
     CardContent,
     CardDescription,
     CardFooter,
     CardHeader,
     CardTitle,
} from "@/components/ui/card"
import {
     Field,
     FieldError,
     FieldGroup,
     FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";
import { Select, SelectContent, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "./ui/select";
import { authService } from "@/service/auth.service"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthProvider"
import { imageHostingService } from "@/service/image-hosting.service"

const userRoles = [
     { label: "CUSTOMER", value: "CUSTOMER" },
     { label: "SELLER", value: "SELLER" }
] as const

const formSchema = z.object({
     name: z.string().min(1, "This field is required"),
     password: z.string().min(8, "Minimum length is 8"),
     email: z.email(),
     role: z.enum(["CUSTOMER", "SELLER"]),
     image: z.array(z.instanceof(File)).min(1, "Please upload a profile image")
});

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
     const { setCookie } = useAuth()
     const router = useRouter()

     const form = useForm({
          defaultValues: {
               name: "",
               email: "",
               password: "",
               role: "CUSTOMER",
               image: [] as File[]
          },
          validators: {
               onSubmit: formSchema,
          },
          onSubmit: async ({ value }) => {
               const toastId = toast.loading(`Creating ${value.role}...`)

               // Upload first image file
               const file = value.image[0]
               const uploadRes = await imageHostingService.uploadImage(file)
               if (!uploadRes.ok || !uploadRes.url) {
                    toast.error("Image upload failed", { id: toastId })
                    return
               }

               const finalPayload = {
                    name: value.name,
                    email: value.email,
                    password: value.password,
                    role: value.role,
                    image: uploadRes.url
               }

               const result = await authService.signUp(finalPayload)
               if (result.ok) {
                    setCookie(result.data.data.user, result.data.data.token)
                    toast.success("Account created & logged in!", { id: toastId })
                    router.push("/")
               } else {
                    toast.error(result.message || "Registration failed", { id: toastId })
                    return { form: "Registration failed" }
               }
          }
     });

     return (
          <Card {...props}>
               <CardHeader>
                    <CardTitle>Create an account</CardTitle>
                    <CardDescription>
                         Enter your information below to create your account
                    </CardDescription>
               </CardHeader>
               <CardContent>
                    <form
                         id="signup-form"
                         onSubmit={(e) => {
                              e.preventDefault();
                              form.handleSubmit();
                         }}
                    >
                         <FieldGroup>
                              <form.Field name="name">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                                                  <Input
                                                       type="text"
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              <form.Field name="email">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                                  <Input
                                                       type="email"
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              <form.Field name="password">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                                  <Input
                                                       type="password"
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Image upload */}
                              <form.Field name="image">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field data-invalid={isInvalid}>
                                                  <FieldLabel>Profile Image</FieldLabel>
                                                  <Input
                                                       type="file"
                                                       accept="image/*"
                                                       onChange={(e) => field.handleChange(Array.from(e.target.files || []))}
                                                  />
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                             </Field>
                                        )
                                   }}
                              </form.Field>

                              {/* Role select */}
                              <form.Field name="role">
                                   {(field) => {
                                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field orientation="responsive" data-invalid={isInvalid}>
                                                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                                                  <Select
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onValueChange={field.handleChange}
                                                  >
                                                       <SelectTrigger
                                                            id="form-tanstack-select-role"
                                                            aria-invalid={isInvalid}
                                                            className="min-w-[120px]"
                                                       >
                                                            <SelectValue placeholder="Select" />
                                                       </SelectTrigger>
                                                       <SelectContent position="item-aligned">
                                                            <SelectSeparator />
                                                            {userRoles.map((role) => (
                                                                 <SelectItem key={role.value} value={role.value}>
                                                                      {role.label}
                                                                 </SelectItem>
                                                            ))}
                                                       </SelectContent>
                                                  </Select>
                                             </Field>
                                        )
                                   }}
                              </form.Field>
                         </FieldGroup>
                    </form>
               </CardContent>
               <CardFooter className="flex flex-col gap-5 justify-end">
                    <Button form="signup-form" type="submit" className="w-full">
                         Register
                    </Button>
               </CardFooter>
          </Card>
     )
}
