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
import { useForm } from "@tanstack/react-form"
import { toast } from "sonner"
import * as z from "zod"
import { authService } from "@/service/auth.service"
import { useRouter} from "next/navigation"
import { useAuth } from "@/context/AuthProvider"

const formSchema = z.object({
     password: z.string().min(8, "Minimum length is 8"),
     email: z.string().email("Invalid email"),
})

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {
     const { refreshUser , setCookie} = useAuth() 
     const router = useRouter()
     // const searchParams = useSearchParams();
     // const redirect = searchParams.get("redirect") || "/";
     // console.log(redirect);


     const form = useForm({
          defaultValues: {
               email: "",
               password: "",
          },
          validators: {
               onSubmit: formSchema,
          },
          onSubmit: async ({ value }) => {
               const toastId = toast.loading("Logging in...")
               try {
                    const result = await authService.signIn(value)

                    if (!result.ok) {
                         toast.error(result.message || "Invalid credentials", { id: toastId })
                         return { form: "Invalid email or password" }
                    }

                    if (result.data.data.token) {
                         setCookie(result.data.data.token)
                    }

                    await refreshUser()

                    toast.success("Logged in successfully!", { id: toastId })


                   
                         // router.push(`${redirect}`)
                         router.push(`/`)

               } catch (err) {
                    console.error(err)
                    toast.error("Something went wrong", { id: toastId })
               }
          },
     })

     return (
          <Card {...props}>
               <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>Enter your information below to login</CardDescription>
               </CardHeader>

               <CardContent>
                    <form
                         id="login-form"
                         onSubmit={(e) => {
                              e.preventDefault()
                              form.handleSubmit()
                         }}
                    >
                         <FieldGroup>
                              <form.Field
                                   name="email"
                                   children={(field) => {
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
                              />
                              <form.Field
                                   name="password"
                                   children={(field) => {
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
                              />
                         </FieldGroup>
                    </form>
               </CardContent>

               <CardFooter className="flex flex-col gap-5 justify-end">
                    <Button form="login-form" type="submit" className="w-full">
                         Login
                    </Button>
               </CardFooter>
          </Card>
     )
}
