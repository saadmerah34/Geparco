"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { z } from "zod";
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

// --- Products -----------------------------------------------------------

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // strip accents (é -> e)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function uniqueSlug(base: string, ignoreId?: string) {
  const root = slugify(base) || "product";
  let slug = root;
  for (let n = 2; ; n++) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${root}-${n}`;
  }
}

const productSchema = z.object({
  name: z.string().trim().min(1).max(120),
  nameFr: z.string().trim().max(120).optional().default(""),
  description: z.string().trim().min(1).max(600),
  descriptionFr: z.string().trim().max(600).optional().default(""),
  price: z.coerce.number().positive().max(100000),
  unit: z.string().trim().min(1).max(40),
  unitFr: z.string().trim().max(40).optional().default(""),
  category: z.string().trim().min(1).max(60),
  emoji: z.string().trim().min(1).max(8).optional().default("🐟"),
  stock: z.coerce.number().int().min(0).max(100000).optional().default(0),
  imageUrl: z
    .string()
    .trim()
    .max(600)
    .refine((v) => v === "" || /^https:\/\//.test(v), "Invalid image URL")
    .optional()
    .default(""),
});

function parseProduct(formData: FormData) {
  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    nameFr: formData.get("nameFr") ?? "",
    description: formData.get("description"),
    descriptionFr: formData.get("descriptionFr") ?? "",
    price: formData.get("price"),
    unit: formData.get("unit"),
    unitFr: formData.get("unitFr") ?? "",
    category: formData.get("category"),
    emoji: formData.get("emoji") || "🐟",
    stock: formData.get("stock") ?? 0,
    imageUrl: formData.get("imageUrl") ?? "",
  });
  if (!parsed.success) throw new Error("Please fill in the required fields.");
  const d = parsed.data;
  return {
    name: d.name,
    nameFr: d.nameFr,
    description: d.description,
    descriptionFr: d.descriptionFr,
    priceCents: Math.round(d.price * 100),
    unit: d.unit,
    unitFr: d.unitFr,
    category: d.category,
    emoji: d.emoji,
    stock: d.stock,
    imageUrl: d.imageUrl,
  };
}

export async function createProduct(formData: FormData) {
  if (!(await isAuthed())) throw new Error("Not authorized");
  const data = parseProduct(formData);
  await prisma.product.create({
    data: { ...data, slug: await uniqueSlug(data.name), active: true },
  });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateProduct(formData: FormData) {
  if (!(await isAuthed())) throw new Error("Not authorized");
  const id = String(formData.get("id") ?? "");
  if (!id) throw new Error("Missing product id");
  const data = parseProduct(formData);
  await prisma.product.update({ where: { id }, data });
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function toggleProductActive(formData: FormData) {
  if (!(await isAuthed())) throw new Error("Not authorized");
  const id = String(formData.get("id") ?? "");
  const active = formData.get("active") === "true";
  await prisma.product.update({ where: { id }, data: { active } });
  revalidatePath("/admin");
  revalidatePath("/");
}
