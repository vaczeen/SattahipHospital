import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authCheck } from "@/lib/inventory-utils/auth";
import { notifyPendingOrder } from "@/lib/orderNotify";

export async function POST(req: NextRequest) {
  try {
    const authResult = await authCheck(req);
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status },
      );
    }
    const { user: decodedUser } = authResult;

    const { office, dept, deptcode } = await req.json();

    const userCart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(decodedUser.id),
      },
      include: { products: true },
    });

    // check cart empty
    if (!userCart || userCart.products.length === 0) {
      return NextResponse.json(
        { ok: false, message: "Cart is Empty" },
        { status: 400 },
      );
    }

    // create new order
    const order = await prisma.order.create({
      data: {
        office,
        dept,
        deptcode,
        cartTotal: userCart.cartTotal,
        orderedBy: {
          connect: { id: Number(decodedUser.id) },
        },
        products: {
          create: userCart.products.map((item) => ({
            productId: item.productId,
            count: item.count,
            price: item.price,
          })),
        },
      },
    });

    if (order.orderStatus === "Pending") {
      await notifyPendingOrder(order.id);
    }

    // update product
    const update = userCart.products.map((item) => ({
      where: {
        id: item.productId,
      },
      data: {
        quantity: { decrement: item.count },
        sold: { increment: item.count },
      },
    }));

    await Promise.all(update.map((updated) => prisma.product.update(updated)));

    await prisma.cart.deleteMany({
      where: {
        orderedById: Number(decodedUser.id),
      },
    });

    return NextResponse.json({
      ok: true,
      message:
        "ขอเบิกพัสดุสำเร็จ กรุณาพิมพ์ใบเบิกพัสดุด้านล่าง และนำไปให้เจ้าหน้าที่ IT",
      order,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await authCheck(req);
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status },
      );
    }
    const { user: decodedUser } = authResult;

    const orders = await prisma.order.findMany({
      where: { orderedById: Number(decodedUser.id) },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (orders.length === 0) {
      return NextResponse.json(
        { ok: false, message: "No Orders" },
        { status: 400 },
      );
    }

    return NextResponse.json({ ok: true, orders });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
}
