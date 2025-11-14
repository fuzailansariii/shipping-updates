import Image from "next/image";
import { Input } from "../ui/input";
import logo from "@/public/su-logo.png";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import Link from "next/link";

export default function Card() {
  return (
    <div className="md:max-w-xl w-full h-screen flex justify-center items-center mx-auto">
      <div className="border rounded-xl md:px-15 px-5 py-20 max-w-[500px] shadow-xl mt-15 mx-1">
        {/* form title and description */}
        <div className="text-center">
          <Image
            src={logo}
            alt="shipping-updates-logo"
            height={60}
            width={60}
            className="mx-auto mb-2"
          />
          <h1 className="text-2xl mb-1 font-semibold font-roboto text-neutral-600">
            Create an account
          </h1>
          <p className="text-base font-nunito">
            Join us and unlock all features. It only takes a minute to get
            started.
          </p>
        </div>
        <div className="w-full">
          {/* Form content */}
          <form className="mt-5 flex flex-col gap-5 font-semibold font-lato">
            <div className="flex flex-col gap-4">
              <Input
                type="email"
                placeholder="Email"
                className="bg-neutral-100"
              />
              <Button
                className="w-full border"
                size={"lg"}
                variant={"secondary"}
              >
                Continue
              </Button>
            </div>
            <Separator />
            <Button variant="secondary" size={"lg"} className="border w-full">
              <span>Sign up with Google</span>
            </Button>
          </form>
          <p className="text-center mt-2 text-sm text-neutral-400">
            Already have an account?{" "}
            <Link href={"/sign-in"} className="font-bold underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
