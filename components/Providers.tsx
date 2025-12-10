import { ClerkProvider } from "@clerk/nextjs";
import { ImageKitProvider } from "@imagekit/next";

const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <ClerkProvider>
        <ImageKitProvider urlEndpoint={urlEndpoint}>
          {children}
        </ImageKitProvider>
      </ClerkProvider>
    </>
  );
};
