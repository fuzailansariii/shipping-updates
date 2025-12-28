import { isAdmin } from "@/lib/auth-helper";
import { getUploadAuthParams } from "@imagekit/next/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // application logic to authenticate the user
    // if the user is logged in or has the necessary permissions
    // If the user is not authenticated, you can return an error response
    const admin = await isAdmin();
    if (!admin) {
      return NextResponse.json(
        { error: "Unauthorized, admin access is required" },
        { status: 403 }
      );
    }
    const { token, expire, signature } = getUploadAuthParams({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string, // Never expose this on client side
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
      expire: Math.floor(Date.now() / 1000) + 30,
    });

    return NextResponse.json({
      token,
      expire,
      signature,
      publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY,
    });
  } catch (error) {
    // console.error("Failed to authenticate imagekit");
    return NextResponse.json(
      { error: "Failed to authenticate imagekit" },
      { status: 500 }
    );
  }
}
