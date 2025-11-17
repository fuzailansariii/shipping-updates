import { currentUser, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// check if the user is admin and return (true | false)
export async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;

  const adminEmail = process.env.ADMIN_EMAIL;
  const userEmail = user.emailAddresses[0]?.emailAddress;
  return userEmail === adminEmail;
}

// require admin access or redirect to home page
export async function requrieAdmin(): Promise<void> {
  const checkAdmin = await isAdmin();
  if (!checkAdmin) {
    redirect("/");
  }
}

// require auth or redirect to "/sign-in"
export async function requireAuth() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  return user;
}

// get the current authenticated user
export async function getCurrentUser() {
  return await currentUser();
}

// get userId (clerk userId)

export async function currentUserId() {
  const { userId } = await auth();
  return userId;
}

// check if the user is authenticated the return true or false
export async function isAuthenticated(): Promise<boolean> {
  const user = await currentUser();
  return !!user;
}

// get the admin user or redirect to the "/"
export async function isAdminUser() {
  const user = await currentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const userEmail = user.emailAddresses[0]?.emailAddress;
  const adminEmail = process.env.ADMIN_EMAIL;

  if (adminEmail !== userEmail) {
    redirect("/");
  }
  return user;
}
