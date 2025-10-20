import { Metadata } from "next";
import Home from "@/components/Home";

export const metadata: Metadata = {
  title: "Tsmart Marine Marketplace",
  description: "Welcome to Tsmart Marine Marketplace",
};

export default function HomePage() {
  return <Home />;
}
