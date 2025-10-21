import React from "react";
import ShopSparePartSidebar from "@/components/ShopSparePartSidebar";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Spare Parts | Tsmart Marine Marketplace",
  description: "Browse our spare parts collection",
};

const ShopSparePartPage = () => {
  return (
    <main>
      <ShopSparePartSidebar />
    </main>
  );
};

export default ShopSparePartPage;
