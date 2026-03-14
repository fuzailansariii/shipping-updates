import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { products } from "@/utils/db/schema";
import { buildProductValues, isAdmin } from "@/lib/auth-helper";
import { isNull } from "drizzle-orm";
import { nanoid } from "nanoid";
import z from "zod";
import { backendSchema } from "@/lib/validations/product.schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { revalidateTag } from "next/cache";

export async function GET(req: NextRequest) {
  try {
    const rate = await checkRateLimit();
    if (!rate.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const pageSize = 20;
    const offset = (page - 1) * pageSize;

    const productData = await db
      .select()
      .from(products)
      .where(isNull(products.deletedAt))
      .limit(pageSize)
      .offset(offset);

    return NextResponse.json(
      {
        success: true,
        products: productData,
        page,
        pageSize,
        hasMore: productData.length === pageSize,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const rate = await checkRateLimit();
    if (!rate.success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, admin access is required" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const validateData = backendSchema.safeParse(body);

    if (!validateData.success) {
      console.error("Validation failed:", z.treeifyError(validateData.error));
      return NextResponse.json(
        { error: "Invalid data format" },
        { status: 400 },
      );
    }

    const productId = nanoid();

    // using helper function
    const productValues = buildProductValues(productId, validateData.data);

    const [newProduct] = await db
      .insert(products)
      .values(productValues)
      .returning();

    revalidateTag("products", "max");
    return NextResponse.json(
      {
        success: true,
        product: newProduct,
        message: `${
          validateData.data.type === "book" ? "Book" : "PDF"
        } uploaded successfully!`,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error uploading product", error);
    return NextResponse.json(
      { error: "Failed to save product" },
      { status: 500 },
    );
  }
}
