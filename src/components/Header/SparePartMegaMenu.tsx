"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { categoryService, SparePartCategory, SparePartSubCategory, SparePartBrand } from "@/lib/api/services/category.service";

interface SparePartMegaMenuProps {
  menuItem: {
    id: number;
    title: string;
    path?: string;
  };
  stickyMenu: boolean;
}

const CONTENT_BASE_URL = 'https://marineapi.tsmart.ai/contents/';

const SparePartMegaMenu = ({ menuItem, stickyMenu }: SparePartMegaMenuProps) => {
  const [dropdownToggler, setDropdownToggler] = useState(false);
  const [categories, setCategories] = useState<SparePartCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SparePartSubCategory[]>([]);
  const [brands, setBrands] = useState<SparePartBrand[]>([]);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const pathUrl = usePathname();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, subCats, brandList] = await Promise.all([
          categoryService.getSparePartCategories(),
          categoryService.getSparePartSubCategories(),
          categoryService.getSparePartBrands()
        ]);
        setCategories(cats);
        setSubCategories(subCats);
        setBrands(brandList);
      } catch (error) {
        console.error("Failed to fetch spare part data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/shop-spare-part?categoryId=${categoryId}`);
    setDropdownToggler(false);
  };

  const handleSubCategoryClick = (subCategoryId: number) => {
    router.push(`/shop-spare-part?subCategoryId=${subCategoryId}`);
    setDropdownToggler(false);
  };

  const handleBrandClick = (brandId: number) => {
    router.push(`/shop-spare-part?brandId=${brandId}`);
    setDropdownToggler(false);
  };

  // Get subcategories for hovered category
  const getSubCategoriesForCategory = (categoryId: number) => {
    return subCategories.filter(sub => sub.sparePartCategoryId === categoryId);
  };

  // Get image URL for category
  const getCategoryImageUrl = (category: SparePartCategory) => {
    if (category.sparePartCategoryPrimaryFile && category.sparePartCategoryPrimaryFile.url) {
      return `${CONTENT_BASE_URL}${category.sparePartCategoryPrimaryFile.url}`;
    }
    if (category.sparePartCategoryFiles && category.sparePartCategoryFiles.length > 0 && category.sparePartCategoryFiles[0].url) {
      return `${CONTENT_BASE_URL}${category.sparePartCategoryFiles[0].url}`;
    }
    return null;
  };

  // Get image URL for subcategory
  const getSubCategoryImageUrl = (subCategory: SparePartSubCategory) => {
    if (subCategory.sparePartSubCategoryPrimaryFile && subCategory.sparePartSubCategoryPrimaryFile.url) {
      return `${CONTENT_BASE_URL}${subCategory.sparePartSubCategoryPrimaryFile.url}`;
    }
    if (subCategory.sparePartSubCategoryFiles && subCategory.sparePartSubCategoryFiles.length > 0 && subCategory.sparePartSubCategoryFiles[0].url) {
      return `${CONTENT_BASE_URL}${subCategory.sparePartSubCategoryFiles[0].url}`;
    }
    return null;
  };

  // Get image URL for brand
  const getBrandImageUrl = (brand: SparePartBrand) => {
    if (brand.sparePartBrandPrimaryFile && brand.sparePartBrandPrimaryFile.url) {
      return `${CONTENT_BASE_URL}${brand.sparePartBrandPrimaryFile.url}`;
    }
    if (brand.sparePartBrandFiles && brand.sparePartBrandFiles.length > 0 && brand.sparePartBrandFiles[0].url) {
      return `${CONTENT_BASE_URL}${brand.sparePartBrandFiles[0].url}`;
    }
    return null;
  };

  return (
    <li
      onMouseEnter={() => setDropdownToggler(true)}
      onMouseLeave={() => {
        setDropdownToggler(false);
        setHoveredCategory(null);
      }}
      className={`group relative before:w-0 before:h-[3px] before:bg-blue before:absolute before:left-0 before:top-0 before:rounded-b-[3px] before:ease-out before:duration-200 hover:before:w-full ${
        pathUrl.includes("spare-part") && "before:!w-full"
      }`}
    >
      <a
        href={menuItem.path}
        onClick={(e) => {
          e.preventDefault();
          router.push(menuItem.path || "/shop-spare-part");
        }}
        className={`hover:text-blue text-custom-sm font-medium text-dark flex items-center gap-1.5 capitalize ${
          stickyMenu ? "xl:py-4" : "xl:py-6"
        } ${pathUrl.includes("spare-part") && "!text-blue"}`}
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
        <div className="w-full bg-white rounded-lg shadow-lg flex max-h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center py-10 w-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-10 text-gray-4 w-full">
              No spare part categories available
            </div>
          ) : (
            <>
              {/* Left side - Categories */}
              <div className="w-1/3 border-r border-gray-3 p-4 overflow-y-auto">
                <h3 className="text-sm font-semibold text-dark mb-3 px-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => {
                    const imageUrl = getCategoryImageUrl(category);
                    return (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        className={`group w-full flex items-center gap-3 p-2 rounded border transition-all ${
                          hoveredCategory === category.id
                            ? "border-blue bg-blue/10"
                            : "border-gray-3 hover:border-blue hover:shadow-sm"
                        }`}
                      >
                        <div className="relative w-12 h-12 flex-shrink-0 bg-gray-1 rounded overflow-hidden">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={category.name}
                              fill
                              className="object-contain p-1"
                              unoptimized={imageUrl.startsWith('http')}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-4">
                              <svg
                                className="w-6 h-6"
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
                        <span className={`text-sm font-medium flex-1 line-clamp-2 text-left ${
                          hoveredCategory === category.id ? "text-blue" : "text-dark group-hover:text-blue"
                        }`}>
                          {category.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right side - Subcategories */}
              <div className="w-2/3 p-4 overflow-y-auto">
                {hoveredCategory ? (
                  <>
                    <h3 className="text-sm font-semibold text-dark mb-3">
                      {categories.find(c => c.id === hoveredCategory)?.name} - Subcategories
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {getSubCategoriesForCategory(hoveredCategory).length > 0 ? (
                        getSubCategoriesForCategory(hoveredCategory).map((subCategory) => {
                          const imageUrl = getSubCategoryImageUrl(subCategory);
                          return (
                            <button
                              key={subCategory.id}
                              onClick={() => handleSubCategoryClick(subCategory.id)}
                              className="group flex items-center gap-2 p-2 rounded border border-gray-3 hover:border-blue hover:shadow-sm transition-all text-left"
                            >
                              <div className="relative w-10 h-10 flex-shrink-0 bg-gray-1 rounded overflow-hidden">
                                {imageUrl ? (
                                  <Image
                                    src={imageUrl}
                                    alt={subCategory.name}
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
                                {subCategory.name}
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <p className="text-sm text-gray-4 col-span-2">No subcategories available</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-4 text-sm">
                    Hover over a category to see subcategories
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default SparePartMegaMenu;
