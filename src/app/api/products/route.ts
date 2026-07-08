import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET: Fetch all products (Seeds, Fertilizers, Pesticides combined)
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const categorySlug = url.searchParams.get('category');
    const search = url.searchParams.get('search');

    // 1. Fetch category if slug is provided
    let categoryId: number | undefined;
    if (categorySlug) {
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
      });
      if (category) {
        categoryId = category.id;
      }
    }

    // 2. Build where filter
    const whereFilter: any = {};
    if (categoryId) {
      whereFilter.categoryId = categoryId;
    }
    
    // We will do in-memory filtering for searches if they are combined,
    // or database-level text searches.
    const searchFilter = search 
      ? { name: { contains: search } }
      : {};

    const combinedFilter = { ...whereFilter, ...searchFilter };

    // 3. Fetch from all three tables
    const [seeds, fertilizers, pesticides] = await Promise.all([
      prisma.seed.findMany({
        where: combinedFilter,
        include: { category: true },
      }),
      prisma.fertilizer.findMany({
        where: combinedFilter,
        include: { category: true },
      }),
      prisma.pesticide.findMany({
        where: combinedFilter,
        include: { category: true },
      }),
    ]);

    // 4. Map and tag each item with its type
    const formattedSeeds = seeds.map((s) => ({ ...s, type: 'seed' }));
    const formattedFertilizers = fertilizers.map((f) => ({ ...f, type: 'fertilizer' }));
    const formattedPesticides = pesticides.map((p) => ({ ...p, type: 'pesticide' }));

    // 5. Combine
    const allProducts = [...formattedSeeds, ...formattedFertilizers, ...formattedPesticides];

    return NextResponse.json({ products: allProducts });
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Add new product (Admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, ...data } = body;

    if (!type || !['seed', 'fertilizer', 'pesticide'].includes(type)) {
      return NextResponse.json({ error: 'Invalid or missing product type' }, { status: 400 });
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

    let newProduct;

    if (type === 'seed') {
      newProduct = await prisma.seed.create({
        data: {
          name: data.name,
          variety: data.variety || '',
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
      newProduct = await prisma.fertilizer.create({
        data: {
          name: data.name,
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
      newProduct = await prisma.pesticide.create({
        data: {
          name: data.name,
          targetDisease: data.targetDisease || '',
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

    return NextResponse.json({ success: true, product: { ...newProduct, type } });
  } catch (error: any) {
    console.error('Product creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
