import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const metadata: Metadata = {
  title: "Terms of Use | NextCommerce",
  description: "Terms and conditions for using our services",
};

export default function TermsOfUsePage() {
  return (
    <>
      <Breadcrumb title="Terms of Use" pages={["terms of use"]} />
      <section className="overflow-hidden pb-17.5 pt-15">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[800px] mx-auto">
            <h1 className="text-3xl font-bold text-dark mb-8">Terms of Use</h1>

            <div className="space-y-6 text-body">
              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using this website, you accept and agree to be bound by the terms
                  and provision of this agreement. If you do not agree to these terms, please do not
                  use this website.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">2. Use of Website</h2>
                <p>
                  You agree to use this website only for lawful purposes and in a way that does not
                  infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the
                  website. You must not misuse our website by introducing viruses, trojans, worms, or
                  other malicious material.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">3. Product Information</h2>
                <p>
                  We strive to provide accurate product descriptions and images. However, we do not
                  warrant that product descriptions, images, or other content is accurate, complete,
                  reliable, current, or error-free. Specifications and prices are subject to change
                  without notice.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">4. Orders and Payment</h2>
                <p>
                  By placing an order, you are making an offer to purchase products. We reserve the
                  right to accept or decline your order for any reason. Payment must be made in full
                  before your order will be processed and shipped. All prices are in the currency
                  displayed at checkout.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">5. Intellectual Property</h2>
                <p>
                  All content on this website, including text, graphics, logos, images, and software,
                  is the property of our company or its content suppliers and is protected by
                  international copyright laws. You may not reproduce, distribute, or transmit any
                  content without our prior written consent.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">6. Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, we shall not be liable for any indirect,
                  incidental, special, consequential, or punitive damages resulting from your use of
                  or inability to use the website or products purchased through it.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">7. Changes to Terms</h2>
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective
                  immediately upon posting to the website. Your continued use of the website following
                  the posting of changes constitutes your acceptance of such changes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
