"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { categoryService, YachtBrand } from "@/lib/api/services/category.service";

interface YachtMegaMenuProps {
  menuItem: {
    id: number;
    title: string;
    path?: string;
  };
  stickyMenu: boolean;
}

const YachtMegaMenu = ({ menuItem, stickyMenu }: YachtMegaMenuProps) => {
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [brands, setBrands] = useState<YachtBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const pathUrl = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const data = await categoryService.getYachtBrands();
        setBrands(data);
      } catch (error) {
        console.error("Failed to fetch yacht brands:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const handleBrandClick = (brandId: number) => {
    router.push(`/shop-yacht?brandId=${brandId}`);
    setDropdownToggler(false);
  };

  // Get brand image URL
  const getBrandImageUrl = (brand: YachtBrand) => {
    const CONTENT_BASE_URL = 'https://marineapi.tsmart.ai/contents/';

    if (brand.yachtBrandPrimaryFile && brand.yachtBrandPrimaryFile.url) {
      return `${CONTENT_BASE_URL}${brand.yachtBrandPrimaryFile.url}`;
    }
    if (brand.yachtBrandFiles && brand.yachtBrandFiles.length > 0 && brand.yachtBrandFiles[0].url) {
      return `${CONTENT_BASE_URL}${brand.yachtBrandFiles[0].url}`;
    }
    return null;
  };

  return (
    <li
      onMouseEnter={() => setDropdownToggler(true)}
      onMouseLeave={() => setDropdownToggler(false)}
      className={`group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full ${
        pathUrl.includes("yacht") && "before:!w-full"
      }`}
    >
      <a
        href={menuItem.path}
        onClick={(e) => {
          e.preventDefault();
          // Allow navigation to the main page
          router.push(menuItem.path || "/shop-yacht");
        }}
        className={`hover:text-blue text-custom-sm font-medium text-dark flex items-center gap-1.5 capitalize ${
          stickyMenu ? "xl:py-4" : "xl:py-6"
        } ${pathUrl.includes("yacht") && "!text-blue"}`}
      >
        {menuItem.title}
        <svg
          className="fill-current cursor-pointer"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.95363 5.67461C3.13334 5.46495 3.44899 5.44067 3.65866 5.62038L7.99993 9.34147L12.3412 5.62038C12.5509 5.44067 12.8665 5.46495 13.0462 5.67461C13.2259 5.88428 13.2017 6.19993 12.992 6.37964L8.32532 10.3796C8.13808 10.5401 7.86178 10.5401 7.67453 10.3796L3.00787 6.37964C2.7982 6.19993 2.77392 5.88428 2.95363 5.67461Z"
            fill=""
          />
        </svg>
      </a>

      {/* Mega Menu Dropdown */}
      <div
        className={`mega-menu ${dropdownToggler && "flex"} ${
          stickyMenu
            ? "xl:group-hover:translate-y-0"
            : "xl:group-hover:translate-y-0"
        }`}
      >
        <div className="w-full bg-white rounded-lg shadow-lg p-6 max-h-[500px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-10 text-gray-4">
              No yacht brands available
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {brands.map((brand) => {
                const imageUrl = getBrandImageUrl(brand);
                return (
                  <button
                    key={brand.id}
                    onClick={() => handleBrandClick(brand.id)}
                    className="group flex items-center gap-2 p-2 rounded border border-gray-3 hover:border-blue hover:shadow-sm transition-all duration-200 text-left"
                  >
                    <div className="relative w-10 h-10 flex-shrink-0 bg-gray-1 rounded overflow-hidden">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={brand.name}
                          fill
                          className="object-contain p-1"
                          unoptimized={imageUrl.startsWith('http')}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-4">
                          <svg
                            className="w-5 h-5"
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
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium text-dark group-hover:text-blue transition-colors flex-1 line-clamp-2">
                      {brand.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </li>
  );
};

export default YachtMegaMenu;
