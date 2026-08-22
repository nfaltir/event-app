"use server";

import { createAdminSession, COOKIE_NAME } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData) {
  const code = formData.get("code")?.toString().trim().toUpperCase();

  if (!code) {
    throw new Error("Admin code is required.");
  }

  // TODO: Replace this with the actual global admin passcode.
  const adminPasscode = process.env.ADMIN_PASSCODE;

  if (!adminPasscode) {
    throw new Error("ADMIN_PASSCODE is not configured.");
  }

  if (code !== adminPasscode.toUpperCase()) {
    throw new Error("Invalid admin passcode.");
  }

  const token = await createAdminSession();

  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/admin/dashboard");
}