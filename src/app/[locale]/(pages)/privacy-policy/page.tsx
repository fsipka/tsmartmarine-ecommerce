import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const metadata: Metadata = {
  title: "Privacy Policy | NextCommerce",
  description: "Our privacy policy and data protection information",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <Breadcrumb title="Privacy Policy" pages={["privacy policy"]} />
      <section className="overflow-hidden pb-17.5 pt-15">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[800px] mx-auto">
            <h1 className="text-3xl font-bold text-dark mb-8">Privacy Policy</h1>

            <div className="space-y-6 text-body">
              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">1. Information We Collect</h2>
                <p>
                  We collect information that you provide directly to us when you create an account,
                  make a purchase, or contact us for support. This may include your name, email address,
                  shipping address, phone number, and payment information.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">2. How We Use Your Information</h2>
                <p>
                  We use the information we collect to process your orders, communicate with you about
                  your purchases, provide customer support, and improve our services. We may also use
                  your information to send you marketing communications if you have opted in to receive them.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">3. Information Sharing</h2>
                <p>
                  We do not sell or rent your personal information to third parties. We may share your
                  information with service providers who help us operate our business, such as payment
                  processors and shipping companies, but only to the extent necessary to provide our services.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">4. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational measures to protect your personal
                  information against unauthorized access, alteration, disclosure, or destruction. However,
                  no method of transmission over the internet is 100% secure.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">5. Your Rights</h2>
                <p>
                  You have the right to access, correct, or delete your personal information. You can
                  also object to or restrict certain processing of your data. To exercise these rights,
                  please contact us using the information provided below.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">6. Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us at
                  support@example.com or through our contact page.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
