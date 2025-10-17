"use client";
import React, { useState, useEffect } from "react";
import HeroCarousel from "./HeroCarousel";
import HeroFeature from "./HeroFeature";
import Image from "next/image";
import Link from "next/link";
import { productsService, Product } from "@/lib/api/services/products.service";
import { formatPrice } from "@/lib/utils/format";

const CONTENT_BASE_URL = 'https://marineapi.tsmart.ai/contents/';

const Hero = () => {
  const [sideProducts, setSideProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const allProducts = await productsService.getAllProducts();

        // Get 2 random products for side cards
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 2);

        setSideProducts(randomProducts);
      } catch (error) {
        console.error('Failed to fetch products for side cards:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  // Helper function to get primary image
  const getPrimaryImage = (product: Product): string => {
    const primaryFile =
      product.yachtPrimaryFile ||
      product.accessoryPrimaryFile ||
      product.sparePartPrimaryFile ||
      product.servicePrimaryFile;

    if (primaryFile?.url) {
      return `${CONTENT_BASE_URL}${primaryFile.url}`;
    }

    if (product.images && product.images.length > 0) {
      return product.images[0];
    }

    return '/images/hero/hero-02.png';
  };

  // Helper function to calculate original price
  const getOriginalPrice = (product: Product): number | null => {
    const originalData: any = product.originalData;

    if (product.type === 'yacht' && originalData.price) {
      return originalData.price > product.price ? originalData.price : null;
    } else if (product.type === 'accessory' || product.type === 'spare-part') {
      return originalData.purchasePrice > product.price ? originalData.purchasePrice : null;
    } else if (product.type === 'service' && originalData.price) {
      return originalData.price > product.price ? originalData.price : null;
    }

    return null;
  };

  return (
    <section className="overflow-hidden pb-10 lg:pb-12.5 xl:pb-15 pt-57.5 sm:pt-45 lg:pt-30 xl:pt-51.5 bg-[#E5EAF4]">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="flex flex-wrap gap-5">
          <div className="xl:max-w-[757px] w-full">
            <div className="relative z-1 rounded-[10px] bg-white overflow-hidden">
              {/* <!-- bg shapes --> */}
              <Image
                src="/images/hero/hero-bg.png"
                alt="hero bg shapes"
                className="absolute right-0 bottom-0 -z-1"
                width={534}
                height={520}
              />

              <HeroCarousel />
            </div>
          </div>

          <div className="xl:max-w-[393px] w-full">
            <div className="flex flex-col sm:flex-row xl:flex-col gap-5">
              {isLoading ? (
                <>
                  <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5 flex items-center justify-center h-[200px]">
                    <p className="text-dark-4">Loading...</p>
                  </div>
                  <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5 flex items-center justify-center h-[200px]">
                    <p className="text-dark-4">Loading...</p>
                  </div>
                </>
              ) : sideProducts.length > 0 ? (
                sideProducts.map((product) => {
                  const originalPrice = getOriginalPrice(product);
                  const imageUrl = getPrimaryImage(product);

                  return (
                    <div key={product.id} className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <h2 className="max-w-[153px] font-semibold text-dark text-xl mb-10 sm:mb-20 line-clamp-2">
                            <Link href={`/shop-details?id=${product.id}&type=${product.type}`}>
                              {product.name}
                            </Link>
                          </h2>

                          <div>
                            <p className="font-medium text-dark-4 text-custom-sm mb-1.5">
                              limited time offer
                            </p>
                            <span className="flex items-center gap-3">
                              <span className="font-medium text-heading-5 text-red">
                                ${formatPrice(product.price)}
                              </span>
                              {originalPrice && (
                                <span className="font-medium text-2xl text-dark-4 line-through">
                                  ${formatPrice(originalPrice)}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="relative w-[123px] h-[161px] flex-shrink-0">
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="123px"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <>
                  <div className="w-full relative rounded-[10px] bg-white p-4 sm:p-7.5">
                    <p className="text-dark-4 text-center">No products available</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <!-- Hero features --> */}
      <HeroFeature />
    </section>
  );
};

export default Hero;
