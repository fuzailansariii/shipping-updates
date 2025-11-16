"use client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";

export default function Home() {
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();
  return (
    <Container>
      <div className="flex justify-center h-full">
        <div className="flex flex-col items-center gap-5">
          <h1 className="text-3xl">Hello World</h1>
          {isSignedIn && (
            <Button
              type="button"
              variant="outline"
              onClick={() => signOut({ redirectUrl: "/" })}
            >
              Sign out
            </Button>
          )}
        </div>
      </div>
    </Container>
  );
}
