import { NextRequest, NextResponse } from "next/server"
import { Roles } from "./constants/roles"
import { sessionService } from "./service/token.service"

export const dynamic = "force-dynamic"

export async function proxy(request: NextRequest) {
     const pathname = request.nextUrl.pathname

     const data = await sessionService.getUserFromToken()

     const role = data?.role

     const isAdmin = role === Roles.admin
     const isSeller = role === Roles.seller
     const isCustomer = role === Roles.customer

     // -----------------------------
     // 🔒 Protect dashboard routes
     // -----------------------------
     const isDashboardRoute =
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/admin-dashboard") ||
          pathname.startsWith("/seller-dashboard")

     if (!data?.id && isDashboardRoute) {
          return NextResponse.redirect(
               new URL(`/login?redirect=${pathname}`, request.url)
          )
     }

     // -----------------------------
     // 🚫 Prevent logged-in users from visiting auth pages
     // -----------------------------
     const isAuthRoute =
          pathname.startsWith("/login") ||
          pathname.startsWith("/register")

     if (data?.id && isAuthRoute) {
          if (isAdmin) {
               return NextResponse.redirect(new URL("/admin-dashboard", request.url))
          }
          if (isSeller) {
               return NextResponse.redirect(new URL("/seller-dashboard", request.url))
          }
          return NextResponse.redirect(new URL("/dashboard", request.url))
     }

     // -----------------------------
     // 🔁 Role-based redirects
     // -----------------------------
     if (isAdmin && pathname.startsWith("/dashboard")) {
          return NextResponse.redirect(new URL("/admin-dashboard", request.url))
     }

     if (isSeller && pathname.startsWith("/dashboard")) {
          return NextResponse.redirect(new URL("/seller-dashboard", request.url))
     }

     if (isCustomer && pathname.startsWith("/admin-dashboard")) {
          return NextResponse.redirect(new URL("/dashboard", request.url))
     }

     if (isCustomer && pathname.startsWith("/seller-dashboard")) {
          return NextResponse.redirect(new URL("/dashboard", request.url))
     }

     return NextResponse.next()
}

export const config = {
     matcher: [
          "/dashboard/:path*",
          "/admin-dashboard/:path*",
          "/seller-dashboard/:path*",
          "/login",
          "/register",
     ],
}