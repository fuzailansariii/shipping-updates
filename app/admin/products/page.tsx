import { unstable_cache } from "next/cache";
import ProductsPage from "./product-page";
import { Product, products } from "@/utils/db/schema";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/utils/db";
import { isAdmin } from "@/lib/auth-helper";
import { redirect } from "next/navigation";

const getProducts = unstable_cache(
  async (type: string, status: string, page: number) => {
    const conditions = [isNull(products.deletedAt)];

    if (type === "book" || type === "pdf") {
      conditions.push(eq(products.type, type));
    }
    if (status === "active") {
      conditions.push(eq(products.isActive, true));
    } else if (status === "inactive") {
      conditions.push(eq(products.isActive, false));
    }

    return await db
      .select()
      .from(products)
      .where(and(...conditions))
      .limit(20)
      .offset((page - 1) * 20);
  },
  ["admin-products"],
  {
    revalidate: 60,
    tags: ["products"],
  },
);

export default async function AdminProducts({
  searchParams,
}: {
  searchParams: Promise<{
    type?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const admin = await isAdmin();
  if (!admin) redirect("/unauthorized");

  const { page, status, type } = await searchParams;
  const pageNumber = Number(page) || 1;

  let initialProducts: Product[] = [];
  let fetchError: string | null = null;

  try {
    initialProducts = await getProducts(
      type ?? "all",
      status ?? "all",
      pageNumber,
    );
  } catch (error) {
    console.error("Failed to fetch products:", error);
    fetchError = "Failed to load products. Please try again.";
  }

  return (
    <ProductsPage
      initialProducts={initialProducts}
      error={fetchError}
      currentPage={pageNumber}
    />
  );
}
