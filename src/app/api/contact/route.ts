import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { normalizeLocale } from "@/lib/i18n/config";

const bodySchema = z.object({
  name: z.string().trim().min(1).max(120),
  company: z.string().trim().max(160).optional().default(""),
  phone: z.string().trim().min(5).max(40),
  email: z.string().trim().email().max(200).or(z.literal("")).optional().default(""),
  message: z.string().trim().min(1).max(2000),
});

export async function POST(request: Request) {
  const locale = normalizeLocale(request.headers.get("accept-language"));

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form." }, { status: 400 });
  }
  const { name, company, phone, email, message } = parsed.data;

  await prisma.enquiry.create({
    data: { name, company, phone, email, message, locale },
  });

  return NextResponse.json({ ok: true });
}
