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
import { authService } from "@/service/auth.service"
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import * as z from "zod";


const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL

const formSchema = z.object({
     password: z.string().min(8, "Minimum length is 8"),
     email: z.email()
});

export function LoginForm({ ...props }: React.ComponentProps<typeof Card>) {

     const form = useForm({
          defaultValues: {
               email: "",
               password: ""
          },
          validators: {
               onSubmit: formSchema,
          },
          onSubmit: async ({ value }) => {
               const toastId = toast.loading("Finding User...");
               const userLoginInfo = {...value};

               const result = await authService.signIn(userLoginInfo);

               if (!result.ok) {
                    toast.error(result.message || "Invalid credentials", { id: toastId });

                    // 👇 Tell the form submission failed (no crash)
                    return {
                         form: "Invalid email or password",
                    };
               }

               toast.success("User Login Successfully", { id: toastId });
               console.log("Logged in user:", result.data.user);
          }


     });

     return (
          <Card {...props}>
               <CardHeader>
                    <CardTitle>Login your account</CardTitle>
                    <CardDescription>
                         Enter your information below to Login your account
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
