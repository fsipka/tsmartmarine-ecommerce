import React from "react";
import SupplierSuccess from "@/components/SupplierSuccess";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Supplier Registration Success | Tsmart Marine Marketplace",
  description: "Your supplier registration has been submitted successfully",
};

const SupplierSuccessPage = () => {
  return (
    <main>
      <SupplierSuccess />
    </main>
  );
};

export default SupplierSuccessPage;
