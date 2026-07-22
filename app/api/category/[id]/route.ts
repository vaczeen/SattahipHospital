import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authCheck, adminCheck } from '@/lib/inventory-utils/auth';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await authCheck(req);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }

    const { user: decodedUser } = authResult;

    const adminResult = await adminCheck(decodedUser.email);
    if (adminResult.error) {
      return NextResponse.json({ message: adminResult.error }, { status: adminResult.status });
    }

    const { id } = await params;
    const category = await prisma.category.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
