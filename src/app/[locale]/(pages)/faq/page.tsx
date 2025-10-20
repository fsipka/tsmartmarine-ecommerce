"use client";
import { useState } from "react";
import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function FAQPage() {
  const t = useTranslations("faq");

  const faqData = [
    { id: 1, question: t("q1"), answer: t("a1") },
    { id: 2, question: t("q2"), answer: t("a2") },
    { id: 3, question: t("q3"), answer: t("a3") },
    { id: 4, question: t("q4"), answer: t("a4") },
    { id: 5, question: t("q5"), answer: t("a5") },
    { id: 6, question: t("q6"), answer: t("a6") },
    { id: 7, question: t("q7"), answer: t("a7") },
    { id: 8, question: t("q8"), answer: t("a8") },
    { id: 9, question: t("q9"), answer: t("a9") },
    { id: 10, question: t("q10"), answer: t("a10") },
  ];
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      <Breadcrumb title={t("title")} pages={["faq"]} />
      <section className="overflow-hidden pb-17.5 pt-15">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-dark mb-4">{t("title")}</h1>
              <p className="text-body">
                {t("subtitle")}
              </p>
            </div>

            <div className="space-y-4">
              {faqData.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-gray-1 rounded-lg overflow-hidden border border-gray-3"
                >
                  <button
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-2 transition-colors"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <h3 className="text-lg font-semibold text-dark pr-4">
                      {faq.question}
                    </h3>
                    <svg
                      className={`flex-shrink-0 w-6 h-6 text-dark transition-transform ${
                        openId === faq.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {openId === faq.id && (
                    <div className="px-6 pb-6">
                      <p className="text-body">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-12 text-center p-8 bg-blue-light rounded-lg">
              <h3 className="text-xl font-semibold text-dark mb-3">
                {t("stillHaveQuestions")}
              </h3>
              <p className="text-body mb-6">
                {t("cantFindAnswer")}
              </p>
              <Link
                href="/contact"
                className="inline-flex font-medium text-custom-sm text-white bg-blue py-3 px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                {t("contactUs")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
