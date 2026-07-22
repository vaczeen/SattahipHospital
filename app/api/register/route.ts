import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email) {
      return NextResponse.json({ message: 'Email is required.' }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ message: 'Password is required.' }, { status: 400 });
    }

    // check email in DB
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (user) {
      return NextResponse.json({ message: 'Email already exits!!' }, { status: 400 });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    });

    return NextResponse.json('Register Successfully');
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
