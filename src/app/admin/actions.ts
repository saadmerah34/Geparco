"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

const COOKIE = "gc_admin";

function expectedToken() {
  return process.env.ADMIN_PASSWORD?.trim() || "";
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual(ab, bb);
}

export async function isAuthed() {
  const token = expectedToken();
  if (!token) return false;
  const jar = await cookies();
  const got = jar.get(COOKIE)?.value ?? "";
  return safeEqual(got, token);
}

export async function login(_prev: unknown, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const token = expectedToken();

  if (!token) {
    return { error: "ADMIN_PASSWORD is not set in the environment." };
  }
  if (!safeEqual(password, token)) {
    return { error: "Incorrect password." };
  }

  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
  redirect("/admin");
}

export async function logout() {
  const jar = await cookies();
  jar.delete(COOKIE);
  redirect("/admin");
}

export async function setOrderStatus(formData: FormData) {
  if (!(await isAuthed())) throw new Error("Not authorized");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["PENDING", "PAID", "CANCELLED", "FULFILLED"].includes(status)) {
    throw new Error("Invalid status");
  }
  await prisma.order.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}

export async function setEnquiryStatus(formData: FormData) {
  if (!(await isAuthed())) throw new Error("Not authorized");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!["NEW", "CONTACTED", "CLOSED"].includes(status)) {
    throw new Error("Invalid status");
  }
  await prisma.enquiry.update({ where: { id }, data: { status } });
  revalidatePath("/admin");
}
