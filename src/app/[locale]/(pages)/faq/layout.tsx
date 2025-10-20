import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ | Tsmart Marine Marketplace",
  description: "Frequently asked questions about Tsmart Marine Marketplace",
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
