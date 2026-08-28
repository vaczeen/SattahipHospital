import { NextRequest, NextResponse } from 'next/server';
import prismaGtw from '@/lib/prismaGtw';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json(); // รับแค่ 5 หลักท้าย

    if (!code || code.length !== 5) {
      return NextResponse.json({ message: 'กรุณากรอกรหัส 5 หลัก' }, { status: 400 });
    }

    // หา user ที่ username ลงท้ายด้วย 5 หลักที่กรอก
    const employee = await prismaGtw.users.findFirst({
      where: {
        username: {
          endsWith: code, // ← เช็คแค่ 5 หลักท้าย
        },
      },
    });

    if (!employee) {
      return NextResponse.json({ message: 'รหัสไม่ถูกต้อง' }, { status: 401 });
    }

    const token = jwt.sign(
      { id: employee.id, role: 'employee' },
      process.env.SECRET as string,
      { expiresIn: '8h' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}