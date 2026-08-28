import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authCheck } from "@/lib/inventory-utils/auth";

export async function PUT(req: NextRequest) {
  try {
    const authResult = await authCheck(req);
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status },
      );
    }

    const { orderId, orderStatus } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        products: true, // ← ต้องการรายการ products เพื่อคืน quantity
      },
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (orderStatus === "Cancelled" && order.orderStatus !== "Cancelled") {
      await Promise.all(
        order.products.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity: { increment: item.count }, // ← คืน quantity
              sold: { decrement: item.count }, // ← ลด sold กลับด้วย
            },
          }),
        ),
      );
    }

    // ถ้าเคย Cancelled แล้วเปลี่ยนกลับมา → หัก quantity ใหม่
    if (order.orderStatus === "Cancelled" && orderStatus !== "Cancelled") {
      await Promise.all(
        order.products.map((item) =>
          prisma.product.update({
            where: { id: item.productId },
            data: {
              quantity: { decrement: item.count }, // ← หัก quantity คืน
              sold: { increment: item.count }, // ← เพิ่ม sold กลับด้วย
            },
          }),
        ),
      );
    }

    const orderUpdate = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        orderStatus: orderStatus,
      },
    });

    return NextResponse.json(orderUpdate);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
