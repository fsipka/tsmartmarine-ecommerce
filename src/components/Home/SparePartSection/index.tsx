"use client";
import React, { useEffect, useState } from "react";
import SingleItem from "../BestSeller/SingleItem";
import Image from "next/image";
import Link from "next/link";
import { productsService } from "@/lib/api/services/products.service";
import { useTranslations } from "next-intl";

const SparePartSection = () => {
  const t = useTranslations("home");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await productsService.getAllProductsForComponents();
        const sparePartProducts = allProducts.filter(p => p.type === 'spare-part');
        const shuffled = [...sparePartProducts].sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch spare part products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="overflow-hidden pb-16.5">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="text-center py-10">{t("loadingSpareParts")}</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="overflow-hidden pb-16.5">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- section title --> */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <span className="flex items-center gap-2.5 font-medium text-dark mb-1.5">
              <Image
                src="/images/icons/icon-07.svg"
                alt="icon"
                width={17}
                height={17}
              />
              {t("premiumCollection")}
            </span>
            <h2 className="font-semibold text-xl xl:text-heading-5 text-dark">
              {t("spareParts")}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7.5">
          {products.map((item, key) => (
            <SingleItem item={item} key={key} />
          ))}
        </div>

        <div className="text-center mt-12.5">
          <Link
            href="/shop"
            className="inline-flex font-medium text-custom-sm py-3 px-7 sm:px-12.5 rounded-md border-gray-3 border bg-gray-1 text-dark ease-out duration-200 hover:bg-dark hover:text-white hover:border-transparent"
          >
            {t("viewAllSpareParts")}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SparePartSection;
