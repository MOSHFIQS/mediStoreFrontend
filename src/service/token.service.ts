
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { JwtUserPayload } from "@/types/user.types"

export const sessionService = {
     getUserFromToken: async (): Promise<JwtUserPayload | null> => {
          const cookieStore = await cookies()   
          console.log(cookieStore.getAll());
          const token = cookieStore.get("token")?.value

          if (!token) return null

          try {
               return jwt.verify(token, process.env.JWT_SECRET!) as JwtUserPayload
          } catch {
               return null
          }
     },
}
