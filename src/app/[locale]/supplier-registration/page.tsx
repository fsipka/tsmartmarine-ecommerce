"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Common/Breadcrumb";
import toast from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";
import { COUNTRIES } from "@/constants/countries";
import { supplierService } from "@/lib/api/services/supplier.service";

const SupplierRegistrationPage = () => {
  const t = useTranslations("supplier");
  const locale = useLocale() as "en" | "tr" | "fr";
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    businessType: "",
    productsServices: "",
    yearsInBusiness: "",
    annualRevenue: "",
    numberOfEmployees: "",
    certifications: "",
    taxId: "",
    additionalInfo: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await supplierService.register({
        companyName: formData.companyName,
        contactPerson: formData.contactPerson,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        address: formData.address,
        city: formData.city,
        country: formData.country,
        postalCode: formData.postalCode,
        businessType: formData.businessType,
        productsServices: formData.productsServices,
        yearsInBusiness: formData.yearsInBusiness,
        annualRevenue: formData.annualRevenue,
        numberOfEmployees: formData.numberOfEmployees,
        certifications: formData.certifications,
        taxId: formData.taxId,
        additionalInfo: formData.additionalInfo,
      });

      // Redirect to success page
      router.push("/supplier-success");

      // Reset form (optional, as user is leaving the page)
      setFormData({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        website: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
        businessType: "",
        productsServices: "",
        yearsInBusiness: "",
        annualRevenue: "",
        numberOfEmployees: "",
        certifications: "",
        taxId: "",
        additionalInfo: "",
      });
    } catch (error) {
      console.error("Supplier registration error:", error);

      // Show the specific error message from the API
      const errorMessage = error instanceof Error ? error.message : t("errorMessage");
      toast.error(errorMessage, {
        duration: 5000,
        style: {
          maxWidth: '500px',
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title={t("title")} pages={["supplier registration"]} />

      <section className="overflow-hidden pb-20 pt-10 lg:pt-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-lg shadow-1 p-6 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
                {t("formTitle")}
              </h2>
              <p className="text-gray-4">
                {t("formDescription")}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Company Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-dark mb-4 pb-2 border-b border-gray-3">
                  {t("companyInformation")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("companyName")} <span className="text-red">{t("required")}</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder={t("companyNamePlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("contactPerson")} <span className="text-red">{t("required")}</span>
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder={t("contactPersonPlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("emailAddress")} <span className="text-red">{t("required")}</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder={t("emailPlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("phoneNumber")} <span className="text-red">{t("required")}</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder={t("phonePlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("website")}
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder={t("websitePlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("taxId")} <span className="text-red">{t("required")}</span>
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder={t("taxIdPlaceholder")}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-dark mb-4 pb-2 border-b border-gray-3">
                  {t("addressInformation")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("streetAddress")} <span className="text-red">{t("required")}</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder={t("streetAddressPlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("city")} <span className="text-red">{t("required")}</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder={t("cityPlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("country")} <span className="text-red">{t("required")}</span>
                    </label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                    >
                      <option value="">{t("selectCountry")}</option>
                      {COUNTRIES.map((country) => (
                        <option key={country.id} value={country.id}>
                          {country.name[locale]}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("postalCode")} <span className="text-red">{t("required")}</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder={t("postalCodePlaceholder")}
                    />
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-dark mb-4 pb-2 border-b border-gray-3">
                  {t("businessDetails")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("businessType")} <span className="text-red">{t("required")}</span>
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                    >
                      <option value="">{t("selectBusinessType")}</option>
                      <option value="manufacturer">{t("manufacturer")}</option>
                      <option value="distributor">{t("distributor")}</option>
                      <option value="wholesaler">{t("wholesaler")}</option>
                      <option value="service-provider">{t("serviceProvider")}</option>
                      <option value="other">{t("other")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("yearsInBusiness")} <span className="text-red">{t("required")}</span>
                    </label>
                    <input
                      type="number"
                      name="yearsInBusiness"
                      value={formData.yearsInBusiness}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder={t("yearsInBusinessPlaceholder")}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("annualRevenue")}
                    </label>
                    <select
                      name="annualRevenue"
                      value={formData.annualRevenue}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                    >
                      <option value="">{t("selectRevenueRange")}</option>
                      <option value="0-100k">{t("revenue0to100k")}</option>
                      <option value="100k-500k">{t("revenue100kto500k")}</option>
                      <option value="500k-1m">{t("revenue500kto1m")}</option>
                      <option value="1m-5m">{t("revenue1mto5m")}</option>
                      <option value="5m+">{t("revenue5mPlus")}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("numberOfEmployees")}
                    </label>
                    <select
                      name="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                    >
                      <option value="">{t("selectRange")}</option>
                      <option value="1-10">{t("employees1to10")}</option>
                      <option value="11-50">{t("employees11to50")}</option>
                      <option value="51-200">{t("employees51to200")}</option>
                      <option value="201-500">{t("employees201to500")}</option>
                      <option value="500+">{t("employees500Plus")}</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("productsServices")} <span className="text-red">{t("required")}</span>
                    </label>
                    <textarea
                      name="productsServices"
                      value={formData.productsServices}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue resize-none"
                      placeholder={t("productsServicesPlaceholder")}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark mb-2">
                      {t("certifications")}
                    </label>
                    <textarea
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue resize-none"
                      placeholder={t("certificationsPlaceholder")}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-dark mb-4 pb-2 border-b border-gray-3">
                  {t("additionalInformation")}
                </h3>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {t("additionalComments")}
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue resize-none"
                    placeholder={t("additionalCommentsPlaceholder")}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue text-white px-8 py-3 rounded-md font-medium hover:bg-blue-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? t("submitting") : t("submitApplication")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SupplierRegistrationPage;
