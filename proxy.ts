import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getManualToken } from "./utils/nextauth-man";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback_super_secret_key_123"
);

export async function middleware(req: any) {
  const { pathname } = req.nextUrl;
  
  // 1. Skip static assets
  if (pathname.includes(".") && !pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 2. Identify user from Session or Custom JWT
  const sessionToken = await getManualToken(req);
  const customToken = req.cookies.get("auth_token")?.value;
  
  let userPayload: any = null;

  if (sessionToken) {
    userPayload = {
      id: sessionToken.id,
      role: sessionToken.role || "student",
    };
  } else if (customToken) {
    try {
      const { payload } = await jwtVerify(customToken, secret);
      userPayload = {
        id: payload.id,
        role: payload.role,
      };
    } catch (error) {
      userPayload = null;
    }
  }

  // 3. Prepare headers
  const requestHeaders = new Headers(req.headers);
  if (userPayload) {
    requestHeaders.set("x-user-id", String(userPayload.id));
    requestHeaders.set("x-user-role", String(userPayload.role));
  }

  // 4. Handle Route Protection (Redirects)
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/courses/enrolled");
  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");

  // Redirect if unauthorized for protected UI routes
  if (isProtectedRoute || isAdminRoute) {
    if (!userPayload) {
      return NextResponse.redirect(new URL("/get-started", req.url));
    }

    if (isAdminRoute && userPayload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url)); 
    }
  }

  // Return 403 for Admin APIs if not admin
  if (isAdminApi && (!userPayload || userPayload.role !== "admin")) {
    return new NextResponse(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 5. Continue with headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Support both named and default export for maximum compatibility
export default middleware;

export const config = {
  matcher: [
    "/admin/:path*", 
    "/dashboard/:path*",
    "/courses/enrolled/:path*",
    "/api/:path*"
  ],
};
