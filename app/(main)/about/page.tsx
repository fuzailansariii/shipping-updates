"use client";
import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Card from "@/components/card";
import CardContent from "@/components/card-content";
import Link from "next/link";
import ShipImage from "@/public/shipImage.jpg";

export default function AboutPage() {
  const ourMission = [
    "Provide exam-focused study materials for maritime professionals",
    "Bridge the gap between theoretical knowledge and practical application",
    "Support continuous learning in the shipping industry",
    "Make quality maritime education accessible to all aspirants",
  ];

  const ourValues = [
    "Excellence in maritime education",
    "Authenticity from real-world experience",
    "Commitment to student success",
    "Integrity in content and service delivery",
  ];

  return (
    <Container>
      <div className="flex flex-col mx-auto px-5 md:px-0">
        {/* Hero Section */}
        <div className="mt-10 gap-5 items-center mx-auto flex flex-col">
          <h1 className="text-4xl md:text-6xl max-w-3xl text-center font-medium font-lato leading-tight">
            About Shipping Updates
          </h1>
          <p className="text-lg w-full md:max-w-4xl font-roboto text-center text-secondary-dark">
            Your trusted partner in Merchant Navy exam preparation, built by
            mariners for mariners.
          </p>
        </div>

        {/* Image Section */}
        <div className="w-full mt-12 mx-auto">
          <Image
            src={ShipImage}
            alt="Maritime Professional"
            height={1000}
            width={1000}
            className="rounded-xl w-full object-cover shadow-md border-2 border-neutral-200 object-center max-h-96"
          />
        </div>

        {/* Our Story Section */}
        <div className="mt-20 mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-6 font-lato">
            Our Story
          </h2>
          <div className="space-y-4 text-lg font-roboto text-secondary-dark leading-relaxed">
            <p>
              Shipping Updates was born from a simple observation: aspiring
              seafarers needed better, more focused resources to succeed in
              their Merchant Navy exams. Having spent over a decade sailing the
              world's oceans, our founder Mudassir Hussain understood firsthand
              the challenges faced by maritime students and professionals
              preparing for competency examinations.
            </p>
            <p>
              What started as sharing notes with fellow officers evolved into a
              mission to create comprehensive, exam-oriented study materials
              that reflect real-world maritime operations. Every PDF, every
              video, and every piece of content is crafted with the same rigor
              and attention to detail required on the high seas.
            </p>
            <p>
              Today, Shipping Updates serves hundreds of maritime aspirants
              across India, helping them navigate their journey from classroom
              to chartroom with confidence and competence.
            </p>
          </div>
        </div>

        {/* Founder Section */}
        <Card heading="Meet the Founder">
          <div className="mt-6 space-y-4 text-center">
            <h3 className="text-2xl font-semibold font-nunito">
              Mudassir Hussain
            </h3>
            <p className="text-lg text-secondary-dark font-roboto">
              Second Officer, Merchant Navy
            </p>
            <div className="max-w-3xl mx-auto space-y-3 text-secondary-dark">
              <p>
                With over 15 years of active sailing experience, Mudassir brings
                authentic maritime expertise to every study material. His
                journey from cadet to officer has given him unique insights into
                what it takes to succeed in shipping examinations and onboard
                operations.
              </p>
              <p>
                Passionate about mentoring the next generation of mariners,
                Mudassir combines his practical shipboard experience with a deep
                understanding of examination requirements to create content that
                truly prepares students for their maritime careers.
              </p>
            </div>
          </div>
        </Card>

        {/* Mission and Values */}
        <Card>
          <div className="flex flex-col md:flex-row gap-3 justify-evenly">
            <CardContent heading="Our Mission" title={ourMission} />
            <CardContent heading="Our Values" title={ourValues} />
          </div>
        </Card>

        {/* What Makes Us Different */}
        <div className="mt-16 mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-8 font-lato">
            What Makes Us Different
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-3 font-nunito">
                Real Experience
              </h3>
              <p className="text-secondary-dark">
                Content created by an active seafarer who understands both the
                theory and practice of modern maritime operations.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-3 font-nunito">
                Exam-Focused
              </h3>
              <p className="text-secondary-dark">
                Every material is designed with examination patterns and
                requirements in mind, maximizing your study efficiency.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-3 font-nunito">
                Continuously Updated
              </h3>
              <p className="text-secondary-dark">
                Materials are regularly reviewed and updated to reflect the
                latest industry standards and examination trends.
              </p>
            </div>
            <div className="p-6 border rounded-lg shadow-sm bg-white">
              <h3 className="text-xl font-semibold mb-3 font-nunito">
                Community Support
              </h3>
              <p className="text-secondary-dark">
                Join a growing community of maritime professionals and aspirants
                supporting each other's success.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 mb-16 text-center space-y-6">
          <h2 className="text-3xl font-bold font-lato">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-secondary-dark max-w-2xl mx-auto">
            Join hundreds of successful maritime professionals who trusted
            Shipping Updates for their exam preparation.
          </p>
          <div className="flex justify-center items-center gap-5 font-nunito">
            <Link href="/products">
              <Button variant="default" size="lg">
                Browse Study Materials
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" size="lg">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
