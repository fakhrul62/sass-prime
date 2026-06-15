import { NextResponse } from "next/server";
import { appendLead } from "@/lib/lead-store";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const plan = typeof body?.plan === "string" ? body.plan : "macos-lifetime";

  await appendLead("checkout-intents.jsonl", {
    type: "checkout-intent",
    plan,
    amount: 59.99,
    currency: "USD",
  });

  return NextResponse.json({
    ok: true,
    message: "Checkout intent saved. Payment provider can be connected when you are ready to sell live.",
  });
}
