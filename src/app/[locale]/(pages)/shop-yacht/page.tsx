import React from "react";
import ShopWithSidebar from "@/components/ShopWithSidebar";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Yachts | Tsmart Marine Marketplace",
  description: "Browse our yacht collection",
};

const ShopYachtPage = () => {
  return (
    <main>
      <ShopWithSidebar />
    </main>
  );
};

export default ShopYachtPage;
