import React from "react";
import OrderSuccess from "@/components/OrderSuccess";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Order Success | Tsmart Marine Marketplace",
  description: "Your order has been placed successfully",
};

const OrderSuccessPage = () => {
  return (
    <main>
      <OrderSuccess />
    </main>
  );
};

export default OrderSuccessPage;
