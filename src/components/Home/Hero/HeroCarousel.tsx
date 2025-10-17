"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { useState, useEffect } from "react";
import { productsService, Product } from "@/lib/api/services/products.service";
import { formatPrice } from "@/lib/utils/format";
import Link from "next/link";

// Import Swiper styles
import "swiper/css/pagination";
import "swiper/css";

import Image from "next/image";

const CONTENT_BASE_URL = 'https://marineapi.tsmart.ai/contents/';

const HeroCarousal = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const allProducts = await productsService.getAllProducts();

        // Get 3 random products
        const shuffled = [...allProducts].sort(() => 0.5 - Math.random());
        const randomProducts = shuffled.slice(0, 3);

        setProducts(randomProducts);
      } catch (error) {
        console.error('Failed to fetch products for carousel:', error);
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

    return '/images/hero/hero-01.png';
  };

  // Helper function to calculate discount percentage
  const getDiscountPercentage = (product: Product): number => {
    const originalData: any = product.originalData;
    let originalPrice = 0;
    let salePrice = product.price;

    if (product.type === 'yacht' && originalData.price) {
      originalPrice = originalData.price;
      salePrice = originalData.salePrice || originalData.price;
    } else if (product.type === 'accessory' || product.type === 'spare-part') {
      originalPrice = originalData.purchasePrice;
      salePrice = originalData.salePrice;
    } else if (product.type === 'service' && originalData.price) {
      originalPrice = originalData.price;
      salePrice = originalData.salePrice || originalData.price;
    }

    if (originalPrice > salePrice) {
      return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
    }

    return 15; // Default discount
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <p className="text-dark">Loading products...</p>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <div className="text-center">
          <p className="text-dark">No products available</p>
        </div>
      </div>
    );
  }

  return (
    <Swiper
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{
        delay: 3500,
        disableOnInteraction: false,
      }}
      pagination={{
        clickable: true,
      }}
      modules={[Autoplay, Pagination]}
      className="hero-carousel"
    >
      {products.map((product) => {
        const discount = getDiscountPercentage(product);
        const imageUrl = getPrimaryImage(product);

        return (
          <SwiperSlide key={product.id}>
            <div className="flex items-center pt-6 sm:pt-0 flex-col-reverse sm:flex-row">
              <div className="max-w-[394px] py-10 sm:py-15 lg:py-24.5 pl-4 sm:pl-7.5 lg:pl-12.5">
                <div className="flex items-center gap-4 mb-7.5 sm:mb-10">
                  <span className="block font-semibold text-heading-3 sm:text-heading-1 text-blue">
                    {discount}%
                  </span>
                  <span className="block text-dark text-sm sm:text-custom-1 sm:leading-[24px]">
                    Sale
                    <br />
                    Off
                  </span>
                </div>

                <h1 className="font-semibold text-dark text-xl sm:text-3xl mb-3">
                  <Link href={`/shop-details?id=${product.id}&type=${product.type}`}>
                    {product.name}
                  </Link>
                </h1>

                <p className="line-clamp-2">
                  {product.description || "Premium quality product available now"}
                </p>

                <Link
                  href={`/shop-details?id=${product.id}&type=${product.type}`}
                  className="inline-flex font-medium text-white text-custom-sm rounded-md bg-dark py-3 px-9 ease-out duration-200 hover:bg-blue mt-10"
                >
                  Shop Now - ${formatPrice(product.price)}
                </Link>
              </div>

              <div className="relative w-[351px] h-[358px]">
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="351px"
                />
              </div>
            </div>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default HeroCarousal;
