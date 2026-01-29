import { NextRequest, NextResponse } from "next/server"
import { Roles } from "./constants/roles"
import { serverAuthService } from "./service/auth.service";


export async function proxy(request: NextRequest) {
     const pathname = request.nextUrl.pathname;
     const data = await serverAuthService.getDecodedToken()

     const role = data?.role

     const isAdmin = role === Roles.admin
     const isSeller = role === Roles.seller
     const isCustomer = role === Roles.customer

     // ADMIN restrictions
     if (isAdmin && (pathname.startsWith("/dashboard") || pathname.startsWith("/seller-dashboard"))) {
          return NextResponse.redirect(new URL("/admin-dashboard", request.url))
     }

     // SELLER restrictions
     if (isSeller && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin-dashboard"))) {
          return NextResponse.redirect(new URL("/seller-dashboard", request.url))
     }

     // CUSTOMER restrictions
     if (isCustomer && (pathname.startsWith("/admin-dashboard") || pathname.startsWith("/seller-dashboard"))) {
          return NextResponse.redirect(new URL("/dashboard", request.url))
     }

     return NextResponse.next()
}

export const config = {
     matcher: [
          "/dashboard/:path*",
          "/admin-dashboard/:path*",
          "/seller-dashboard/:path*",
     ],
}
