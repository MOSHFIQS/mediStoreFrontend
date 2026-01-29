import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export const serverAuthService = {
     getDecodedToken: async () => {   
          const cookieStore = await cookies()  
          const tokenCookie = cookieStore.get("token")

          if (!tokenCookie) return null

          try {
               const decoded = jwt.verify(tokenCookie.value, process.env.JWT_SECRET!)
               return decoded
          } catch (err) {
               console.log("JWT invalid or expired:", err)
               return null
          }
     }
}
