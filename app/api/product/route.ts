import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { title, description, price, unit, quantity, categoryId, images } = await req.json();

    const product = await prisma.product.create({
      data: {
        title: title,
        description: description,
        price: parseInt(price),
        unit: unit,
        quantity: parseInt(quantity),
        categoryId: parseInt(categoryId),
        images: {
          create: images.map((item: any) => ({
            asset_id: item.asset_id,
            public_id: item.public_id,
            url: item.url,
            secure_url: item.secure_url,
          })),
        },
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
