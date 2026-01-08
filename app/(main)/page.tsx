"use client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { useClerk, useUser } from "@clerk/nextjs";
import ShipImage from "@/public/shipImage.jpg";
import Image from "next/image";
import Card from "@/components/card";
import CardContent from "@/components/card-content";
import Link from "next/link";
import { CheckCircle2, BookOpen, Shield, Users, Award } from "lucide-react";

export default function Home() {
  const { signOut } = useClerk();
  const { isSignedIn } = useUser();

  const weOffer = [
    "BOOK and PDF Study Materials",
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

  const howItWorks = [
    {
      step: "1",
      title: "Browse Materials",
      description:
        "Explore our curated collection of exam-focused study materials",
      icon: BookOpen,
    },
    {
      step: "2",
      title: "Secure Purchase",
      description:
        "Buy with confidence through our secure Razorpay payment system",
      icon: Shield,
    },
    {
      step: "3",
      title: "Start Learning",
      description:
        "Access your materials instantly and prepare with expert guidance",
      icon: Award,
    },
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
              <Button
                variant={"default"}
                size="lg"
                className="shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                Get Started
              </Button>
            </Link>
            <Link href={"/about"}>
              <Button
                variant={"outline"}
                className="border-none shadow-none hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                Learn More &rarr;
              </Button>
            </Link>
          </div>
          <div className="flex items-center cursor-pointer gap-2 text-sm text-muted-foreground border rounded-full px-4 py-2 shadow-sm bg-neutral-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <p>Trusted by Merchant Navy aspirants across India</p>
          </div>
        </div>

        {/* Ship Image Section */}
        <div className="w-full mt-16 mx-auto">
          <Image
            src={ShipImage}
            alt="Merchant Navy Ship"
            height={1000}
            width={1000}
            priority
            className="rounded-xl w-full object-cover shadow-md border-2 border-neutral-200"
          />
        </div>

        {/* Who we are section */}
        <p className="mt-20 mx-auto text-center md:max-w-4xl tracking-tight text-lg w-full font-roboto text-secondary-dark">
          <span className="font-bold text-black tracking-wide">
            Shipping Updates was created with a clear purpose
          </span>{" "}
          <br /> by simplifying{" "}
          <span className="text-secondary-dark font-semibold">
            Merchant Navy
          </span>{" "}
          exam preparation through structured learning and real-world insights.
        </p>

        {/* How It Works Section */}
        <div className="mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 font-lato">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <item.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-sm font-semibold text-blue-600 mb-2">
                  STEP {item.step}
                </div>
                <h3 className="text-xl font-bold mb-3 font-nunito">
                  {item.title}
                </h3>
                <p className="text-secondary-dark">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Founder Credibility */}
        <Card heading="Founder Credibility">
          <p className="text-center mt-3 text-primary-dark">
            Founded by{" "}
            <span className="italic font-semibold">Mudassir Hussain</span>,
            Second Officer in the Merchant Navy with{" "}
            <span className="font-bold font-nunito">15+ years</span> of sailing
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

        {/* Social Proof / Stats Section */}
        <div className="mt-16 mb-12">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
              <div className="text-secondary-dark">
                Years of Maritime Experience
              </div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-secondary-dark">Exam-Focused Content</div>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-secondary-dark">Material Access</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="mt-12 mb-16 text-center bg-linear-to-r from-blue-50 to-neutral-50 rounded-xl p-8 md:p-12 border shadow-sm">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 font-lato">
            Ready to Ace Your Maritime Exams?
          </h2>
          <p className="text-lg text-secondary-dark mb-6 max-w-2xl mx-auto">
            Join the community of successful maritime professionals who trusted
            Shipping Updates for their preparation.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              className="shadow-md hover:shadow-lg cursor-pointer transition-all"
            >
              Explore Study Materials
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
