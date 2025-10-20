import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy | Tsmart Marine Marketplace",
  description: "Our refund and return policy",
};

export default function RefundPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
