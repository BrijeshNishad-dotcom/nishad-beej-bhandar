import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

type RouteParams = {
  params: Promise<{ id: string }>
}

// GET: Fetch product details
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const prodId = parseInt(id, 10);
    if (isNaN(prodId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const url = new URL(req.url);
    const type = url.searchParams.get('type'); // seed, fertilizer, pesticide

    if (!type || !['seed', 'fertilizer', 'pesticide'].includes(type)) {
      return NextResponse.json({ error: 'Valid product type query param is required' }, { status: 400 });
    }

    let product;
    if (type === 'seed') {
      product = await prisma.seed.findUnique({
        where: { id: prodId },
        include: { category: true },
      });
    } else if (type === 'fertilizer') {
      product = await prisma.fertilizer.findUnique({
        where: { id: prodId },
        include: { category: true },
      });
    } else {
      product = await prisma.pesticide.findUnique({
        where: { id: prodId },
        include: { category: true },
      });
    }

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ product: { ...product, type } });
  } catch (error: any) {
    console.error('Product fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// PUT: Edit product (Admin only)
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const prodId = parseInt(id, 10);
    if (isNaN(prodId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const body = await req.json();
    const { type, ...data } = body;

    if (!type || !['seed', 'fertilizer', 'pesticide'].includes(type)) {
      return NextResponse.json({ error: 'Valid product type is required' }, { status: 400 });
    }

    if (!data.name || !data.categoryId || data.price === undefined) {
      return NextResponse.json({ error: 'Name, Category, and Price are required' }, { status: 400 });
    }

    const catId = parseInt(data.categoryId, 10);
    const priceVal = parseFloat(data.price);
    const discPriceVal = (data.discountPrice !== undefined && data.discountPrice !== null && data.discountPrice !== '') 
      ? parseFloat(data.discountPrice) 
      : null;
    const stockVal = (data.stock !== undefined && data.stock !== null && data.stock !== '') 
      ? parseInt(data.stock, 10) 
      : 0;

    if (isNaN(catId) || catId <= 0) {
      return NextResponse.json({ error: 'Category ID must be a valid positive integer' }, { status: 400 });
    }
    if (isNaN(priceVal) || priceVal < 0) {
      return NextResponse.json({ error: 'Price must be a valid non-negative number' }, { status: 400 });
    }
    if (discPriceVal !== null && (isNaN(discPriceVal) || discPriceVal < 0)) {
      return NextResponse.json({ error: 'Discount Price must be a valid non-negative number' }, { status: 400 });
    }
    if (isNaN(stockVal) || stockVal < 0) {
      return NextResponse.json({ error: 'Stock must be a valid non-negative integer' }, { status: 400 });
    }

    let germinationVal = null;
    if (type === 'seed' && data.germination !== undefined && data.germination !== null && data.germination !== '') {
      germinationVal = parseFloat(data.germination);
      if (isNaN(germinationVal) || germinationVal < 0 || germinationVal > 100) {
        return NextResponse.json({ error: 'Germination rate must be a valid percentage between 0 and 100' }, { status: 400 });
      }
    }

    let updatedProduct;

    if (type === 'seed') {
      updatedProduct = await prisma.seed.update({
        where: { id: prodId },
        data: {
          name: data.name,
          nameEn: data.nameEn || null,
          variety: data.variety || '',
          varietyEn: data.varietyEn || null,
          company: data.company || '',
          cropType: data.cropType || 'Kharif',
          description: data.description || '',
          price: priceVal,
          discountPrice: discPriceVal,
          stock: stockVal,
          imageUrl: (data.imageUrl && data.imageUrl.trim() !== '') ? data.imageUrl.trim() : null,
          status: data.status || 'ACTIVE',
          germination: germinationVal,
          seedRate: data.seedRate || null,
          maturityDuration: data.maturityDuration || null,
          yield: data.yield || null,
          benefits: data.benefits || null,
          usageInstructions: data.usageInstructions || null,
          dosage: data.dosage || null,
          categoryId: catId,
        },
      });
    } else if (type === 'fertilizer') {
      updatedProduct = await prisma.fertilizer.update({
        where: { id: prodId },
        data: {
          name: data.name,
          nameEn: data.nameEn || null,
          company: data.company || '',
          weight: data.weight || '',
          price: priceVal,
          discountPrice: discPriceVal,
          stock: stockVal,
          imageUrl: (data.imageUrl && data.imageUrl.trim() !== '') ? data.imageUrl.trim() : null,
          description: data.description || '',
          status: data.status || 'ACTIVE',
          categoryId: catId,
        },
      });
    } else {
      // pesticide
      updatedProduct = await prisma.pesticide.update({
        where: { id: prodId },
        data: {
          name: data.name,
          nameEn: data.nameEn || null,
          targetDisease: data.targetDisease || '',
          targetDiseaseEn: data.targetDiseaseEn || null,
          company: data.company || '',
          price: priceVal,
          discountPrice: discPriceVal,
          stock: stockVal,
          imageUrl: (data.imageUrl && data.imageUrl.trim() !== '') ? data.imageUrl.trim() : null,
          description: data.description || '',
          status: data.status || 'ACTIVE',
          pesticideType: data.pesticideType || null,
          activeIngredient: data.activeIngredient || null,
          formulation: data.formulation || null,
          targetCrop: data.targetCrop || null,
          dosage: data.dosage || null,
          applicationMethod: data.applicationMethod || null,
          waitingPeriod: data.waitingPeriod || null,
          toxicityClass: data.toxicityClass || null,
          safetyPrecautions: data.safetyPrecautions || null,
          packSize: data.packSize || null,
          manufacturingCompany: data.manufacturingCompany || null,
          registrationNumber: data.registrationNumber || null,
          storageInstructions: data.storageInstructions || null,
          categoryId: catId,
        },
      });
    }

    return NextResponse.json({ success: true, product: { ...updatedProduct, type } });
  } catch (error: any) {
    console.error('Product update error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete product (Admin only)
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const prodId = parseInt(id, 10);
    if (isNaN(prodId)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    const url = new URL(req.url);
    const type = url.searchParams.get('type');

    if (!type || !['seed', 'fertilizer', 'pesticide'].includes(type)) {
      return NextResponse.json({ error: 'Valid product type is required in query params' }, { status: 400 });
    }

    if (type === 'seed') {
      await prisma.seed.delete({ where: { id: prodId } });
    } else if (type === 'fertilizer') {
      await prisma.fertilizer.delete({ where: { id: prodId } });
    } else {
      await prisma.pesticide.delete({ where: { id: prodId } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Product deletion error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
