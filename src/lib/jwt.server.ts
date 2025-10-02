import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");

const JWT_EXPIRATION = process.env.JWT_EXPIRATION || "1h";
type StringValue = `${number}${"ms" | "s" | "m" | "h" | "d"}`;

export type JwtPayload = {
  userId: string;
  email: string;
  role: "USER" | "ADMIN";
  exp?: number;
  iat?: number;
};

export function signJwt(
  payload: object,
  expiresIn: StringValue = JWT_EXPIRATION as StringValue
) {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, JWT_SECRET!, options);
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET!) as JwtPayload;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
