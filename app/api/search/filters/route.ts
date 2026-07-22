import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

const handleQuery = async (query: string) => {
  const products = await prisma.product.findMany({
    where: {
      title: {
        contains: query,
      },
    },
    include: {
      category: true,
      images: true,
    },
  });
  return products;
};

const handlePrice = async (priceRange: number[]) => {
  const products = await prisma.product.findMany({
    where: {
      price: {
        gte: priceRange[0],
        lte: priceRange[1],
      },
    },
    include: {
      category: true,
      images: true,
    },
  });
  return products;
};

const handleCategory = async (categoryId: (number | string)[]) => {
  const products = await prisma.product.findMany({
    where: {
      categoryId: {
        in: categoryId.map((id) => Number(id)),
      },
    },
    include: {
      category: true,
      images: true,
    },
  });
  return products;
};

export async function POST(req: NextRequest) {
  try {
    const { query, category, price } = await req.json();

    if (query) {
      const products = await handleQuery(query);
      return NextResponse.json(products);
    }
    if (category) {
      const products = await handleCategory(category);
      return NextResponse.json(products);
    }
    if (price) {
      const products = await handlePrice(price);
      return NextResponse.json(products);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
