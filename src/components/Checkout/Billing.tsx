"use client";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { BillingDetails } from "@/types/order";
import { getSession } from "@/lib/auth/session";

interface BillingProps {
  billingDetails: BillingDetails;
  onChange: (details: BillingDetails) => void;
}

const Billing: React.FC<BillingProps> = ({ billingDetails, onChange }) => {
  const t = useTranslations();

  // Pre-fill from session on mount
  useEffect(() => {
    const session = getSession();
    if (session && session.user) {
      const nameParts = session.user.name?.split(' ') || [];
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      onChange({
        ...billingDetails,
        firstName: billingDetails.firstName || firstName,
        lastName: billingDetails.lastName || lastName,
        email: billingDetails.email || session.user.email || '',
        companyName: billingDetails.companyName || session.user.companyName || '',
      });
    }
  }, []);

  const handleChange = (field: keyof BillingDetails, value: string) => {
    onChange({
      ...billingDetails,
      [field]: value,
    });
  };

  return (
    <div className="mt-9">
      <h2 className="font-medium text-dark text-xl sm:text-2xl mb-5.5">
        {t("checkout.billingDetails")}
      </h2>

      <div className="bg-white shadow-1 rounded-[10px] p-4 sm:p-8.5">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
          <div className="w-full">
            <label htmlFor="firstName" className="block mb-2.5">
              {t("checkout.firstName")} <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="firstName"
              id="firstName"
              value={billingDetails.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              placeholder={t("checkout.firstNamePlaceholder")}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="w-full">
            <label htmlFor="lastName" className="block mb-2.5">
              {t("checkout.lastName")} <span className="text-red">*</span>
            </label>

            <input
              type="text"
              name="lastName"
              id="lastName"
              value={billingDetails.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              placeholder={t("checkout.lastNamePlaceholder")}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="companyName" className="block mb-2.5">
            Company Name
          </label>

          <input
            type="text"
            name="companyName"
            id="companyName"
            value={billingDetails.companyName || ''}
            onChange={(e) => handleChange('companyName', e.target.value)}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="country" className="block mb-2.5">
            {t("checkout.country")} <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="country"
            id="country"
            value={billingDetails.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder={t("checkout.countryPlaceholder")}
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="streetAddress" className="block mb-2.5">
            {t("checkout.address")} <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="streetAddress"
            id="streetAddress"
            value={billingDetails.streetAddress}
            onChange={(e) => handleChange('streetAddress', e.target.value)}
            placeholder={t("checkout.addressPlaceholder")}
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />

          <div className="mt-5">
            <input
              type="text"
              name="apartment"
              id="apartment"
              value={billingDetails.apartment || ''}
              onChange={(e) => handleChange('apartment', e.target.value)}
              placeholder={t("checkout.addressOptionalPlaceholder")}
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>

        <div className="mb-5">
          <label htmlFor="city" className="block mb-2.5">
            {t("checkout.city")} <span className="text-red">*</span>
          </label>

          <input
            type="text"
            name="city"
            id="city"
            value={billingDetails.city}
            onChange={(e) => handleChange('city', e.target.value)}
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="state" className="block mb-2.5">
            State
          </label>

          <input
            type="text"
            name="state"
            id="state"
            value={billingDetails.state || ''}
            onChange={(e) => handleChange('state', e.target.value)}
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5">
          <label htmlFor="phone" className="block mb-2.5">
            {t("checkout.phone")} <span className="text-red">*</span>
          </label>

          <input
            type="tel"
            name="phone"
            id="phone"
            value={billingDetails.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>

        <div className="mb-5.5">
          <label htmlFor="email" className="block mb-2.5">
            {t("checkout.email")} <span className="text-red">*</span>
          </label>

          <input
            type="email"
            name="email"
            id="email"
            value={billingDetails.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
          />
        </div>
      </div>
    </div>
  );
};

export default Billing;
