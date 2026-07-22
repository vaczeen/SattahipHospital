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

    const { public_id } = await req.json();
    console.log(public_id);

    return new Promise((resolve) => {
      cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) {
          console.log(error);
          resolve(NextResponse.json({ message: 'Server Error' }, { status: 500 }));
        } else {
          resolve(NextResponse.json('Remove Image Success.'));
        }
      });
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server Error' }, { status: 500 });
  }
}
