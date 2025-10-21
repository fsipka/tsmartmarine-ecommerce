"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { categoryService, ServiceCategory, ServiceSubCategory } from "@/lib/api/services/category.service";
import { Product } from "@/lib/api/services/products.service";

interface ServiceCategoryDropdownProps {
  selectedCategories: (number | string)[];
  selectedSubCategories: (number | string)[];
  onCategorySelect: (categoryId: number | string) => void;
  onSubCategorySelect: (subCategoryId: number | string) => void;
  allProducts: Product[];
}

const CONTENT_BASE_URL = 'https://marineapi.tsmart.ai/contents/';

const ServiceCategoryDropdown = ({
  selectedCategories,
  selectedSubCategories,
  onCategorySelect,
  onSubCategorySelect,
  allProducts,
}: ServiceCategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [subCategories, setSubCategories] = useState<ServiceSubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, subCats] = await Promise.all([
          categoryService.getServiceCategories(),
          categoryService.getServiceSubCategories()
        ]);
        setCategories(cats);
        setSubCategories(subCats);
      } catch (error) {
        console.error("Failed to fetch service categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Product counting functions
  const getServiceCount = () => {
    return allProducts.filter(p => p.type === 'service').length;
  };

  const getCategoryCount = (categoryId: number | string) => {
    return allProducts.filter(p =>
      p.type === 'service' &&
      p.categoryId === categoryId
    ).length;
  };

  const getSubCategoryCount = (subCategoryId: number | string) => {
    return allProducts.filter(p =>
      p.type === 'service' &&
      p.subCategoryId === subCategoryId
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
    return subCategories.filter(sub => sub.serviceCategoryId === categoryId);
  };

  // Get image URL for category
  const getCategoryImageUrl = (category: ServiceCategory) => {
    if (category.serviceCategoryPrimaryFile && category.serviceCategoryPrimaryFile.url) {
      return `${CONTENT_BASE_URL}${category.serviceCategoryPrimaryFile.url}`;
    }
    if (category.serviceCategoryFiles && category.serviceCategoryFiles.length > 0 && category.serviceCategoryFiles[0].url) {
      return `${CONTENT_BASE_URL}${category.serviceCategoryFiles[0].url}`;
    }
    return null;
  };

  // Get image URL for subcategory
  const getSubCategoryImageUrl = (subCategory: ServiceSubCategory) => {
    if (subCategory.serviceSubCategoryPrimaryFile && subCategory.serviceSubCategoryPrimaryFile.url) {
      return `${CONTENT_BASE_URL}${subCategory.serviceSubCategoryPrimaryFile.url}`;
    }
    if (subCategory.serviceSubCategoryFiles && subCategory.serviceSubCategoryFiles.length > 0 && subCategory.serviceSubCategoryFiles[0].url) {
      return `${CONTENT_BASE_URL}${subCategory.serviceSubCategoryFiles[0].url}`;
    }
    return null;
  };

  const serviceCount = getServiceCount();

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
              {/* All Services */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="all-services"
                  checked={selectedCategories.length === 0 && selectedSubCategories.length === 0}
                  onChange={() => {
                    onCategorySelect('all-services');
                  }}
                  className="w-4 h-4 rounded border-gray-3 text-blue focus:ring-blue"
                />
                <label
                  htmlFor="all-services"
                  className="flex-1 flex items-center justify-between cursor-pointer"
                >
                  <span className="text-sm text-dark">All Services</span>
                  {serviceCount > 0 && (
                    <span className="text-gray-4 text-sm">({serviceCount})</span>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ServiceCategoryDropdown;
