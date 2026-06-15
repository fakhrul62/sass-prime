import { NextResponse } from "next/server";
import { appendLead, isEmail } from "@/lib/lead-store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || typeof body.name !== "string" || !isEmail(body.email) || typeof body.company !== "string") {
    return NextResponse.json({ message: "Please provide your name, work email, and company." }, { status: 400 });
  }

  await appendLead("demo-requests.jsonl", {
    type: "demo",
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    company: body.company.trim(),
  });

  return NextResponse.json({ ok: true, message: "Demo request received." });
}
