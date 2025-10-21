"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import ProductItem from "@/components/Common/ProductItem";
import Breadcrumb from "@/components/Common/Breadcrumb";
import { productsService, Product } from "@/lib/api/services/products.service";
import ServiceCategoryDropdown from "./ServiceCategoryDropdown";

const ShopServiceSidebar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("default");

  const [selectedFilters, setSelectedFilters] = useState({
    categories: [] as (number | string)[],
    subCategories: [] as (number | string)[],
  });

  // Fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = await productsService.getAllProducts();

        // Filter only service products
        const services = products.filter(p => p.type === 'service');

        console.log('Service products:', services);
        if (services.length > 0) {
          console.log('First service:', services[0]);
        }

        setAllProducts(services);
        setFilteredProducts(services);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle URL parameters on mount
  useEffect(() => {
    const categoryId = searchParams.get("categoryId");
    const subCategoryId = searchParams.get("subCategoryId");

    if (categoryId) {
      const numericId = parseInt(categoryId);
      if (!isNaN(numericId)) {
        setSelectedFilters(prev => ({
          ...prev,
          categories: [numericId],
          subCategories: [],
        }));
      }
    }

    if (subCategoryId) {
      const numericId = parseInt(subCategoryId);
      if (!isNaN(numericId)) {
        setSelectedFilters(prev => ({
          ...prev,
          categories: [],
          subCategories: [numericId],
        }));
      }
    }
  }, [searchParams]);

  // Apply filters
  useEffect(() => {
    let filtered = [...allProducts];

    // Category filter
    if (selectedFilters.categories.length > 0) {
      const numericCategories = selectedFilters.categories
        .filter(id => typeof id === 'number') as number[];

      if (numericCategories.length > 0) {
        filtered = filtered.filter(p =>
          p.categoryId && numericCategories.includes(p.categoryId as number)
        );
      }
    }

    // SubCategory filter
    if (selectedFilters.subCategories.length > 0) {
      const numericSubCategories = selectedFilters.subCategories
        .filter(id => typeof id === 'number') as number[];

      if (numericSubCategories.length > 0) {
        filtered = filtered.filter(p =>
          p.subCategoryId && numericSubCategories.includes(p.subCategoryId as number)
        );
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-za":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedFilters, allProducts, sortBy]);

  const handleCategorySelect = (categoryId: number | string) => {
    const isAllOption = typeof categoryId === 'string' && categoryId.startsWith('all-');

    setSelectedFilters(prev => ({
      ...prev,
      subCategories: [], // Clear subcategory filters when selecting category
      categories: isAllOption
        ? prev.categories.includes(categoryId)
          ? prev.categories.filter(id => id !== categoryId)
          : [...prev.categories.filter(id => typeof id === 'number'), categoryId]
        : prev.categories.includes(categoryId)
          ? prev.categories.filter(id => id !== categoryId)
          : [...prev.categories.filter(id => !String(id).startsWith('all-')), categoryId],
    }));
  };

  const handleSubCategorySelect = (subCategoryId: number | string) => {
    const isAllOption = typeof subCategoryId === 'string' && subCategoryId.startsWith('all-');

    setSelectedFilters(prev => ({
      ...prev,
      categories: [], // Clear category filters when selecting subcategory
      subCategories: isAllOption
        ? prev.subCategories.includes(subCategoryId)
          ? prev.subCategories.filter(id => id !== subCategoryId)
          : [...prev.subCategories.filter(id => typeof id === 'number'), subCategoryId]
        : prev.subCategories.includes(subCategoryId)
          ? prev.subCategories.filter(id => id !== subCategoryId)
          : [...prev.subCategories.filter(id => !String(id).startsWith('all-')), subCategoryId],
    }));
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      categories: [],
      subCategories: [],
    });
    setSortBy("default");
  };

  return (
    <>
      <Breadcrumb title="Services" pages={["home", "shop"]} />

      <section className="overflow-hidden py-20">
        <div className="max-w-[1170px] w-full mx-auto px-4 sm:px-8 xl:px-0">
          <div className="flex flex-col lg:flex-row gap-7.5">
            {/* Sidebar */}
            <div className="max-w-[270px] w-full">
              <div className="bg-white rounded-[10px] shadow-1">
                {/* Filter Header */}
                <div className="border-b border-gray-3 flex items-center justify-between py-4.5 px-5">
                  <h4 className="font-semibold text-lg text-dark">Filters</h4>
                  <button
                    onClick={handleResetFilters}
                    className="text-sm text-gray-4 hover:text-blue transition-colors"
                  >
                    Reset All
                  </button>
                </div>

                {/* Category Dropdown */}
                <ServiceCategoryDropdown
                  selectedCategories={selectedFilters.categories}
                  selectedSubCategories={selectedFilters.subCategories}
                  onCategorySelect={handleCategorySelect}
                  onSubCategorySelect={handleSubCategorySelect}
                  allProducts={allProducts}
                />
              </div>
            </div>

            {/* Products Grid/List */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="bg-white rounded-[10px] shadow-1 mb-7.5 py-4.5 px-5 flex items-center justify-between flex-wrap gap-3">
                <p className="font-medium text-dark">
                  Showing {filteredProducts.length} of {allProducts.length} results
                </p>

                <div className="flex items-center gap-3">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-3 rounded-md px-4 py-2 text-sm focus:border-blue focus:outline-none"
                  >
                    <option value="default">Default Sorting</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name-az">Name: A to Z</option>
                    <option value="name-za">Name: Z to A</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2 border border-gray-3 rounded-md p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded ${
                        viewMode === "grid"
                          ? "bg-blue text-white"
                          : "text-gray-4 hover:text-blue"
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M0 0H7V7H0V0ZM9 0H16V7H9V0ZM0 9H7V16H0V9ZM9 9H16V16H9V9Z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded ${
                        viewMode === "list"
                          ? "bg-blue text-white"
                          : "text-gray-4 hover:text-blue"
                      }`}
                    >
                      <svg
                        className="fill-current"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M0 0H16V3H0V0ZM0 6.5H16V9.5H0V6.5ZM0 13H16V16H0V13Z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Products */}
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue"></div>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="bg-white rounded-[10px] shadow-1 py-20 text-center">
                  <p className="text-gray-4 text-lg">No services found</p>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                      : "flex flex-col gap-5"
                  }
                >
                  {filteredProducts.map((product) => (
                    <ProductItem
                      key={product.id}
                      item={product as any}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopServiceSidebar;
