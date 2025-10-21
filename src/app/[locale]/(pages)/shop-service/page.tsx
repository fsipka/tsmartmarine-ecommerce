import React from "react";
import ShopServiceSidebar from "@/components/ShopServiceSidebar";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Services | Tsmart Marine Marketplace",
  description: "Browse our services collection",
};

const ShopServicePage = () => {
  return (
    <main>
      <ShopServiceSidebar />
    </main>
  );
};

export default ShopServicePage;
