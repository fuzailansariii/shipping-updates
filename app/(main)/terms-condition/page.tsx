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
    title: "Products",
    description:
      "Shipping Updates offers both physical books and digital PDF study materials related to shipping and merchant navy entrance exams. Physical products are delivered via courier, while digital products are made available instantly after successful payment.",
    icon: BookOpenText,
  },
  {
    title: "Orders & Payments",
    description:
      "All orders must be paid in full at the time of purchase. Payments are processed securely through Razorpay. Once an order is placed, it cannot be cancelled or modified.",
    icon: Banknote,
  },
  {
    title: "Shipping & Delivery",
    description:
      "Physical products are shipped to the address provided at checkout. Delivery typically takes 5–10 business days within India, depending on your location and the courier partner. We are not responsible for delays caused by incorrect addresses or courier disruptions. Shipping is currently available within India only.",
    icon: CircleCheck,
  },
  {
    title: "Cancellation & Refund Policy",
    description:
      "All sales are final. Orders cannot be cancelled or modified once placed. Refunds are not applicable for digital PDF products once the download link has been accessed. For physical books, please refer to our Replacement Policy below. In case of payment failure where the amount is debited but the order is not confirmed, the amount will be automatically refunded by Razorpay within 5–7 business days.",
    icon: CircleAlert,
  },
  {
    title: "Replacement Policy",
    description:
      "Replacement is only applicable for physical products that arrive defective or damaged. To request a replacement, contact us at shippingupdates21@gmail.com within 7 days of delivery with your order ID and photo/video proof of the damage. Replacements are subject to stock availability. No cash refunds will be issued.",
    icon: ShieldCheck,
  },
  {
    title: "Intellectual Property",
    description:
      "All content, including books, PDFs, and study materials, is the intellectual property of Shipping Updates. Users are strictly prohibited from copying, sharing, redistributing, or reselling any content without prior permission.",
    icon: LockKeyhole,
  },
  {
    title: "User Accounts",
    description:
      "Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.",
    icon: LockKeyhole,
  },
  {
    title: "Limitation of Liability",
    description:
      "Shipping Updates shall not be held liable for any indirect, incidental, or consequential damages arising from the use of the website or products.",
    icon: ShieldCheck,
  },
  {
    title: "Governing Law",
    description:
      "These Terms & Conditions are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Uttar Pradesh, India.",
    icon: Scale,
  },
];

export default function TermsAndConditions() {
  const userResponsibilities = [
    "Use purchased materials for personal educational purposes only",
    "Do not share, redistribute, or resell digital products",
    "Maintain the confidentiality of your account credentials",
    "Report any technical issues or concerns promptly",
    "Provide accurate shipping and contact details while placing orders",
  ];

  return (
    <TermsCard
      title="Terms & Conditions"
      lastUpdated="March 31, 2026"
      termsAndConditions={termsAndConditions}
      welcomeMessage={
        <>
          Welcome to <strong className="text-gray-900">Shipping Updates</strong>{" "}
          (<strong className="text-gray-900">https://shippingupdates.in</strong>
          ), operated by an individual based in India. By accessing or using
          this website, you agree to be bound by these Terms & Conditions,
          including policies related to orders, payments, shipping, and usage of
          our study materials. For any queries, reach us at{" "}
          <strong className="text-gray-900">shippingupdates21@gmail.com</strong>
          .
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
