import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ count: string }> },
) {
  try {
    const { count } = await params;
    const products = await prisma.product.findMany({
      take: parseInt(count),
      orderBy: { id: "asc"},
      include: {
        category: true,
        images: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
