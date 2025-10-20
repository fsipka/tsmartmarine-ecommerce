"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ShippingDetails } from "@/types/order";

interface ShippingProps {
  shippingDetails: ShippingDetails | null;
  onChange: (details: ShippingDetails | null) => void;
  useDifferentAddress: boolean;
  onToggle: (use: boolean) => void;
}

const Shipping: React.FC<ShippingProps> = ({
  shippingDetails,
  onChange,
  useDifferentAddress,
  onToggle,
}) => {
  const t = useTranslations();

  const handleChange = (field: keyof ShippingDetails, value: string) => {
    if (!shippingDetails) {
      onChange({
        firstName: '',
        lastName: '',
        country: '',
        streetAddress: '',
        city: '',
      });
      return;
    }

    onChange({
      ...shippingDetails,
      [field]: value,
    });
  };

  const handleToggle = () => {
    const newValue = !useDifferentAddress;
    onToggle(newValue);

    if (!newValue) {
      onChange(null);
    } else {
      onChange({
        firstName: '',
        lastName: '',
        country: '',
        streetAddress: '',
        city: '',
      });
    }
  };

  return (
    <div className="bg-white shadow-1 rounded-[10px] mt-7.5">
      <div
        onClick={handleToggle}
        className="cursor-pointer flex items-center gap-2.5 font-medium text-lg text-dark py-5 px-5.5"
      >
        {t("checkout.shippingAddress")}?
        <svg
          className={`fill-current ease-out duration-200 ${
            useDifferentAddress && "rotate-180"
          }`}
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.06103 7.80259C4.30813 7.51431 4.74215 7.48092 5.03044 7.72802L10.9997 12.8445L16.9689 7.72802C17.2572 7.48092 17.6912 7.51431 17.9383 7.80259C18.1854 8.09088 18.1521 8.5249 17.8638 8.772L11.4471 14.272C11.1896 14.4927 10.8097 14.4927 10.5523 14.272L4.1356 8.772C3.84731 8.5249 3.81393 8.09088 4.06103 7.80259Z"
            fill=""
          />
        </svg>
      </div>

      {useDifferentAddress && shippingDetails && (
        <div className="p-4 sm:p-8.5">
          <div className="flex flex-col lg:flex-row gap-5 sm:gap-8 mb-5">
            <div className="w-full">
              <label htmlFor="shipping-firstName" className="block mb-2.5">
                {t("checkout.firstName")} <span className="text-red">*</span>
              </label>
              <input
                type="text"
                id="shipping-firstName"
                value={shippingDetails.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                placeholder={t("checkout.firstNamePlaceholder")}
                required
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>

            <div className="w-full">
              <label htmlFor="shipping-lastName" className="block mb-2.5">
                {t("checkout.lastName")} <span className="text-red">*</span>
              </label>
              <input
                type="text"
                id="shipping-lastName"
                value={shippingDetails.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                placeholder={t("checkout.lastNamePlaceholder")}
                required
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="shipping-companyName" className="block mb-2.5">
              Company Name
            </label>
            <input
              type="text"
              id="shipping-companyName"
              value={shippingDetails.companyName || ''}
              onChange={(e) => handleChange('companyName', e.target.value)}
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="shipping-country" className="block mb-2.5">
              {t("checkout.country")} <span className="text-red">*</span>
            </label>
            <input
              type="text"
              id="shipping-country"
              value={shippingDetails.country}
              onChange={(e) => handleChange('country', e.target.value)}
              placeholder={t("checkout.countryPlaceholder")}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="shipping-streetAddress" className="block mb-2.5">
              {t("checkout.address")} <span className="text-red">*</span>
            </label>
            <input
              type="text"
              id="shipping-streetAddress"
              value={shippingDetails.streetAddress}
              onChange={(e) => handleChange('streetAddress', e.target.value)}
              placeholder={t("checkout.addressPlaceholder")}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />

            <div className="mt-5">
              <input
                type="text"
                id="shipping-apartment"
                value={shippingDetails.apartment || ''}
                onChange={(e) => handleChange('apartment', e.target.value)}
                placeholder={t("checkout.addressOptionalPlaceholder")}
                className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
              />
            </div>
          </div>

          <div className="mb-5">
            <label htmlFor="shipping-city" className="block mb-2.5">
              {t("checkout.city")} <span className="text-red">*</span>
            </label>
            <input
              type="text"
              id="shipping-city"
              value={shippingDetails.city}
              onChange={(e) => handleChange('city', e.target.value)}
              required
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>

          <div className="mb-5">
            <label htmlFor="shipping-state" className="block mb-2.5">
              State
            </label>
            <input
              type="text"
              id="shipping-state"
              value={shippingDetails.state || ''}
              onChange={(e) => handleChange('state', e.target.value)}
              className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shipping;
