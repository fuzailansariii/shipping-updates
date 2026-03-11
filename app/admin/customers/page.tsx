import { isAdmin } from "@/lib/auth-helper";
import { db } from "@/utils/db";
import { orders } from "@/utils/db/schema";
import { Customer } from "@/stores/admin-customer-modal-store";
import { clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CustomersPage from "./customer-page";

export default async function AdminCustomers() {
  const admin = await isAdmin();
  if (!admin) redirect("/sign-in");

  let customers: Customer[] = [];

  try {
    // Step 1 — get distinct buyer IDs from orders
    const orderUsers = await db
      .selectDistinct({ userId: orders.clerkUserId })
      .from(orders);

    const userIds = orderUsers.map((o) => o.userId).filter(Boolean) as string[];

    if (userIds.length > 0) {
      // Step 2 — fetch only those users from Clerk
      const client = await clerkClient();
      const { data: users } = await client.users.getUserList({
        userId: userIds,
        limit: 50,
        orderBy: "-created_at",
      });

      customers = users.map((user) => ({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.emailAddresses[0]?.emailAddress ?? "",
        phone: user.phoneNumbers[0]?.phoneNumber ?? null,
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        lastSignInAt: user.lastSignInAt,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch customers:", error);
  }

  return <CustomersPage initialCustomers={customers} />;
}
