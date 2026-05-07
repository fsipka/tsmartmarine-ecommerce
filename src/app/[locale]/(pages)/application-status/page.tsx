import ApplicationStatus from "@/components/Auth/ApplicationStatus";
import React from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Application Status | Tsmart Marine Marketplace",
  description: "Vendor application status",
};

const ApplicationStatusPage = () => {
  return (
    <main>
      <ApplicationStatus />
    </main>
  );
};

export default ApplicationStatusPage;