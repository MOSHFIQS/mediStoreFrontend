import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { JwtUserPayload } from "@/types/user.types"

export const serverAuthService = {
     getDecodedToken: async (): Promise<JwtUserPayload | null> => {
          const cookieStore = await cookies()
          const tokenCookie = cookieStore.get("token")

          if (!tokenCookie) return null

          try {
               const decoded = jwt.verify(
                    tokenCookie.value,
                    process.env.JWT_SECRET!
               ) as JwtUserPayload 

               return decoded
          } catch (err) {
               console.log("JWT invalid or expired:", err)
               return null
          }
     }
}
