import { NextResponse, NextRequest } from "next/server";
import { verifyJwt } from "@/lib/jwt.server";

export function middleware(request: NextRequest) {
  // Skip middleware for public routes
  const publicPaths = ['/api/auth/login', '/api/auth/register', '/login', '/register', '/', '/public'];
  const isPublicPath = publicPaths.some(path => request.nextUrl.pathname.startsWith(path));
  
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Check for Authorization header
  const authHeader = request.headers.get("Authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Unauthorized - Missing or invalid authorization header" }, 
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];
  const payload = verifyJwt(token);

  if (!payload || typeof payload === "string") {
    return NextResponse.json(
      { message: "Unauthorized - Invalid token" }, 
      { status: 401 }
    );
  }

  // Add user info to request headers for use in API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-email', payload.email);
  requestHeaders.set('x-user-role', payload.role);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    }
  });
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
};