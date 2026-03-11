import { isAdmin } from "@/lib/auth-helper";
import { db } from "@/utils/db";
import { Product, products } from "@/utils/db/schema";
import { isNull } from "drizzle-orm";
import { redirect } from "next/navigation";
import React from "react";
import ProductsPage from "./product-page";

export default async function AdminProducts() {
  const admin = await isAdmin();
  if (!admin) redirect("/sign-in");

  let initialProducts: Product[] = [];

  try {
    initialProducts = await db
      .select()
      .from(products)
      .where(isNull(products.deletedAt));
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }
  return <ProductsPage initialProducts={initialProducts} />;
}
