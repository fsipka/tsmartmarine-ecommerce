"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { productsService } from "@/lib/api/services/products.service";
import { getSession } from "@/lib/auth/session";

const PromoBanner = () => {
  const [yacht, setYacht] = useState<any>(null);
  const [accessory, setAccessory] = useState<any>(null);
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  useEffect(() => {
    // Get company logo from session
    const session = getSession();
    if (session?.user?.companyLogoUrl) {
      setCompanyLogo(session.user.companyLogoUrl);
    }

    const fetchRandomProducts = async () => {
      try {
        const allProducts = await productsService.getAllProductsForComponents();

        const yachtProducts = allProducts.filter(p => p.type === 'yacht');
        const accessoryProducts = allProducts.filter(p => p.type === 'accessory');
        const serviceProducts = allProducts.filter(p => p.type === 'service');

        if (yachtProducts.length > 0) {
          const randomIndex = Math.floor(Math.random() * yachtProducts.length);
          setYacht(yachtProducts[randomIndex]);
        }

        if (accessoryProducts.length > 0) {
          const randomIndex = Math.floor(Math.random() * accessoryProducts.length);
          setAccessory(accessoryProducts[randomIndex]);
        }

        if (serviceProducts.length > 0) {
          const randomIndex = Math.floor(Math.random() * serviceProducts.length);
          setService(serviceProducts[randomIndex]);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRandomProducts();
  }, []);

  const getYachtImage = () => {
    if (yacht?.imgs?.previews && yacht.imgs.previews.length > 0) {
      return yacht.imgs.previews[0];
    }
    return companyLogo || "/images/products/product-01.png";
  };

  const getAccessoryImage = () => {
    if (accessory?.imgs?.previews && accessory.imgs.previews.length > 0) {
      return accessory.imgs.previews[0];
    }
    return companyLogo || "/images/promo/promo-02.png";
  };

  const getServiceImage = () => {
    if (service?.imgs?.previews && service.imgs.previews.length > 0) {
      return service.imgs.previews[0];
    }
    return companyLogo || "/images/promo/promo-03.png";
  };

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        {/* <!-- promo banner big --> */}
        <div className="relative z-1 overflow-hidden rounded-lg bg-[#F5F5F7] py-12.5 lg:py-17.5 xl:py-22.5 px-4 sm:px-7.5 lg:px-14 xl:px-19 mb-7.5">
          <div className="max-w-[550px] w-full">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                <div className="h-10 bg-gray-300 rounded w-1/2 mb-5"></div>
                <div className="h-20 bg-gray-300 rounded w-full"></div>
              </div>
            ) : yacht ? (
              <>
                <span className="block font-medium text-xl text-dark mb-3">
                  {yacht.title}
                </span>

                <h2 className="font-bold text-xl lg:text-heading-4 xl:text-heading-3 text-dark mb-5">
                  UP TO 30% OFF
                </h2>

                <p>
                  {yacht.description || "Discover luxury and performance with this exceptional yacht. Perfect for your maritime adventures."}
                </p>

                <a
                  href={`/shop-details?id=${yacht.id}&type=yacht`}
                  className="inline-flex font-medium text-custom-sm text-white bg-blue py-[11px] px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark mt-7.5"
                >
                  Buy Now
                </a>
              </>
            ) : (
              <div className="text-gray-500">No yachts available</div>
            )}
          </div>

          {!loading && yacht && (
            <Image
              src={getYachtImage()}
              alt={yacht.title || "yacht"}
              className="absolute top-1/2 -translate-y-1/2 right-4 lg:right-26 -z-1 object-contain"
              width={274}
              height={350}
            />
          )}
        </div>

        <div className="grid gap-7.5 grid-cols-1 lg:grid-cols-2">
          {/* <!-- promo banner small - Accessory --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#DBF4F3] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            {!loading && accessory && (
              <Image
                src={getAccessoryImage()}
                alt={accessory.title || "accessory"}
                className="absolute top-1/2 -translate-y-1/2 left-3 sm:left-10 -z-1 object-contain"
                width={241}
                height={241}
              />
            )}

            <div className="text-right">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-1.5 ml-auto"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2 mb-2.5 ml-auto"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/3 ml-auto"></div>
                </div>
              ) : accessory ? (
                <>
                  <span className="block text-lg text-dark mb-1.5">
                    {accessory.title}
                  </span>

                  <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                    Marine Accessory
                  </h2>

                  <p className="font-semibold text-custom-1 text-teal">
                    Flat 20% off
                  </p>

                  <a
                    href={`/shop-details?id=${accessory.id}&type=accessory`}
                    className="inline-flex font-medium text-custom-sm text-white bg-teal py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-teal-dark mt-9"
                  >
                    Grab Now
                  </a>
                </>
              ) : (
                <div className="text-gray-500">No accessories available</div>
              )}
            </div>
          </div>

          {/* <!-- promo banner small - Service --> */}
          <div className="relative z-1 overflow-hidden rounded-lg bg-[#FFECE1] py-10 xl:py-16 px-4 sm:px-7.5 xl:px-10">
            {!loading && service && (
              <Image
                src={getServiceImage()}
                alt={service.title || "service"}
                className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-8.5 -z-1 object-contain"
                width={200}
                height={200}
              />
            )}

            <div>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-5 bg-gray-300 rounded w-3/4 mb-1.5"></div>
                  <div className="h-8 bg-gray-300 rounded w-1/2 mb-2.5"></div>
                  <div className="h-4 bg-gray-300 rounded w-full"></div>
                </div>
              ) : service ? (
                <>
                  <span className="block text-lg text-dark mb-1.5">
                    {service.title}
                  </span>

                  <h2 className="font-bold text-xl lg:text-heading-4 text-dark mb-2.5">
                    Up to <span className="text-orange">40%</span> off
                  </h2>

                  <p className="max-w-[285px] text-custom-sm">
                    {service.description || "Professional marine service for your yacht and boat needs."}
                  </p>

                  <a
                    href={`/shop-details?id=${service.id}&type=service`}
                    className="inline-flex font-medium text-custom-sm text-white bg-orange py-2.5 px-8.5 rounded-md ease-out duration-200 hover:bg-orange-dark mt-7.5"
                  >
                    Buy Now
                  </a>
                </>
              ) : (
                <div className="text-gray-500">No services available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
