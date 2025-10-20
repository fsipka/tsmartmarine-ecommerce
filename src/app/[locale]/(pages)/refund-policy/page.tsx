"use client";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { useTranslations } from "next-intl";

export default function RefundPolicyPage() {
  const t = useTranslations("refund");

  return (
    <>
      <Breadcrumb title={t("title")} pages={[t("breadcrumb")]} />
      <section className="overflow-hidden pb-17.5 pt-15">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[800px] mx-auto">
            <h1 className="text-3xl font-bold text-dark mb-8">{t("title")}</h1>

            <div className="space-y-6 text-body">
              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">{t("section1Title")}</h2>
                <p>
                  {t("section1Content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">{t("section2Title")}</h2>
                <p>
                  {t("section2Content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">{t("section3Title")}</h2>
                <p>
                  {t("section3Content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">{t("section4Title")}</h2>
                <p>
                  {t("section4Content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">{t("section5Title")}</h2>
                <p>
                  {t("section5Content")}
                </p>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-dark mb-3">{t("section6Title")}</h2>
                <p>
                  {t("section6Content")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
