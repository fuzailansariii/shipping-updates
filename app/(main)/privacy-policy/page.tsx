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
        "We collect only your email address for authentication and verification purposes. No additional personal data is collected.",
      icon: Info,
    },
    {
      title: "Authentication",
      description:
        "User authentication is handled by Clerk, including email login and Google OAuth. We do not store passwords or OAuth credentials.",
      icon: Lock,
    },
    {
      title: "Payments",
      description:
        "Payments are processed securely through Razorpay. We do not store payment card or banking details.",
      icon: CreditCard,
    },
    {
      title: "Cookies & Tracking",
      description:
        "We do not use cookies, analytics, or tracking technologies.",
      icon: ShieldCheck,
    },
    {
      title: "Third-Party Services",
      description:
        "We use trusted services such as Clerk (authentication), Razorpay (payments), and Resend (transactional emails).",
      icon: Globe,
    },
    {
      title: "Governing Law",
      description:
        "This policy is governed by Indian law and the Information Technology Act, 2000.",
      icon: Scale,
    },
  ];

  //   Welcome Message
  const privacyWelcomeMessage = (
    <>
      Shipping Updates (
      <strong className="text-gray-900">https://shippingupdates.in</strong>) is
      operated by an individual based in Uttar Pradesh, India. This Privacy
      Policy explains how we collect and use personal information.
    </>
  );

  return (
    <TermsCard
      title="Privacy Policy"
      lastUpdated="December 2025"
      welcomeMessage={privacyWelcomeMessage}
      termsAndConditions={privacyPolicyItems}
    />
  );
}
