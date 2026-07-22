import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authCheck, adminCheck } from '@/lib/inventory-utils/auth';

export async function GET(req: NextRequest) {
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

    const user = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        enabled: true,
        office: true,
        dept: true,
        deptcode: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'server error' }, { status: 500 });
  }
}
