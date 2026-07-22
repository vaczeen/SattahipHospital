import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authCheck } from "@/lib/inventory-utils/auth";

export async function POST(req: NextRequest) {
  try {
    const authResult = await authCheck(req);
    if (authResult.error) {
      return NextResponse.json(
        { message: authResult.error },
        { status: authResult.status },
      );
    }

    const data = await req.json();

    await prisma.$transaction(async (tx) => {
      if (Array.isArray(data)) {
        // Bulk insert
        const formattedData = data.map((item) => ({
          productName: item.productName,
          unit: item.unit,
          quantity: parseInt(item.quantity),
          vendor: item.vendor,
          receiveDate: new Date(item.receiveDate),
        }));

        // 1. Create history records
        await tx.receiveHistory.createMany({
          data: formattedData,
        });

        // 2. Update product quantities
        for (const item of data) {
          await tx.product.updateMany({
            where: { title: item.productName },
            data: {
              quantity: { increment: parseInt(item.quantity) },
            },
          });
        }
      } else {
        // Single insert
        const { productName, unit, quantity, receiveDate, vendor } = data;

        await tx.receiveHistory.create({
          data: {
            productName: productName,
            unit: unit,
            quantity: parseInt(quantity),
            vendor: vendor,
            receiveDate: new Date(receiveDate),
          },
        });

        await tx.product.updateMany({
          where: { title: productName },
          data: {
            quantity: { increment: parseInt(quantity) },
          },
        });
      }
    });

    return NextResponse.json({ message: "Create Success" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
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

    const history = await prisma.receiveHistory.findMany({
      orderBy: {
        receiveDate: "desc",
      },
    });

    return NextResponse.json(history);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
