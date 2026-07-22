import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { authCheck } from '@/lib/inventory-utils/auth';

export async function POST(req: NextRequest) {
  try {
    const authResult = await authCheck(req);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }
    const { user: decodedUser } = authResult;

    const { cart } = await req.json();

    const user = await prisma.user.findFirst({
      where: {
        id: Number(decodedUser.id),
      },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // check quantity
    for (const item of cart) {
      const product = await prisma.product.findUnique({
        where: { id: item.id },
        select: { quantity: true, title: true },
      });
      if (!product || item.count > product.quantity) {
        return NextResponse.json(
          {
            ok: false,
            message: `ขออภัยพัสดุ ${product?.title || 'product'} หมด, กรุณารอเจ้าหน้าที่เติมพัสดุ`,
          },
          { status: 400 }
        );
      }
    }

    // Delete old cart item
    await prisma.productOnCart.deleteMany({
      where: {
        cart: { orderedById: user.id },
      },
    });
    // Delete old cart
    await prisma.cart.deleteMany({
      where: { orderedById: user.id },
    });

    // เตรียมสินค้า
    let products = cart.map((item: any) => ({
      productId: item.id,
      count: item.count,
      price: item.price,
    }));
    // หาผลรวม
    let cartTotal = products.reduce((sum: number, item: any) => sum + item.price * item.count, 0);

    // New cart
    await prisma.cart.create({
      data: {
        products: {
          create: products,
        },
        cartTotal: cartTotal,
        orderedById: user.id,
      },
    });

    return NextResponse.json('Add Cart OK');
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'server error' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const authResult = await authCheck(req);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }
    const { user: decodedUser } = authResult;

    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(decodedUser.id),
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return NextResponse.json({ products: [], cartTotal: 0 });
    }

    return NextResponse.json({
      products: cart.products,
      cartTotal: cart.cartTotal,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await authCheck(req);
    if (authResult.error) {
      return NextResponse.json({ message: authResult.error }, { status: authResult.status });
    }
    const { user: decodedUser } = authResult;

    const cart = await prisma.cart.findFirst({
      where: {
        orderedById: Number(decodedUser.id),
      },
    });

    if (!cart) {
      return NextResponse.json({ message: 'No Cart' }, { status: 400 });
    }

    await prisma.productOnCart.deleteMany({
      where: { cartId: cart.id },
    });

    const result = await prisma.cart.deleteMany({
      where: {
        orderedById: Number(decodedUser.id),
      },
    });

    return NextResponse.json({ message: 'Empty Success', deletedCount: result.count });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'server error' }, { status: 500 });
  }
}
