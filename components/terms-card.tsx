import { ReactNode } from "react";
import Container from "./container";
import { Calendar, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { TermItem } from "@/types/termType";

interface TermsCardProp {
  title: string;
  lastUpdated?: string;
  children?: ReactNode;
  welcomeMessage?: ReactNode;
  termsAndConditions?: TermItem[];
  contactTitle?: string;
  contactDescription?: string;
}

export default function TermsCard({
  title,
  lastUpdated = "December 2025",
  welcomeMessage,
  termsAndConditions,
  children,
  contactTitle = "Questions?",
  contactDescription = "If you have any questions about these terms, please don't hesitate to reach out:",
}: TermsCardProp) {
  return (
    <Container>
      <div className="max-w-4xl sm:py-16 mx-auto px-4 py-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Calendar width={16} height={16} />
          <span>Last updated: {lastUpdated}</span>
        </div>
        {/* Welcome Card */}
        {welcomeMessage && (
          <div className="mt-10 bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border-l-4 border-emerald-500">
            <p className="text-lg text-gray-700 leading-relaxed">
              {welcomeMessage}
            </p>
          </div>
        )}
        <div className="my-4">
          {termsAndConditions &&
            termsAndConditions.map((item, idx) => {
              const Icon = item.icon;

              return (
                <div key={idx} className="flex items-start gap-3 mb-4">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Icon className="w-5 h-5 text-emerald-600" />
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h2>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
        </div>
        {children}
        {/* Contact */}
        <div className="pt-6 border-t border-gray-100">
          <div className="bg-linear-to-r from-emerald-50 to-teal-50 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {contactTitle}
            </h2>
            <p className="text-gray-700 mb-4">{contactDescription}</p>
            <Link href="/contact">
              <Button variant={"default"}>
                <Mail />
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
