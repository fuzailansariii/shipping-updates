"use client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import ShipImage from "@/public/shipImage.jpg";
import Image from "next/image";
import Card from "@/components/card";
import CardContent from "@/components/card-content";
import Link from "next/link";

export default function Home() {
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();

  const weOffer = [
    "PDF Study Materials",
    "Exam-Oriented Content",
    "Practical Maritime Knowledge",
    "YouTube Learning Support",
  ];
  const whyChoose = [
    "Created by an active Merchant Navy officer",
    "Based on real exam experience",
    "Secure payments via Razorpay",
    "Trusted by shipping aspirants",
  ];

  return (
    <Container>
      <div className="flex flex-col mx-auto px-5 md:px-0">
        {/* Hero section */}
        <div className="mt-10 gap-5 items-center mx-auto flex flex-col">
          <h1 className="text-3xl md:text-5xl max-w-2xl text-center font-medium font-lato leading-tight">
            Empowering Future Mariners with the Right Knowledge
          </h1>
          <p className="text-lg w-full md:max-w-4xl font-roboto text-center text-secondary-dark">
            Shipping Updates is an educational platform dedicated to helping
            aspiring and professional seafarers prepare confidently for shipping
            entrance and competency exams through high-quality, exam-focused
            study materials.
          </p>
          <div className="flex justify-center items-center gap-5 font-nunito">
            <Link href={"/products"}>
              <Button variant={"default"}>Get Started</Button>
            </Link>
            <Link href={"/about"}>
              <Button variant={"outline"} className="border-none shadow-none">
                Learn More &rarr;
              </Button>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground border rounded-full px-4 py-1 shadow-sm bg-neutral-100">
            Trusted by Merchant Navy aspirants across India
          </p>
        </div>
        {/* Ship Image Section */}
        <div className="w-full mt-16 mx-auto">
          <Image
            src={ShipImage}
            alt="Ship Image"
            height={1000}
            width={1000}
            className="rounded-xl w-full object-cover shadow-md border-2 border-neutral-200 object-top-left mask-b-from-30% to-100%"
          />
        </div>

        {/* Who we are section */}
        <p className="mt-20 mx-auto text-center md:max-w-4xl tracking-tight text-lg w-full font-roboto text-secondary-dark ">
          <span className="font-bold text-black tracking-wide">
            Shipping Updates was created with a clear purpose
          </span>{" "}
          <br /> by simplifying{" "}
          <span className="text-secondary-dark font-semibold">
            Merchant Navy
          </span>{" "}
          exam preparation through structured learning and real-world insights.
        </p>

        {/* Founder Credibility */}
        <Card heading="Founder Credibility">
          {/* <Image /> */}
          <p className="text-center mt-3 text-primary-dark">
            Founded by{" "}
            <span className="italic font-semibold">Mudassir Hussain</span>,
            Second Officer in the Merchant Navy with{" "}
            <span className="font-bold font-nunito">10+ years </span> of sailing
            experience.
          </p>
        </Card>

        {/* What We Offer */}

        <Card>
          <div className="flex flex-col md:flex-row gap-5 justify-evenly">
            <CardContent heading="What We Offer" title={weOffer} />
            <CardContent
              heading="Why Choose Shipping Updates"
              title={whyChoose}
            />
          </div>
        </Card>
      </div>
    </Container>
  );
}
