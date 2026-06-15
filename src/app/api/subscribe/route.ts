import { NextResponse } from "next/server";
import { appendLead, isEmail } from "@/lib/lead-store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  if (!body || !isEmail(body.email)) {
    return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
  }

  await appendLead("newsletter.jsonl", {
    type: "newsletter",
    email: body.email.trim().toLowerCase(),
  });

  return NextResponse.json({ ok: true, message: "Subscription saved." });
}
