import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supplier Registration | Tsmart Marine Marketplace",
  description: "Register as a supplier on Tsmart Marine Marketplace",
};

export default function SupplierRegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
