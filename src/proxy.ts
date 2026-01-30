import { NextRequest, NextResponse } from "next/server"
import { Roles } from "./constants/roles"
import { sessionService } from "./service/token.service";


export async function proxy(request: NextRequest) {
     const pathname = request.nextUrl.pathname;
     const data = await sessionService.getUserFromToken()

     const role = data?.role

     const isAdmin = role === Roles.admin
     const isSeller = role === Roles.seller
     const isCustomer = role === Roles.customer


     if (isAdmin && (pathname.startsWith("/dashboard") || pathname.startsWith("/seller-dashboard"))) {
          return NextResponse.redirect(new URL("/admin-dashboard", request.url))
     }


     if (isSeller && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin-dashboard"))) {
          return NextResponse.redirect(new URL("/seller-dashboard", request.url))
     }


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
