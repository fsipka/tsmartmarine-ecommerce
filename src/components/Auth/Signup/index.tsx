"use client";

import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { authService } from "@/lib/api/services";
import { AccountType } from "@/lib/api/types";
import { useAuth } from "@/contexts/AuthContext";
import { createUserSessionFromToken } from "@/lib/auth/session";

const Signup = () => {
  const t = useTranslations();
  const router = useRouter();
  const { login } = useAuth();

  const [accountType, setAccountType] = useState<AccountType>("buyer");

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [retype, setRetype] = useState("");
  const [phone, setPhone] = useState("");

  // Vendor-only fields
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !password) {
      setError(t("auth.requiredFieldsMissing") || "Name, email and password are required.");
      return;
    }
    if (password.length < 6) {
      setError(t("auth.passwordTooShort") || "Password must be at least 6 characters.");
      return;
    }
    if (password !== retype) {
      setError(t("auth.passwordsDoNotMatch") || "Passwords do not match.");
      return;
    }

    if (accountType === "vendor" && !companyName.trim()) {
      setError(t("auth.companyNameRequired") || "Company name is required.");
      return;
    }

    setSubmitting(true);
    try {
      const [first, ...rest] = name.trim().split(/\s+/);
      const surname = rest.join(" ");

      if (accountType === "vendor") {
        await authService.registerVendor({
          CompanyName: companyName.trim(),
          Country: country.trim() || undefined,
          Website: website.trim() || null,
          Phone: phone.trim() || null,
          AdminName: first,
          AdminSurname: surname || null,
          AdminEmail: email.trim(),
          AdminPhone: phone.trim() || null,
          AdminPassword: password,
        });
      } else {
        await authService.register({
          firstName: first,
          lastName: surname,
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
        });
      }

      // Auto-login via AuthContext flow (sets localStorage + Bearer token).
      const auth = await authService.login({
        email: email.trim(),
        password,
        accountType,
      });
      const session = await createUserSessionFromToken(
        auth.token,
        auth.refreshToken || "",
        auth.expiration,
      );
      if (session) {
        login(session);
      }

      // Vendor users land on the application-status page until approved.
      if (accountType === "vendor") {
        router.push("/application-status");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.errors?.[0] ||
        err?.response?.data?.ErrorMessage?.[0] ||
        err?.response?.data?.message ||
        err?.message ||
        (t("auth.registrationFailed") || "Registration failed.");
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const isVendor = accountType === "vendor";

  return (
    <>
      <Breadcrumb title={"Signup"} pages={["Signup"]} />
      <section className="overflow-hidden py-20 bg-gray-2">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[570px] w-full mx-auto rounded-xl bg-white shadow-1 p-4 sm:p-7.5 xl:p-11">
            <div className="text-center mb-7">
              <h2 className="font-semibold text-xl sm:text-2xl xl:text-heading-5 text-dark mb-1.5">
                {t("auth.createAccount") || "Create an Account"}
              </h2>
              <p>{t("auth.enterDetailBelow")}</p>
            </div>

            {/* Account-type toggle */}
            <div className="grid grid-cols-2 gap-2 mb-6 p-1 rounded-lg bg-gray-1">
              <button
                type="button"
                onClick={() => setAccountType("buyer")}
                className={`py-2.5 px-4 rounded-md text-sm font-medium duration-200 ${
                  !isVendor ? "bg-white text-dark shadow-1" : "text-dark-5 hover:text-dark"
                }`}
              >
                {t("auth.buyerAccount") || "Buyer"}
              </button>
              <button
                type="button"
                onClick={() => setAccountType("vendor")}
                className={`py-2.5 px-4 rounded-md text-sm font-medium duration-200 ${
                  isVendor ? "bg-white text-dark shadow-1" : "text-dark-5 hover:text-dark"
                }`}
              >
                {t("auth.vendorAccount") || "Vendor / Company"}
              </button>
            </div>

            {isVendor && (
              <div className="mb-6 px-4 py-3 rounded-lg bg-blue/10 text-sm">
                {t("auth.vendorApprovalNotice") ||
                  "Vendor accounts require platform approval before full access."}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {isVendor && (
                <>
                  <div className="mb-5">
                    <label htmlFor="companyName" className="block mb-2.5">
                      {t("auth.companyNameLabel") || "Company Name"} <span className="text-red">*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={t("auth.companyNamePlaceholder") || "Acme Marine Ltd."}
                      className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                    />
                  </div>

                  <div className="mb-5 grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="country" className="block mb-2.5">
                        {t("auth.countryLabel") || "Country"}
                      </label>
                      <input
                        type="text"
                        name="country"
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className="block mb-2.5">
                        {t("auth.websiteLabel") || "Website"}
                      </label>
                      <input
                        type="text"
                        name="website"
                        id="website"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://"
                        className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="mb-5">
                <label htmlFor="name" className="block mb-2.5">
                  {isVendor ? t("auth.contactNameLabel") || "Contact Full Name" : t("auth.fullNameLabel") || "Full Name"} <span className="text-red">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.fullNamePlaceholder")}
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="email" className="block mb-2.5">
                  {t("auth.emailLabel") || "Email Address"} <span className="text-red">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.emailPlaceholder")}
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="phone" className="block mb-2.5">
                  {t("auth.phoneLabel") || "Phone"}
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="mb-5">
                <label htmlFor="password" className="block mb-2.5">
                  {t("auth.passwordLabel") || "Password"} <span className="text-red">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("auth.passwordPlaceholder")}
                  autoComplete="new-password"
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              <div className="mb-5.5">
                <label htmlFor="re-type-password" className="block mb-2.5">
                  {t("auth.retypePasswordLabel") || "Re-type Password"} <span className="text-red">*</span>
                </label>
                <input
                  type="password"
                  name="re-type-password"
                  id="re-type-password"
                  value={retype}
                  onChange={(e) => setRetype(e.target.value)}
                  placeholder={t("auth.retypePasswordPlaceholder")}
                  autoComplete="new-password"
                  className="rounded-lg border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-3 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20"
                />
              </div>

              {error && (
                <div className="mb-5 text-red text-sm" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-lg ease-out duration-200 hover:bg-blue mt-7.5 disabled:opacity-60"
              >
                {submitting
                  ? t("auth.creating") || "Creating…"
                  : isVendor
                  ? t("auth.submitApplication") || "Submit Application"
                  : t("auth.createAccountButton") || "Create Account"}
              </button>

              <p className="text-center mt-6">
                {t("auth.alreadyHaveAccount") || "Already have an account?"}
                <Link
                  href="/signin"
                  className="text-dark ease-out duration-200 hover:text-blue pl-2"
                >
                  {t("auth.signInNow") || "Sign in Now"}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Signup;