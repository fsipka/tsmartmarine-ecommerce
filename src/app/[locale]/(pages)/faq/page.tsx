"use client";
import { useState } from "react";
import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";

const faqData = [
  {
    id: 1,
    question: "What types of marine products do you offer?",
    answer: "We offer a comprehensive range of marine products including luxury yachts, yacht accessories, spare parts, and professional marine services. Our inventory covers everything from navigation equipment to maintenance supplies.",
  },
  {
    id: 2,
    question: "How long does shipping take?",
    answer: "Shipping times vary depending on your location and the product ordered. Standard shipping typically takes 5-7 business days, while express shipping is available for 2-3 business day delivery. Large items like yachts require special handling and shipping arrangements.",
  },
  {
    id: 3,
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. International shipping times and costs vary by destination. Custom duties and import taxes may apply and are the responsibility of the customer.",
  },
  {
    id: 4,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, and Google Pay. For large purchases such as yachts, we can arrange bank transfers and financing options.",
  },
  {
    id: 5,
    question: "How do I track my order?",
    answer: "Once your order ships, you will receive a tracking number via email. You can use this number to track your shipment on our website or the carrier's website. You can also check your order status by logging into your account.",
  },
  {
    id: 6,
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for most products. Items must be unused, in original condition, and in original packaging. Some items like custom orders and marine services are non-returnable. Please see our Refund Policy page for complete details.",
  },
  {
    id: 7,
    question: "Do you offer warranties on your products?",
    answer: "Yes, most of our products come with manufacturer warranties. Warranty periods vary by product and manufacturer. We also offer extended warranty options on select items. Please contact us for specific warranty information.",
  },
  {
    id: 8,
    question: "Can I cancel or modify my order?",
    answer: "Orders can be cancelled or modified within 24 hours of placement, provided they haven't been shipped yet. Please contact our customer service team as soon as possible if you need to make changes to your order.",
  },
  {
    id: 9,
    question: "Do you offer installation services?",
    answer: "Yes, we offer professional installation services for many of our products. Service availability depends on your location and the specific product. Please contact us to discuss installation options and pricing.",
  },
  {
    id: 10,
    question: "How can I contact customer support?",
    answer: "You can reach our customer support team via email at support@example.com, by phone at (+099) 532-786-9843, or through our contact form. Our support hours are Monday-Friday, 9AM-6PM EST.",
  },
];

export default function FAQPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <>
      <Breadcrumb title="Frequently Asked Questions" pages={["faq"]} />
      <section className="overflow-hidden pb-17.5 pt-15">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[900px] mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-dark mb-4">Frequently Asked Questions</h1>
              <p className="text-body">
                Find answers to common questions about our products, shipping, returns, and more.
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
                Still have questions?
              </h3>
              <p className="text-body mb-6">
                Can't find the answer you're looking for? Please contact our customer support team.
              </p>
              <a
                href="/contact"
                className="inline-flex font-medium text-custom-sm text-white bg-blue py-3 px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
