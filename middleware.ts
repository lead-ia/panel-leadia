import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Handle API proxying with a secret key
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const requestHeaders = new Headers(request.headers)
    const secretKey = process.env.WEBFLOW_SECRET_KEY

    if (secretKey) {
      requestHeaders.set("X-App-Secret", secretKey)
    }

    const destination = `https://webflow.leadia.com.br/webhook${request.nextUrl.pathname.replace("/api", "")}`
    return NextResponse.rewrite(new URL(destination), { headers: requestHeaders })
  }

  const token = request.cookies.get("token")?.value

  // Protected routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  // Redirect authenticated users from auth pages
  if (request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/login", "/signup"],
}
