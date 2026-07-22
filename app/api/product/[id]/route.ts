import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import cloudinary from 'cloudinary';

// Configure cloudinary only if we need it for delete
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const products = await prisma.product.findFirst({
      where: {
        id: Number(id),
      },
      include: {
        category: true,
        images: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, description, unit, quantity, categoryId, images } = await req.json();

    // clear image
    await prisma.image.deleteMany({
      where: {
        productId: Number(id),
      },
    });

    const product = await prisma.product.update({
      where: {
        id: Number(id),
      },
      data: {
        title: title,
        description: description,
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
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // 1.search product include images
    const product = await prisma.product.findFirst({
      where: { id: Number(id) },
      include: { images: true },
    });

    if (!product) {
      return NextResponse.json({ message: 'Product not found!!' }, { status: 400 });
    }

    // 2.Promise delete image in cloud
    const deleteImage = product.images.map(
      (image) =>
        new Promise((resolve, reject) => {
          //ลบจาก cloud
          cloudinary.v2.uploader.destroy(image.public_id, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          });
        })
    );

    await Promise.all(deleteImage);

    await prisma.product.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json('Delete Successfully');
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
