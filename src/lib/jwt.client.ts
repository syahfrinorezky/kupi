import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "./jwt.server";

export function getTokenFromStorage(): JwtPayload | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload: JwtPayload = jwtDecode(token);
    
    // Check if token is expired
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn("Token has expired");
      removeTokenFromStorage();
      return null;
    }
    
    return payload;
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    removeTokenFromStorage(); // Remove invalid token
    return null;
  }
}

export function setTokenToStorage(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem("token", token);
}

export function removeTokenFromStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getTokenFromStorage() !== null;
}

// Get user role from token
export function getUserRole(): "USER" | "ADMIN" | null {
  const payload = getTokenFromStorage();
  return payload ? payload.role : null;
}

// Get user ID from token
export function getUserId(): string | null {
  const payload = getTokenFromStorage();
  return payload ? payload.userId : null;
}

// Get user email from token
export function getUserEmail(): string | null {
  const payload = getTokenFromStorage();
  return payload ? payload.email : null;
}

// Get token string from storage (for API calls)
export function getTokenString(): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  
  // Validate token before returning
  if (token && getTokenFromStorage()) {
    return token;
  }
  
  return null;
}
