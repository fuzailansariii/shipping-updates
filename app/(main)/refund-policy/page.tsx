import Container from "@/components/container";
import TermsCard from "@/components/terms-card";
import { TermItem } from "@/types/termType";
import { Package, Ban, AlertTriangle, Mail } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy | Shipping Updates",
  description:
    "Refund and cancellation policy for digital products sold on Shipping Updates.",
};

const refundPolicyItems: TermItem[] = [
  {
    title: "Digital Products",
    description:
      "All products are delivered electronically. No physical goods are shipped.",
    icon: Package,
  },
  {
    title: "Refunds",
    description:
      "Due to the nature of digital products, all sales are final. Once a product is delivered, refunds or cancellations are not permitted.",
    icon: Ban,
  },
  {
    title: "Exceptions",
    description:
      "Refunds may be issued only if required by applicable law or in case of a proven technical error preventing access to the purchased product.",
    icon: AlertTriangle,
  },
  {
    title: "Contact",
    description:
      "For refund-related concerns, please visit https://shippingupdates.in/contact.",
    icon: Mail,
  },
];

const refundWelcomeMessage = (
  <>
    This Refund & Cancellation Policy explains how refunds are handled for
    digital products sold on <strong>Shipping Updates</strong>.
  </>
);

export default function RefundPolicyPage() {
  return (
    <TermsCard
      title="Refund & Cancellation Policy"
      lastUpdated="December 2025"
      welcomeMessage={refundWelcomeMessage}
      termsAndConditions={refundPolicyItems}
      contactTitle="Need Help?"
      contactDescription="For refund-related questions, please contact us:"
    />
  );
}
