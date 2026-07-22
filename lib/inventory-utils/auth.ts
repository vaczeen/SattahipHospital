import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function authCheck(req: NextRequest) {
  try {
    const headerToken = req.headers.get('authorization');
    if (!headerToken) {
      return { error: 'No token, Authorization', status: 401 };
    }

    const token = headerToken.split(' ')[1];
    const decode = jwt.verify(token, process.env.SECRET as string) as any;

    const user = await prisma.user.findFirst({
      where: { email: decode.email },
    });

    if (!user || !user.enabled) {
      return { error: 'This account cannot access.', status: 400 };
    }

    return { user: decode };
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return { error: 'Token expired, please login again', status: 401 };
    }
    return { error: 'Token Invalid', status: 401 };
  }
}

export async function adminCheck(email: string) {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { email: email },
    });

    if (!adminUser || adminUser.role !== 'admin') {
      return { error: 'Access Denied: Admin Only', status: 403 };
    }

    return { adminUser };
  } catch (error) {
    console.log(error);
    return { error: 'Error Admin access denied', status: 500 };
  }
}