import { Metadata } from "next";
import Breadcrumb from "@/components/Common/Breadcrumb";

export const metadata: Metadata = {
  title: "Refund Policy | NextCommerce",
  description: "Our refund and return policy information",
};

export default function RefundPolicyPage() {
  return (
    <>
      <Breadcrumb title="Refund Policy" pages={["refund policy"]} />
      <section className="overflow-hidden pb-17.5 pt-15">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[800px] mx-auto">
            <h1 className="text-3xl font-bold text-dark mb-8">Refund Policy</h1>

            <div className="space-y-6 text-body">
              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">1. Return Window</h2>
                <p>
                  We offer a 30-day return policy for most products. To be eligible for a return,
                  your item must be unused and in the same condition that you received it. It must
                  also be in the original packaging with all tags and labels intact.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">2. Non-Returnable Items</h2>
                <p>
                  Certain types of items cannot be returned, including custom or personalized products,
                  perishable goods, and items marked as final sale. Marine services cannot be refunded
                  once they have been completed.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">3. Return Process</h2>
                <p>
                  To initiate a return, please contact our customer service team with your order number
                  and reason for return. We will provide you with a return authorization number and
                  instructions on how to return your item. Return shipping costs are the responsibility
                  of the customer unless the item is defective or we made an error.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">4. Refund Processing</h2>
                <p>
                  Once we receive your returned item, we will inspect it and process your refund within
                  5-7 business days. Refunds will be issued to the original payment method. Please note
                  that it may take additional time for your bank or credit card company to process the refund.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">5. Exchanges</h2>
                <p>
                  If you need to exchange an item for a different size, color, or model, please contact
                  us to arrange the exchange. Exchanges are subject to product availability.
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">6. Damaged or Defective Items</h2>
                <p>
                  If you receive a damaged or defective item, please contact us immediately with photos
                  of the damage. We will arrange for a replacement or full refund, including return
                  shipping costs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
