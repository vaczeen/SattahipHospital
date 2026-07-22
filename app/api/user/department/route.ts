import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authCheck } from '@/lib/inventory-utils/auth';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authCheck(req);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const { office, dept, deptcode, orderId } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: {
        id: Number(orderId),
      },
      data: {
        office,
        dept,
        deptcode,
      },
    });

    return NextResponse.json({ ok: true, message: 'Office Update Success', order: updatedOrder });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'server error' }, { status: 500 });
  }
}
