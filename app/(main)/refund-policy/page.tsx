import Container from "@/components/container";
import TermsCard from "@/components/terms-card";
import { TermItem } from "@/types/termType";
import { Package, Ban, AlertTriangle, Mail } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy | Shipping Updates",
  description:
    "Refund, cancellation, and replacement policy for physical and digital products sold on Shipping Updates.",
};

const refundPolicyItems: TermItem[] = [
  {
    title: "Product Types",
    description:
      "Shipping Updates offers both physical books and digital PDF products. Physical products are shipped to your provided address, while digital products are delivered instantly after successful payment.",
    icon: Package,
  },
  {
    title: "No Cancellation",
    description:
      "Once an order is placed and payment is confirmed, it cannot be cancelled or modified. Please review your cart carefully before completing the purchase. In the event of a payment failure where your amount was debited but the order was not confirmed, the amount will be automatically refunded by Razorpay within 5–7 business days.",
    icon: Ban,
  },
  {
    title: "No Refund Policy",
    description:
      "All sales are final. We do not offer refunds for completed and fulfilled orders — this applies to both physical books and digital PDF products. However, if a payment failure results in an amount being debited without order confirmation, a full refund will be processed automatically by Razorpay within 5–7 business days.",
    icon: Ban,
  },
  {
    title: "Replacement Policy (Physical Products Only)",
    description:
      "Replacement is only available for physical books that arrive defective or damaged. Email us at shippingupdates21@gmail.com within 7 days of delivery with your order ID and photo or video proof of the damage. Approved replacements are subject to stock availability and will be re-shipped at no additional cost. No cash refunds will be issued under this policy.",
    icon: AlertTriangle,
  },
  {
    title: "Digital Products",
    description:
      "Digital products are delivered instantly and cannot be returned, replaced, or refunded once access has been provided.",
    icon: Package,
  },
  {
    title: "Contact Support",
    description:
      "For any order-related issues, replacement requests, or payment concerns, contact us at shippingupdates21@gmail.com - We aim to respond within 2 business days. Please include your order ID and a description of the issue in your message.",
    icon: Mail,
  },
];

const refundWelcomeMessage = (
  <>
    This Refund & Cancellation Policy outlines the terms under which{" "}
    <strong className="text-gray-900">Shipping Updates</strong> (
    <strong className="text-gray-900">https://shippingupdates.in</strong>),
    operated by an individual based in Uttar Pradesh, India, handles
    cancellations, refunds, and replacements for physical books and digital PDF
    study materials. For queries, email us at{" "}
    <strong className="text-gray-900">shippingupdates21@gmail.com</strong>.
  </>
);

export default function RefundPolicyPage() {
  return (
    <TermsCard
      title="Refund & Cancellation Policy"
      lastUpdated="March 31, 2026"
      welcomeMessage={refundWelcomeMessage}
      termsAndConditions={refundPolicyItems}
      contactTitle="Need Help?"
      contactDescription="For refund-related questions, please contact us:"
    />
  );
}
