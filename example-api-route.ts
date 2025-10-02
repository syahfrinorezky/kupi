// Example: src/app/api/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import { checkUserAuthorization, getUserFromHeaders } from "@/lib/auth-utils";

export async function GET(req: NextRequest) {
  // Method 1: Using checkUserAuthorization (recommended)
  const { user, error } = checkUserAuthorization(req);
  
  if (error) {
    return error; // Returns 401 or 403 response
  }

  // Now you have access to user data
  console.log("User ID:", user?.userId);
  console.log("User Email:", user?.email);
  console.log("User Role:", user?.role);

  return NextResponse.json({
    message: "Profile data",
    user: user,
  });
}

export async function POST(req: NextRequest) {
  // Method 2: Using checkUserAuthorization with role restrictions
  const { user, error } = checkUserAuthorization(req, ["ADMIN"]); // Only admins
  
  if (error) {
    return error;
  }

  // Only admins reach this point
  return NextResponse.json({
    message: "Admin-only action completed",
    user: user,
  });
}

export async function PUT(req: NextRequest) {
  // Method 3: Using getUserFromHeaders directly (if you want custom error handling)
  const user = getUserFromHeaders(req);
  
  if (!user) {
    return NextResponse.json(
      { message: "Authentication required" }, 
      { status: 401 }
    );
  }

  // Custom role check
  if (user.role !== "USER" && user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Invalid user role" }, 
      { status: 403 }
    );
  }

  return NextResponse.json({
    message: "Updated successfully",
    userId: user.userId,
  });
}