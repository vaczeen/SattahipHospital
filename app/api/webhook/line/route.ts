import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prisma";

function verifySignature(rawBody: string, signature: string | null): boolean {
  const secret = process.env.LINE_CHANNEL_SECRET;
  if (!secret || !signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("base64");

  // เทียบแบบ timing-safe
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  // ต้องอ่านเป็น text ดิบก่อน ห้ามใช้ req.json() เพราะ signature คำนวณจาก raw body
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature");

  if (!verifySignature(rawBody, signature)) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  try {
    const body = JSON.parse(rawBody);
    const events = body.events ?? [];

    for (const event of events) {
      if (event.type !== "postback") continue;

      const data = new URLSearchParams(event.postback.data);
      const action = data.get("action");
      const orderId = Number(data.get("orderId"));

      if (action === "shipped" && orderId) {
        // updateMany + เงื่อนไข Pending กัน race condition กรณีกดปุ่มซ้ำพร้อมกัน
        const result = await prisma.order.updateMany({
          where: { id: orderId, orderStatus: "Pending" },
          data: { orderStatus: "Shipped" },
        });

        if (result.count === 0) {
          console.warn(`⚠️ Order #${orderId} ไม่พบ หรือไม่ใช่ Pending แล้ว`);
        } else {
          console.log(`✅ Order #${orderId} อัพเดทเป็น Shipped แล้ว`);
        }
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}