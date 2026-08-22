import { SignJWT, jwtVerify } from "jose";

const secret = process.env.SESSION_SECRET;

if (!secret) {
  throw new Error("SESSION_SECRET is not configured.");
}

const key = new TextEncoder().encode(secret);

const COOKIE_NAME = "admin_session";

export async function createAdminSession() {
  const token = await new SignJWT({
    role: "admin",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);

  return token;
}

export async function verifyAdminSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, key);

    if (payload.role !== "admin") {
      return null;
    }

    return {
      role: "admin" as const,
    };
  } catch {
    return null;
  }
}

export { COOKIE_NAME };