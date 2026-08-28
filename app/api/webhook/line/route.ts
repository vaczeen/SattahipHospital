import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const events = body.events ?? [];

    for (const event of events) {
      // รับเฉพาะ postback event
      if (event.type !== "postback") continue;

      const data = new URLSearchParams(event.postback.data);
      const action = data.get("action");
      const orderId = Number(data.get("orderId"));

      if (action === "shipped" && orderId) {
        // เช็คก่อนว่า order ยังเป็น Pending อยู่ไหม
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          select: { orderStatus: true },
        });

        if (!order) {
          console.warn(`⚠️ ไม่พบ Order #${orderId}`);
          continue;
        }

        if (order.orderStatus !== "Pending") {
          console.warn(`⚠️ Order #${orderId} ไม่ใช่ Pending แล้ว (${order.orderStatus})`);
          continue;
        }

        // อัพเดท status เป็น Shipped
        await prisma.order.update({
          where: { id: orderId },
          data: { orderStatus: "Shipped" },
        });

        console.log(`✅ Order #${orderId} อัพเดทเป็น Shipped แล้ว`);
      }
    }

    // LINE ต้องการ 200 response เสมอ ไม่งั้นจะ retry
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    // ส่ง 200 กลับเสมอ เพื่อไม่ให้ LINE retry
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}