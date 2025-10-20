import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Tsmart Marine Marketplace",
  description: "Terms and conditions for using Tsmart Marine Marketplace",
};

export default function TermsOfUseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
