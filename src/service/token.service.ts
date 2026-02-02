
import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { User } from "@/types/user.types"

export const sessionService = {
     getUserFromToken: async (): Promise<User | null> => {
          const cookieStore = await cookies()
          const token = cookieStore.get("token")?.value

          if (!token) return null

          try {
               return jwt.verify(token, process.env.JWT_SECRET as string) as User
          } catch (err){
               console.log("JWT invalid or expired:", err);
               return null
          }
     },
}