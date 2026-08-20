import { SignJWT, jwtVerify } from "jose";

const secret = process.env.SESSION_SECRET;

if (!secret) {
  throw new Error("SESSION_SECRET is not configured.");
}

const key = new TextEncoder().encode(secret);

const COOKIE_NAME = "admin_session";

export async function createAdminSession(eventId: string) {
  const token = await new SignJWT({
    eventId,
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

    if (
      typeof payload.eventId !== "string" ||
      payload.role !== "admin"
    ) {
      return null;
    }

    return {
      eventId: payload.eventId,
    };
  } catch {
    return null;
  }
}

export { COOKIE_NAME };