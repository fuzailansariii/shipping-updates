import { NextRequest, NextResponse } from "next/server";
import { db } from "@/utils/db";
import { products } from "@/utils/db/schema";
import { buildProductValues, isAdmin } from "@/lib/auth-helper";
import { productSchemaProcessed } from "@/lib/validations/zod-schema";
import { nanoid } from "nanoid";
import { ZodError } from "zod";

export async function GET() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, admin access is required" },
        { status: 403 }
      );
    }

    const productData = await db.select().from(products);

    return NextResponse.json(
      { success: true, products: productData },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching PDFs", error);
    return NextResponse.json(
      { error: "Failed to fetch PDFs" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, admin access is required" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const validateData = productSchemaProcessed.safeParse(body);

    if (!validateData.success) {
      return NextResponse.json(
        {
          error: "Invalid data format",
          details: validateData.error.message ?? "Invalid Inputs",
        },
        { status: 400 }
      );
    }

    const productId = nanoid();

    // using helper function
    const productValues = buildProductValues(productId, validateData.data);

    const [newProduct] = await db
      .insert(products)
      .values(productValues)
      .returning();
    return NextResponse.json(
      {
        success: true,
        product: newProduct,
        message: `${
          validateData.data.type === "book" ? "Book" : "PDF"
        } uploaded successfully!`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error uploading product", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Invalid data format",
          details: error.message ?? "Invalid Inputs",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save Product" },
      { status: 500 }
    );
  }
}
