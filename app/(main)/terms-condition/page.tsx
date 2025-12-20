import TermsCard from "@/components/terms-card";
import { TermItem } from "@/types/termType";
import {
  Banknote,
  BookOpenText,
  CircleAlert,
  CircleCheck,
  LockKeyhole,
  Scale,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | Shipping Updates",
  description:
    "Read the Terms & Conditions governing the use of Shipping Updates and its digital study materials.",
};

const termsAndConditions: TermItem[] = [
  {
    title: "Digital Products",
    description:
      "All products sold on this platform are digital PDFs or books. No physical delivery is provided.",
    icon: BookOpenText,
  },
  {
    title: "Payments & Refunds",
    description:
      "Payments are processed securely via Razorpay. Due to the digital nature of products, refunds are not provided once delivery is complete.",
    icon: Banknote,
  },
  {
    title: "Intellectual Property",
    description:
      "All content belongs to Shipping Updates and may not be redistributed without permission.",
    icon: LockKeyhole,
  },
  {
    title: "Governing Law",
    description:
      "These terms are governed by Indian law and the Information Technology Act, 2000.",
    icon: Scale,
  },
  {
    title: "GDPR Rights",
    description:
      "EU users have the right to access or delete their personal data. Requests can be made via the contact page.",

    icon: ShieldCheck,
  },
  {
    title: "Important Notice",
    description:
      "By using this website, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. If you do not agree with any part of these terms, please discontinue use of the website immediately.",

    icon: CircleAlert,
  },
];

export default function TermsAndConditions() {
  const userResponsibilities = [
    "Use purchased materials for personal educational purposes only",
    "Do not share, redistribute, or resell digital products",
    "Maintain the confidentiality of your account credentials",
    "Report any technical issues or concerns promptly",
  ];

  return (
    <TermsCard
      title="Terms & Conditions"
      termsAndConditions={termsAndConditions}
      welcomeMessage={
        <>
          Welcome to <strong className="text-gray-900">Shipping Updates</strong>
          . By accessing or using this website, you agree to be bound by these
          Terms & Conditions.
        </>
      }
    >
      <PolicyList
        title="Your Responsibilities"
        items={userResponsibilities}
        icon={CircleCheck}
      />
    </TermsCard>
  );
}

// Bullet points
interface PolicyListProps {
  title: string;
  items: string[];
  icon?: LucideIcon;
}

export function PolicyList({ title, items, icon: Icon }: PolicyListProps) {
  return (
    <section className="bg-gray-50 rounded-xl p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        {Icon && <Icon className="w-6 h-6 text-emerald-600" />}
        {title}
      </h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-700">
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full mt-2 shrink-0"></span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
