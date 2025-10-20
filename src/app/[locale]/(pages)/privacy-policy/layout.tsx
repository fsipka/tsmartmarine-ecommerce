import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Tsmart Marine Marketplace",
  description: "Our privacy policy and data protection practices",
};

export default function PrivacyPolicyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
