import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // check email
    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user || !user.enabled) {
      return NextResponse.json({ message: 'User Not found or no Enabled.' }, { status: 400 });
    }

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Password Invalid!!' }, { status: 400 });
    }

    // create payload
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.SECRET as string, { expiresIn: '1d' });

    return NextResponse.json({ payload, token });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
