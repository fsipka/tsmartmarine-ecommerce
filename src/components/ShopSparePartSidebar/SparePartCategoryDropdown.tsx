"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { categoryService, SparePartCategory, SparePartSubCategory, SparePartBrand } from "@/lib/api/services/category.service";
import { Product } from "@/lib/api/services/products.service";

interface SparePartCategoryDropdownProps {
  selectedCategories: (number | string)[];
  selectedSubCategories: (number | string)[];
  selectedBrands: (number | string)[];
  onCategorySelect: (categoryId: number | string) => void;
  onSubCategorySelect: (subCategoryId: number | string) => void;
  onBrandSelect: (brandId: number | string) => void;
  allProducts: Product[];
}

const CONTENT_BASE_URL = 'https://marineapi.tsmart.ai/contents/';

const SparePartCategoryDropdown = ({
  selectedCategories,
  selectedSubCategories,
  selectedBrands,
  onCategorySelect,
  onSubCategorySelect,
  onBrandSelect,
  allProducts,
}: SparePartCategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [categories, setCategories] = useState<SparePartCategory[]>([]);
  const [subCategories, setSubCategories] = useState<SparePartSubCategory[]>([]);
  const [brands, setBrands] = useState<SparePartBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

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

  // Product counting functions
  const getSparePartCount = () => {
    return allProducts.filter(p => p.type === 'spare-part').length;
  };

  const getCategoryCount = (categoryId: number | string) => {
    return allProducts.filter(p =>
      p.type === 'spare-part' &&
      p.categoryId === categoryId
    ).length;
  };

  const getSubCategoryCount = (subCategoryId: number | string) => {
    return allProducts.filter(p =>
      p.type === 'spare-part' &&
      p.subCategoryId === subCategoryId
    ).length;
  };

  const getBrandCount = (brandId: number | string) => {
    return allProducts.filter(p =>
      p.type === 'spare-part' &&
      p.brandId === brandId
    ).length;
  };

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

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

  const sparePartCount = getSparePartCount();

  return (
    <div className="border-b border-gray-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4.5 px-5 hover:bg-gray-1 transition-colors"
      >
        <h5 className="font-semibold text-dark">Categories</h5>
        <svg
          className={`fill-current transition-transform ${isOpen ? "rotate-180" : ""}`}
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
      </button>

      {isOpen && (
        <div className="px-5 pb-5">
          {loading ? (
            <div className="flex items-center justify-center py-5">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* All Spare Parts */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="all-spare-parts"
                  checked={selectedCategories.length === 0 && selectedSubCategories.length === 0 && selectedBrands.length === 0}
                  onChange={() => {
                    onCategorySelect('all-spare-parts');
                  }}
                  className="w-4 h-4 rounded border-gray-3 text-blue focus:ring-blue"
                />
                <label
                  htmlFor="all-spare-parts"
                  className="flex-1 flex items-center justify-between cursor-pointer"
                >
                  <span className="text-sm text-dark">All Spare Parts</span>
                  {sparePartCount > 0 && (
                    <span className="text-gray-4 text-sm">({sparePartCount})</span>
                  )}
                </label>
              </div>

              {/* Categories */}
              {categories.map((category) => {
                const categoryCount = getCategoryCount(category.id);
                const hasSubCategories = getSubCategoriesForCategory(category.id).length > 0;
                const isExpanded = expandedCategories.includes(category.id);
                const imageUrl = getCategoryImageUrl(category);

                return (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => onCategorySelect(category.id)}
                        className="w-4 h-4 rounded border-gray-3 text-blue focus:ring-blue"
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="flex-1 flex items-center gap-2 cursor-pointer group"
                      >
                        {imageUrl && (
                          <div className="relative w-8 h-8 flex-shrink-0 bg-gray-1 rounded overflow-hidden">
                            <Image
                              src={imageUrl}
                              alt={category.name}
                              fill
                              className="object-contain p-0.5"
                              unoptimized={imageUrl.startsWith('http')}
                            />
                          </div>
                        )}
                        <span className={`${hasSubCategories ? "font-medium" : ""} flex-1 text-sm text-dark group-hover:text-blue transition-colors`}>
                          {category.name}
                        </span>
                        {categoryCount > 0 && (
                          <span className="text-gray-4 text-sm">({categoryCount})</span>
                        )}
                      </label>
                      {hasSubCategories && (
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="p-1 hover:bg-gray-1 rounded transition-colors"
                        >
                          <svg
                            className={`fill-current text-gray-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            width="12"
                            height="12"
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
                        </button>
                      )}
                    </div>

                    {/* Subcategories */}
                    {hasSubCategories && isExpanded && (
                      <div className="ml-6 space-y-2 border-l-2 border-gray-2 pl-3">
                        {getSubCategoriesForCategory(category.id).map((subCategory) => {
                          const subCategoryCount = getSubCategoryCount(subCategory.id);
                          const subImageUrl = getSubCategoryImageUrl(subCategory);

                          return (
                            <div key={subCategory.id} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`subcategory-${subCategory.id}`}
                                checked={selectedSubCategories.includes(subCategory.id)}
                                onChange={() => onSubCategorySelect(subCategory.id)}
                                className="w-4 h-4 rounded border-gray-3 text-blue focus:ring-blue"
                              />
                              <label
                                htmlFor={`subcategory-${subCategory.id}`}
                                className="flex-1 flex items-center gap-2 cursor-pointer group"
                              >
                                {subImageUrl && (
                                  <div className="relative w-6 h-6 flex-shrink-0 bg-gray-1 rounded overflow-hidden">
                                    <Image
                                      src={subImageUrl}
                                      alt={subCategory.name}
                                      fill
                                      className="object-contain p-0.5"
                                      unoptimized={subImageUrl.startsWith('http')}
                                    />
                                  </div>
                                )}
                                <span className="flex-1 text-sm text-dark group-hover:text-blue transition-colors">
                                  {subCategory.name}
                                </span>
                                {subCategoryCount > 0 && (
                                  <span className="text-gray-4 text-sm">({subCategoryCount})</span>
                                )}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Brands Section */}
              {brands.length > 0 && (
                <div className="pt-4 mt-4 border-t border-gray-3">
                  <h6 className="font-semibold text-dark mb-3 text-sm">Brands</h6>
                  <div className="space-y-2">
                    {brands.map((brand) => {
                      const brandCount = getBrandCount(brand.id);
                      const imageUrl = getBrandImageUrl(brand);

                      return (
                        <div key={brand.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`brand-${brand.id}`}
                            checked={selectedBrands.includes(brand.id)}
                            onChange={() => onBrandSelect(brand.id)}
                            className="w-4 h-4 rounded border-gray-3 text-blue focus:ring-blue"
                          />
                          <label
                            htmlFor={`brand-${brand.id}`}
                            className="flex-1 flex items-center gap-2 cursor-pointer group"
                          >
                            {imageUrl && (
                              <div className="relative w-8 h-8 flex-shrink-0 bg-gray-1 rounded overflow-hidden">
                                <Image
                                  src={imageUrl}
                                  alt={brand.name}
                                  fill
                                  className="object-contain p-0.5"
                                  unoptimized={imageUrl.startsWith('http')}
                                />
                              </div>
                            )}
                            <span className="flex-1 text-sm text-dark group-hover:text-blue transition-colors">
                              {brand.name}
                            </span>
                            {brandCount > 0 && (
                              <span className="text-gray-4 text-sm">({brandCount})</span>
                            )}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SparePartCategoryDropdown;
