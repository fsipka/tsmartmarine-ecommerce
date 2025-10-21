import React from "react";
import ShopAccessorySidebar from "@/components/ShopAccessorySidebar";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Accessories | Tsmart Marine Marketplace",
  description: "Browse our accessories collection",
};

const ShopAccessoryPage = () => {
  return (
    <main>
      <ShopAccessorySidebar />
    </main>
  );
};

export default ShopAccessoryPage;
