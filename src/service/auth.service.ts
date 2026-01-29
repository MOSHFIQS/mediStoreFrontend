
import { env } from "@/env"


const AUTH_URL = env.NEXT_PUBLIC_AUTH_URL

export interface SignUpPayload {
     name: string
     email: string
     password: string
     role: string,
     image : string
}

export interface SignInPayload {
     email: string
     password: string
}


export const authService = {

     async signUp(payload: SignUpPayload) {
          const res = await fetch(`${AUTH_URL}/register`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               credentials: "include",
               body: JSON.stringify(payload),
          });

          const data = await res.json();

          return {
               ok: res.ok,
               data,
               message: data.message,
          };
     },


     async signIn(payload: SignInPayload) {
          const res = await fetch(`${AUTH_URL}/login`, {
               method: "POST",
               headers: { "Content-Type": "application/json" },
               credentials: "include",
               body: JSON.stringify(payload),
          });

          const data = await res.json();

          return {
               ok: res.ok,
               data,
               message: data.message,
          };
     }




    

}
