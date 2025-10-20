"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface YachtModel {
  id: number | string;
  name: string;
}

interface YachtBrand {
  id: number | string;
  name: string;
  yachtModels: YachtModel[];
}

interface YachtBrandItemProps {
  brand: YachtBrand;
  level?: number;
  onBrandSelect?: (brandId: number | string) => void;
  onModelSelect?: (modelId: number | string) => void;
  selectedBrands?: Set<number | string>;
  selectedModels?: Set<number | string>;
  searchQuery?: string;
  t: any;
}

const YachtBrandItem = ({
  brand,
  level = 0,
  onBrandSelect,
  onModelSelect,
  selectedBrands,
  selectedModels,
  searchQuery,
  t
}: YachtBrandItemProps) => {
  const [expanded, setExpanded] = useState(false);
  const hasModels = brand.yachtModels && brand.yachtModels.length > 0;
  const isBrandSelected = selectedBrands?.has(brand.id) || false;

  // Check if any model matches the search
  const hasMatchingModel = (brand: YachtBrand, query: string): boolean => {
    if (!query || !brand.yachtModels || brand.yachtModels.length === 0) return false;
    const lowerQuery = query.toLowerCase();
    return brand.yachtModels.some(model =>
      model.name.toLowerCase().includes(lowerQuery)
    );
  };

  // Auto-expand if search matches models
  const shouldAutoExpand = searchQuery && hasMatchingModel(brand, searchQuery);

  // Update expanded state when search query changes
  React.useEffect(() => {
    if (shouldAutoExpand) {
      setExpanded(true);
    }
  }, [searchQuery, shouldAutoExpand]);

  const handleBrandClick = () => {
    if (hasModels) {
      setExpanded(!expanded);
    } else {
      onBrandSelect?.(brand.id);
    }
  };

  return (
    <div className={level > 0 ? "ml-4" : ""}>
      <button
        className={`${
          isBrandSelected && "text-blue"
        } group flex items-center gap-2 w-full ease-out duration-200 hover:text-blue text-left`}
        onClick={handleBrandClick}
      >
        {hasModels && (
          <svg
            className={`fill-current transition-transform flex-shrink-0 ${expanded ? "rotate-90" : ""}`}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 12L10 8L6 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {!hasModels && (
          <div
            className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border flex-shrink-0 ${
              isBrandSelected ? "border-blue bg-blue" : "bg-white border-gray-3"
            }`}
          >
            <svg
              className={isBrandSelected ? "block" : "hidden"}
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
                stroke="white"
                strokeWidth="1.94437"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        )}

        <span className={`${hasModels ? "font-medium" : ""}`}>{brand.name}</span>
      </button>

      {hasModels && expanded && (
        <div className="mt-2 space-y-2 pl-2">
          {/* All option for this brand's models */}
          {(() => {
            const allModelId = `all-brand-${brand.id}`;
            const isAllSelected = selectedModels?.has(allModelId) || false;
            return (
              <button
                key={allModelId}
                className={`${
                  isAllSelected && "text-blue"
                } group flex items-center gap-2 w-full ease-out duration-200 hover:text-blue text-left`}
                onClick={() => onModelSelect?.(allModelId)}
              >
                <div
                  className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border flex-shrink-0 ${
                    isAllSelected ? "border-blue bg-blue" : "bg-white border-gray-3"
                  }`}
                >
                  <svg
                    className={isAllSelected ? "block" : "hidden"}
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
                      stroke="white"
                      strokeWidth="1.94437"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>{t("common.all")}</span>
              </button>
            );
          })()}

          {brand.yachtModels.map((model) => {
            const isModelSelected = selectedModels?.has(model.id) || false;
            return (
              <button
                key={model.id}
                className={`${
                  isModelSelected && "text-blue"
                } group flex items-center gap-2 w-full ease-out duration-200 hover:text-blue text-left`}
                onClick={() => onModelSelect?.(model.id)}
              >
                <div
                  className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border flex-shrink-0 ${
                    isModelSelected ? "border-blue bg-blue" : "bg-white border-gray-3"
                  }`}
                >
                  <svg
                    className={isModelSelected ? "block" : "hidden"}
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
                      stroke="white"
                      strokeWidth="1.94437"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span>{model.name}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface YachtBrandsDropdownProps {
  brands: YachtBrand[];
  onBrandSelect?: (brandId: number | string) => void;
  onModelSelect?: (modelId: number | string) => void;
  selectedBrands?: Set<number | string>;
  selectedModels?: Set<number | string>;
}

const YachtBrandsDropdown = ({
  brands,
  onBrandSelect,
  onModelSelect,
  selectedBrands,
  selectedModels
}: YachtBrandsDropdownProps) => {
  const t = useTranslations();
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Create "All" brand option
  const allBrandId = 'all-brands';
  const isAllBrandsSelected = selectedBrands?.has(allBrandId) || false;

  // Filter brand and its models based on search
  const filterBrandTree = (brand: YachtBrand, query: string): YachtBrand | null => {
    const lowerQuery = query.toLowerCase();
    const brandMatches = brand.name.toLowerCase().includes(lowerQuery);

    // If brand has models, filter them
    if (brand.yachtModels && brand.yachtModels.length > 0) {
      const filteredModels = brand.yachtModels.filter(model =>
        model.name.toLowerCase().includes(lowerQuery)
      );

      // If brand matches OR any model matches, include the brand
      if (brandMatches || filteredModels.length > 0) {
        return {
          ...brand,
          yachtModels: filteredModels.length > 0 ? filteredModels : brand.yachtModels
        };
      }
    } else {
      // Brand without models - include only if it matches
      if (brandMatches) {
        return brand;
      }
    }

    return null;
  };

  // Filter brands based on search
  const filteredBrands = searchQuery.trim() === ''
    ? brands
    : brands
        .map(brand => filterBrandTree(brand, searchQuery))
        .filter((brand): brand is YachtBrand => brand !== null);

  return (
    <div className="bg-white shadow-1 rounded-lg">
      <div
        onClick={(e) => {
          e.preventDefault();
          setToggleDropdown(!toggleDropdown);
        }}
        className={`cursor-pointer flex items-center justify-between py-3 pl-6 pr-5.5 ${
          toggleDropdown && "shadow-filter"
        }`}
      >
        <p className="text-dark font-medium">{t("product.yachtBrands")}</p>
        <button
          aria-label="button for yacht brands dropdown"
          className={`text-dark ease-out duration-200 ${
            toggleDropdown && "rotate-180"
          }`}
        >
          <svg
            className="fill-current"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.43057 8.51192C4.70014 8.19743 5.17361 8.161 5.48811 8.43057L12 14.0122L18.5119 8.43057C18.8264 8.16101 19.2999 8.19743 19.5695 8.51192C19.839 8.82642 19.8026 9.29989 19.4881 9.56946L12.4881 15.5695C12.2072 15.8102 11.7928 15.8102 11.5119 15.5695L4.51192 9.56946C4.19743 9.29989 4.161 8.82641 4.43057 8.51192Z"
              fill=""
            />
          </svg>
        </button>
      </div>

      {/* <!-- dropdown menu --> */}
      <div
        className={`${
          toggleDropdown ? "flex" : "hidden"
        } flex-col`}
      >
        {/* Search Input */}
        <div className="px-6 pt-4 pb-2">
          <input
            type="text"
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full px-3 py-2 text-sm border border-gray-3 rounded-md focus:outline-none focus:border-blue"
          />
        </div>

        {/* Brands List */}
        <div className="flex-col gap-3 py-4 px-6 max-h-[400px] overflow-y-auto flex">
          {/* All brands option */}
          <button
            className={`${
              isAllBrandsSelected && "text-blue"
            } group flex items-center gap-2 w-full ease-out duration-200 hover:text-blue text-left`}
            onClick={() => onBrandSelect?.(allBrandId)}
          >
            <div
              className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border flex-shrink-0 ${
                isAllBrandsSelected ? "border-blue bg-blue" : "bg-white border-gray-3"
              }`}
            >
              <svg
                className={isAllBrandsSelected ? "block" : "hidden"}
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.33317 2.5L3.74984 7.08333L1.6665 5"
                  stroke="white"
                  strokeWidth="1.94437"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span>{t("common.all")}</span>
          </button>

          {filteredBrands.length > 0 ? (
            filteredBrands.map((brand) => (
              <YachtBrandItem
                key={brand.id}
                brand={brand}
                onBrandSelect={onBrandSelect}
                onModelSelect={onModelSelect}
                selectedBrands={selectedBrands}
                selectedModels={selectedModels}
                searchQuery={searchQuery}
                t={t}
              />
            ))
          ) : (
            <p className="text-sm text-gray-4 text-center py-2">{t("product.noBrandsFound")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default YachtBrandsDropdown;
