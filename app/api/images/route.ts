import { NextRequest, NextResponse } from 'next/server';
import {v2 as cloudinary} from 'cloudinary';
import { authCheck, adminCheck } from '@/lib/inventory-utils/auth';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

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

    const { image } = await req.json();

    const result = await cloudinary.uploader.upload(image, {
      public_id: `${Date.now()}`,
      resource_type: 'auto',
      folder: 'Ecom2025',
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
