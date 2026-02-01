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


const userRoles = [
     { label: "CUSTOMER", value: "CUSTOMER" },
     { label: "SELLER", value: "SELLER" }
] as const

const formSchema = z.object({
     name: z.string().min(1, "This field is required"),
     password: z.string().min(8, "Minimum length is 8"),
     email: z.email(),
     role: z.enum(["CUSTOMER", "SELLER"]),
     image: z.string()
});

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {

     const { refreshUser, setCookie } = useAuth()
     const router = useRouter()

     const form = useForm({
          defaultValues: {
               name: "",
               email: "",
               password: "",
               role: "CUSTOMER",
               image: ""
          },
          validators: {
               onSubmit: formSchema,
          },
          onSubmit: async ({ value }) => {
               const toastId = toast.loading(`Creating ${value.role}...`)

               const result = await authService.signUp(value)
               if (result.data.data.token){
                    setCookie(result.data.data.token)
               }

               if (!result.ok) {
                    toast.error(result.message || "Registration failed", { id: toastId })
                    return { form: "Registration failed" }
               }

               await refreshUser()
               toast.success("Account created & logged in!", { id: toastId })
               router.push("/")
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
                         id="login-form"
                         onSubmit={(e) => {
                              e.preventDefault();
                              form.handleSubmit();
                         }}
                    >
                         <FieldGroup>
                              <form.Field
                                   name="name"
                                   children={(field) => {
                                        const isInvalid =
                                             field.state.meta.isTouched && !field.state.meta.isValid;
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
                                                  {isInvalid && (
                                                       <FieldError errors={field.state.meta.errors} />
                                                  )}
                                             </Field>
                                        );
                                   }}
                              />
                              <form.Field
                                   name="email"
                                   children={(field) => {
                                        const isInvalid =
                                             field.state.meta.isTouched && !field.state.meta.isValid;
                                        return (
                                             <Field>
                                                  <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                                                  <Input
                                                       type="email"
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                  />
                                                  {isInvalid && (
                                                       <FieldError errors={field.state.meta.errors} />
                                                  )}
                                             </Field>
                                        );
                                   }}
                              />
                              <form.Field
                                   name="password"
                                   children={(field) => {
                                        const isInvalid =
                                             field.state.meta.isTouched && !field.state.meta.isValid;
                                        return (
                                             <Field>
                                                  <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                                                  <Input
                                                       type="password"
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                  />
                                                  {isInvalid && (
                                                       <FieldError errors={field.state.meta.errors} />
                                                  )}
                                             </Field>
                                        );
                                   }}
                              />
                              <form.Field
                                   name="image"
                                   children={(field) => {
                                        const isInvalid =
                                             field.state.meta.isTouched && !field.state.meta.isValid;
                                        return (
                                             <Field>
                                                  <FieldLabel htmlFor={field.name}>image</FieldLabel>
                                                  <Input
                                                       type="text"
                                                       id={field.name}
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onChange={(e) => field.handleChange(e.target.value)}
                                                  />
                                                  {isInvalid && (
                                                       <FieldError errors={field.state.meta.errors} />
                                                  )}
                                             </Field>
                                        );
                                   }}
                              />



                              <form.Field
                                   name="role"
                                   children={(field) => {
                                        const isInvalid =
                                             field.state.meta.isTouched && !field.state.meta.isValid
                                        return (
                                             <Field orientation="responsive" data-invalid={isInvalid}>

                                                  {isInvalid && (
                                                       <FieldError errors={field.state.meta.errors} />
                                                  )}
                                                  <Select
                                                       name={field.name}
                                                       value={field.state.value}
                                                       onValueChange={field.handleChange}
                                                  >
                                                       <SelectTrigger
                                                            id="form-tanstack-select-language"
                                                            aria-invalid={isInvalid}
                                                            className="min-w-[120px]"
                                                       >
                                                            <SelectValue placeholder="Select" />
                                                       </SelectTrigger>
                                                       <SelectContent position="item-aligned">
                                                            <SelectSeparator />
                                                            {userRoles.map((role) => (
                                                                 <SelectItem
                                                                      key={role.value}
                                                                      value={role.value}
                                                                 >
                                                                      {role.label}
                                                                 </SelectItem>
                                                            ))}
                                                       </SelectContent>
                                                  </Select>
                                             </Field>
                                        )
                                   }}
                              />





                         </FieldGroup>
                    </form>
               </CardContent>
               <CardFooter className="flex flex-col gap-5 justify-end">
                    <Button form="login-form" type="submit" className="w-full">
                         Register
                    </Button>
               </CardFooter>
          </Card>
     )
}