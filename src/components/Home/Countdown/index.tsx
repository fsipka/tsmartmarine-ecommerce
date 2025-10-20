"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { productsService } from "@/lib/api/services/products.service";
import { useTranslations } from "next-intl";

const CounDown = () => {
  const t = useTranslations();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [yacht, setYacht] = useState<any>(null);

  const deadline = "December, 31, 2025";

  const getTime = () => {
    const time = Date.parse(deadline) - Date.now();

    setDays(Math.floor(time / (1000 * 60 * 60 * 24)));
    setHours(Math.floor((time / (1000 * 60 * 60)) % 24));
    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    // @ts-ignore
    const interval = setInterval(() => getTime(deadline), 1000);

    // Fetch a random yacht
    const fetchYacht = async () => {
      try {
        const allProducts = await productsService.getAllProductsForComponents();
        const yachts = allProducts.filter(p => p.type === 'yacht');
        if (yachts.length > 0) {
          const randomYacht = yachts[Math.floor(Math.random() * yachts.length)];
          setYacht(randomYacht);
        }
      } catch (error) {
        console.error("Failed to fetch yacht:", error);
      }
    };

    fetchYacht();

    return () => clearInterval(interval);
  }, []);

  const getImageUrl = () => {
    // Try yacht images
    if (yacht?.imgs?.previews && yacht.imgs.previews.length > 0 && yacht.imgs.previews[0]) {
      return yacht.imgs.previews[0];
    }
    // Return null to show placeholder icon
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <section className="overflow-hidden py-20">
      <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
        <div className="relative overflow-hidden z-1 rounded-lg bg-[#D0E9F3] p-4 sm:p-7.5 lg:p-10 xl:p-15">
          <div className="max-w-[422px] w-full">
            <span className="block font-medium text-custom-1 text-blue mb-2.5">
              {t("home.dontMiss")}
            </span>

            <h2 className="font-bold text-dark text-xl lg:text-heading-4 xl:text-heading-3 mb-3">
              {yacht ? yacht.title : t("home.luxuryExperience")}
            </h2>

            <p className="text-dark-4">
              {yacht ? (yacht.description || t("home.luxuryExperience")) : t("home.specialOffer")}
            </p>

            {/* <!-- Countdown timer --> */}
            <div
              className="flex flex-wrap gap-6 mt-6"
              x-data="timer()"
              x-init="countdown()"
            >
              {/* <!-- timer day --> */}
              <div>
                <span
                  className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2"
                  x-text="days"
                >
                  {" "}
                  {days < 10 ? "0" + days : days}{" "}
                </span>
                <span className="block text-custom-sm text-dark text-center">
                  {t("home.days")}
                </span>
              </div>

              {/* <!-- timer hours --> */}
              <div>
                <span
                  className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2"
                  x-text="hours"
                >
                  {" "}
                  {hours < 10 ? "0" + hours : hours}{" "}
                </span>
                <span className="block text-custom-sm text-dark text-center">
                  {t("home.hours")}
                </span>
              </div>

              {/* <!-- timer minutes --> */}
              <div>
                <span
                  className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2"
                  x-text="minutes"
                >
                  {minutes < 10 ? "0" + minutes : minutes}{" "}
                </span>
                <span className="block text-custom-sm text-dark text-center">
                  {t("home.minutes")}
                </span>
              </div>

              {/* <!-- timer seconds --> */}
              <div>
                <span
                  className="min-w-[64px] h-14.5 font-semibold text-xl lg:text-3xl text-dark rounded-lg flex items-center justify-center bg-white shadow-2 px-4 mb-2"
                  x-text="seconds"
                >
                  {seconds < 10 ? "0" + seconds : seconds}{" "}
                </span>
                <span className="block text-custom-sm text-dark text-center">
                  {t("home.seconds")}
                </span>
              </div>
            </div>
            {/* <!-- Countdown timer ends --> */}

            <div className="flex gap-4 mt-7.5">
              <Link
                href={yacht ? `/shop-details?id=${yacht.id}&type=yacht` : "/shop-details"}
                className="inline-flex font-medium text-custom-sm text-white bg-blue py-3 px-9.5 rounded-md ease-out duration-200 hover:bg-blue-dark"
              >
                {t("home.viewDetails") || "View Details"}
              </Link>
              {yacht && (
                <div className="inline-flex items-center gap-2">
                  <span className="font-semibold text-dark text-xl">
                    ${yacht.discountedPrice?.toFixed(2)}
                  </span>
                  {yacht.price !== yacht.discountedPrice && (
                    <span className="text-dark-4 line-through text-sm">
                      ${yacht.price?.toFixed(2)}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* <!-- bg shapes --> */}
          <Image
            src="/images/countdown/countdown-bg.png"
            alt="bg shapes"
            className="hidden sm:block absolute right-0 bottom-0 -z-1"
            width={737}
            height={482}
          />
          {yacht && (
            imageUrl ? (
              <Image
                src={imageUrl}
                alt={yacht.title || "Yacht"}
                className="hidden lg:block absolute right-4 xl:right-33 bottom-4 xl:bottom-10 -z-1 object-contain"
                width={411}
                height={376}
                unoptimized={imageUrl.startsWith('http')}
              />
            ) : (
              <div className="hidden lg:flex absolute right-4 xl:right-33 bottom-4 xl:bottom-10 -z-1 flex-col items-center justify-center text-gray-4">
                <svg
                  className="w-32 h-32 mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm">{t("common.noImage") || "No Image"}</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default CounDown;
