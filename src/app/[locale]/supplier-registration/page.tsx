"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useTranslations, useLocale } from "next-intl";

import Breadcrumb from "@/components/Common/Breadcrumb";
import { COUNTRIES } from "@/constants/countries";
import { authService } from "@/lib/api/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";
import { createUserSessionFromToken } from "@/lib/auth/session";

const SupplierRegistrationPage = () => {
  const t = useTranslations("auth");
  const tSup = useTranslations("supplier");
  const locale = useLocale() as "en" | "tr" | "fr";
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    CompanyName: "",
    Country: "",
    Website: "",
    Phone: "",
    AdminName: "",
    AdminSurname: "",
    AdminEmail: "",
    AdminPhone: "",
    AdminPassword: "",
    AdminPasswordRetype: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.CompanyName.trim()) {
      setError(t("companyNameRequired") || "Company name is required.");
      return;
    }
    if (!form.AdminName.trim()) {
      setError(t("requiredFieldsMissing") || "Name is required.");
      return;
    }
    if (!form.AdminEmail.trim()) {
      setError(t("requiredFieldsMissing") || "Email is required.");
      return;
    }
    if (!form.AdminPassword || form.AdminPassword.length < 6) {
      setError(t("passwordTooShort") || "Password must be at least 6 characters.");
      return;
    }
    if (form.AdminPassword !== form.AdminPasswordRetype) {
      setError(t("passwordsDoNotMatch") || "Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await authService.registerVendor({
        CompanyName: form.CompanyName.trim(),
        Country: form.Country.trim() || undefined,
        Website: form.Website.trim() || null,
        Phone: form.Phone.trim() || null,
        AdminName: form.AdminName.trim(),
        AdminSurname: form.AdminSurname.trim() || null,
        AdminEmail: form.AdminEmail.trim(),
        AdminPhone: form.AdminPhone.trim() || null,
        AdminPassword: form.AdminPassword,
      });

      // Auto-login via vendor flow so we have a token + Pending claim, then
      // route to the application-status page.
      const auth = await authService.login({
        email: form.AdminEmail.trim(),
        password: form.AdminPassword,
        accountType: "vendor",
      });
      const session = await createUserSessionFromToken(
        auth.token,
        auth.refreshToken || "",
        auth.expiration
      );
      if (session) {
        login(session);
      }

      toast.success(t("loginSuccess") || "Application submitted.");
      router.push("/application-status");
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.ErrorMessage?.[0] ||
        err?.response?.data?.message ||
        err?.message ||
        (t("registrationFailed") || "Registration failed.");
      setError(msg);
      toast.error(msg, { duration: 5000, style: { maxWidth: "500px" } });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Breadcrumb
        title={tSup("title") || "Supplier Registration"}
        pages={[tSup("title") || "Supplier Registration"]}
      />

      <section className="overflow-hidden pb-20 pt-10 lg:pt-20">
        <div className="max-w-[640px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="bg-white rounded-lg shadow-1 p-6 md:p-10">
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-dark mb-2">
                {tSup("formTitle") || "Register your company"}
              </h2>
              <p className="text-gray-4">
                {tSup("formDescription") ||
                  "Submit your application — our team will review and approve your access shortly."}
              </p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-md bg-red/10 text-red text-sm" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {t("companyNameLabel") || "Company Name"} <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  value={form.CompanyName}
                  onChange={onChange("CompanyName")}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                  placeholder={t("companyNamePlaceholder") || "Acme Marine Ltd."}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {t("countryLabel") || "Country"}
                  </label>
                  <select
                    value={form.Country}
                    onChange={onChange("Country")}
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                  >
                    <option value="">{tSup("selectCountry") || "Select country"}</option>
                    {COUNTRIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name[locale]}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {t("phoneLabel") || "Company Phone"}
                  </label>
                  <input
                    type="tel"
                    value={form.Phone}
                    onChange={onChange("Phone")}
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                    placeholder="+90 ..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {t("websiteLabel") || "Website"}
                </label>
                <input
                  type="url"
                  value={form.Website}
                  onChange={onChange("Website")}
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                  placeholder="https://example.com"
                />
              </div>

              <h3 className="text-base font-semibold text-dark mt-3">
                {tSup("adminAccount") || "Admin Account"}
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {t("firstName") || "First Name"} <span className="text-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.AdminName}
                    onChange={onChange("AdminName")}
                    required
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark mb-2">
                    {t("lastName") || "Last Name"}
                  </label>
                  <input
                    type="text"
                    value={form.AdminSurname}
                    onChange={onChange("AdminSurname")}
                    disabled={submitting}
                    className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {t("email") || "Email"} <span className="text-red">*</span>
                </label>
                <input
                  type="email"
                  value={form.AdminEmail}
                  onChange={onChange("AdminEmail")}
                  required
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                  placeholder={t("emailPlaceholder") || "you@company.com"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {t("phoneLabel") || "Phone"}
                </label>
                <input
                  type="tel"
                  value={form.AdminPhone}
                  onChange={onChange("AdminPhone")}
                  disabled={submitting}
                  className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {t("passwordLabel") || "Password"} <span className="text-red">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.AdminPassword}
                    onChange={onChange("AdminPassword")}
                    required
                    disabled={submitting}
                    autoComplete="new-password"
                    className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-5 text-sm"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-2">
                  {t("retypePasswordLabel") || "Re-type Password"} <span className="text-red">*</span>
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.AdminPasswordRetype}
                  onChange={onChange("AdminPasswordRetype")}
                  required
                  disabled={submitting}
                  autoComplete="new-password"
                  className="w-full px-4 py-3 border border-gray-3 rounded-md focus:outline-none focus:border-blue"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-4 disabled:opacity-60"
              >
                {submitting
                  ? t("creating") || "Submitting..."
                  : t("submitApplication") || "Submit Application"}
              </button>

              <p className="text-center mt-2 text-sm">
                {t("alreadyHaveAccount") || "Already have an account?"}{" "}
                <Link href="/signin" className="text-dark hover:text-blue font-medium">
                  {t("signInNow") || "Sign in Now"}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default SupplierRegistrationPage;