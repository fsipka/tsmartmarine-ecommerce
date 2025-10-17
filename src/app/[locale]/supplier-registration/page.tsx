"use client";

import React, { useState } from "react";
import Breadcrumb from "@/components/Common/Breadcrumb";
import toast from "react-hot-toast";

const SupplierRegistrationPage = () => {
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
    bankName: "",
    bankAccountNumber: "",
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
      // TODO: Replace with actual API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Your supplier registration has been submitted successfully! We will contact you soon.");

      // Reset form
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
        bankName: "",
        bankAccountNumber: "",
        additionalInfo: "",
      });
    } catch (error) {
      toast.error("Failed to submit registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb title="Become a Supplier" pages={["supplier registration"]} />

      <section className="overflow-hidden pb-20 pt-10 lg:pt-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-lg shadow-1 p-6 md:p-10">
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-4">
                Supplier Registration Form
              </h2>
              <p className="text-gray-4">
                Fill out the form below to register as a supplier. Our team will review your application and get back to you within 3-5 business days.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Company Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-dark mb-4 pb-2 border-b border-gray-3">
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Company Name <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Contact Person <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="contactPerson"
                      value={formData.contactPerson}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="Enter contact person name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Email Address <span className="text-red">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Phone Number <span className="text-red">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="https://www.example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Tax ID / VAT Number <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="taxId"
                      value={formData.taxId}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="Enter your tax ID"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-dark mb-4 pb-2 border-b border-gray-3">
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark mb-2">
                      Street Address <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="Enter your street address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      City <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="Enter your city"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Country <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="Enter your country"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Postal Code <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="Enter postal code"
                    />
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-dark mb-4 pb-2 border-b border-gray-3">
                  Business Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Business Type <span className="text-red">*</span>
                    </label>
                    <select
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                    >
                      <option value="">Select business type</option>
                      <option value="manufacturer">Manufacturer</option>
                      <option value="distributor">Distributor</option>
                      <option value="wholesaler">Wholesaler</option>
                      <option value="service-provider">Service Provider</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Years in Business <span className="text-red">*</span>
                    </label>
                    <input
                      type="number"
                      name="yearsInBusiness"
                      value={formData.yearsInBusiness}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="Enter years in business"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Annual Revenue (USD)
                    </label>
                    <select
                      name="annualRevenue"
                      value={formData.annualRevenue}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                    >
                      <option value="">Select revenue range</option>
                      <option value="0-100k">$0 - $100,000</option>
                      <option value="100k-500k">$100,000 - $500,000</option>
                      <option value="500k-1m">$500,000 - $1,000,000</option>
                      <option value="1m-5m">$1,000,000 - $5,000,000</option>
                      <option value="5m+">$5,000,000+</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Number of Employees
                    </label>
                    <select
                      name="numberOfEmployees"
                      value={formData.numberOfEmployees}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                    >
                      <option value="">Select range</option>
                      <option value="1-10">1-10</option>
                      <option value="11-50">11-50</option>
                      <option value="51-200">51-200</option>
                      <option value="201-500">201-500</option>
                      <option value="500+">500+</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark mb-2">
                      Products/Services Offered <span className="text-red">*</span>
                    </label>
                    <textarea
                      name="productsServices"
                      value={formData.productsServices}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue resize-none"
                      placeholder="Describe the products or services you offer"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-dark mb-2">
                      Certifications (if any)
                    </label>
                    <textarea
                      name="certifications"
                      value={formData.certifications}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue resize-none"
                      placeholder="List any relevant certifications (ISO, CE, etc.)"
                    />
                  </div>
                </div>
              </div>

              {/* Banking Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-dark mb-4 pb-2 border-b border-gray-3">
                  Banking Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Bank Name <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="Enter bank name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-dark mb-2">
                      Bank Account Number <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="bankAccountNumber"
                      value={formData.bankAccountNumber}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                      placeholder="Enter account number"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-dark mb-4 pb-2 border-b border-gray-3">
                  Additional Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    Additional Comments
                  </label>
                  <textarea
                    name="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue resize-none"
                    placeholder="Any additional information you'd like to share..."
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
                  {isSubmitting ? "Submitting..." : "Submit Application"}
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
