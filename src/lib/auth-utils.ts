import { NextResponse, NextRequest } from "next/server";
import { verifyJwt, JwtPayload } from "@/lib/jwt.server";

// Utility function to get user from request headers (set by middleware)
export function getUserFromHeaders(req: NextRequest): JwtPayload | null {
  const userId = req.headers.get('x-user-id');
  const email = req.headers.get('x-user-email');
  const role = req.headers.get('x-user-role') as 'USER' | 'ADMIN';

  if (!userId || !email || !role) {
    return null;
  }

  return {
    userId,
    email,
    role,
  };
}

// Utility function to check user authorization for API routes
export function checkUserAuthorization(
  req: NextRequest,
  allowedRoles: ("USER" | "ADMIN")[] = []
): { user: JwtPayload | null; error: NextResponse | null } {
  const user = getUserFromHeaders(req);

  if (!user) {
    return {
      user: null,
      error: NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return {
      user: null,
      error: NextResponse.json({ message: "Forbidden" }, { status: 403 })
    };
  }

  return {
    user,
    error: null
  };
}

// Legacy function for backward compatibility
export function requireAuth(
  req: NextRequest,
  allowedRoles: ("USER" | "ADMIN")[] = []
) {
  const { error } = checkUserAuthorization(req, allowedRoles);
  return error;
}
