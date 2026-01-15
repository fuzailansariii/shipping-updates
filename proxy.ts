import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/contact",
  "/developer-teams",
  "/privacy-policy",
  "/products(.*)",
  "/refund-policy",
  "/terms-condition",
  "/shipping-policy",
]);

const isAuthenticatedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/checkout(.*)",
  "/orders(.*)",
]);

const isAuthenticatedApiRoute = createRouteMatcher([
  "/api/purchase(.*)",
  "/api/download(.*)",
  "/api/orders(.*)",
  "/api/cart(.*)",
]);

const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

const isAdminApiRoute = createRouteMatcher(["/api/admin(.*)"]);

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, sessionClaims } = await auth();

  const role = sessionClaims?.role as string | undefined;
  const isAdmin = role === "admin";

  // If already logged in, redirect from auth pages
  if (isAuthRoute(req) && userId) {
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    } else {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // Protect admin routes
  if (isAdminRoute(req) || isAdminApiRoute(req)) {
    if (!userId) {
      const signInUrl = new URL("/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.url);
      return NextResponse.redirect(signInUrl);
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  //  Block admin from accessing user shopping features
  if (isAdmin && (isAuthenticatedRoute(req) || isAuthenticatedApiRoute(req))) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  //  Block admin from public routes (except homepage and about)
  const adminAllowedPublicRoutes = createRouteMatcher([
    "/",
    "/about",
    "/products",
  ]);

  if (isAdmin && isPublicRoute(req) && !adminAllowedPublicRoutes(req)) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // Protect user routes
  if ((isAuthenticatedRoute(req) || isAuthenticatedApiRoute(req)) && !userId) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect_url", req.url);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
