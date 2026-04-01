import TermsCard from "@/components/terms-card";
import { TermItem } from "@/types/termType";
import {
  Info,
  Lock,
  CreditCard,
  ShieldCheck,
  Globe,
  Scale,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Shipping Updates",
  description:
    "Privacy Policy explaining how Shipping Updates collects and uses user data.",
};

export default function PrivacyPolicyPage() {
  const privacyPolicyItems: TermItem[] = [
    {
      title: "Information We Collect",
      description:
        "We collect personal information such as your name, email address, phone number, and shipping address when you place an order or create an account. This information is required to process orders, deliver products, and provide support.",
      icon: Info,
    },
    {
      title: "Authentication",
      description:
        "User authentication is handled securely through Clerk, including email login and Google OAuth. We do not store your passwords or authentication credentials.",
      icon: Lock,
    },
    {
      title: "Order & Shipping Details",
      description:
        "For physical products, we collect and use your shipping address and contact details to ensure proper delivery of orders. This information is only used for order fulfillment and customer support.",
      icon: Globe,
    },
    {
      title: "Digital Products",
      description:
        "For PDF study materials and digital downloads, we collect your email address to deliver purchase confirmations and download access. Digital product orders are non-refundable once the download link has been accessed.",
      icon: Globe,
    },
    {
      title: "Payments",
      description:
        "All payments are processed securely through Razorpay. We do not store or have access to your card details, banking information, or UPI credentials.",
      icon: CreditCard,
    },
    {
      title: "Cookies & Usage Data",
      description:
        "We may use basic cookies or analytics tools to improve user experience and website performance. No personally identifiable information is tracked for marketing purposes.",
      icon: ShieldCheck,
    },
    {
      title: "Third-Party Services",
      description:
        "We use trusted third-party services such as Clerk (authentication), Razorpay (payments), ImageKit (media), and Resend (emails). These services may process limited data as required to provide their functionality.",
      icon: Globe,
    },
    {
      title: "Data Security",
      description:
        "We take reasonable technical and organizational measures to protect your personal information. Payment data is handled exclusively by Razorpay, a PCI-DSS compliant payment processor. We do not store any card, UPI, or banking credentials on our servers.",
      icon: ShieldCheck,
    },
    {
      title: "User Rights",
      description:
        "You may contact us at shippingupdates21@gmail.com to access, update, or request deletion of your personal information. We will respond within 7 business days, subject to legal and operational requirements.",
      icon: Info,
    },
    {
      title: "Governing Law",
      description:
        "This Privacy Policy is governed by the laws of India, including the Information Technology Act, 2000.",
      icon: Scale,
    },
  ];

  //   Welcome Message
  const privacyWelcomeMessage = (
    <>
      Shipping Updates (
      <strong className="text-gray-900">https://shippingupdates.in</strong>) is
      operated by an individual based in India. This Privacy Policy explains how
      we collect, use, and protect your personal information when you use our
      website, purchase physical books or digital PDF study materials, or
      interact with our services. For any privacy-related queries, contact us at{" "}
      <strong className="text-gray-900">shippingupdates21@gmail.com</strong>.
    </>
  );

  return (
    <TermsCard
      title="Privacy Policy"
      lastUpdated="March 31, 2026"
      welcomeMessage={privacyWelcomeMessage}
      termsAndConditions={privacyPolicyItems}
    />
  );
}
