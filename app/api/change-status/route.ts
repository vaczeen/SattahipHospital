import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authCheck, adminCheck } from '@/lib/inventory-utils/auth';

export async function POST(req: NextRequest) {
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

    const { id, enabled } = await req.json();

    await prisma.user.update({
      where: { id: Number(id) },
      data: { enabled: enabled },
    });

    return NextResponse.json('Update status success');
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'server error' }, { status: 500 });
  }
}
