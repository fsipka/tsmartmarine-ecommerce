"use client";

import { useState } from "react";

interface SparePartBrand {
  id: number | string;
  name: string;
}

interface SparePartBrandItemProps {
  brand: SparePartBrand;
  onBrandSelect?: (brandId: number | string) => void;
  selectedBrands?: Set<number | string>;
}

const SparePartBrandItem = ({
  brand,
  onBrandSelect,
  selectedBrands
}: SparePartBrandItemProps) => {
  const isBrandSelected = selectedBrands?.has(brand.id) || false;

  const handleBrandClick = () => {
    onBrandSelect?.(brand.id);
  };

  return (
    <div>
      <button
        className={`${
          isBrandSelected && "text-blue"
        } group flex items-center gap-2 w-full ease-out duration-200 hover:text-blue text-left`}
        onClick={handleBrandClick}
      >
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

        <span>{brand.name}</span>
      </button>
    </div>
  );
};

interface SparePartBrandsDropdownProps {
  brands: SparePartBrand[];
  onBrandSelect?: (brandId: number | string) => void;
  selectedBrands?: Set<number | string>;
}

const SparePartBrandsDropdown = ({
  brands,
  onBrandSelect,
  selectedBrands
}: SparePartBrandsDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);

  // Create "All" brand option
  const allBrandId = 'all-sparepart-brands';
  const isAllBrandsSelected = selectedBrands?.has(allBrandId) || false;

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
        <p className="text-dark font-medium">Spare Part Brands</p>
        <button
          aria-label="button for spare part brands dropdown"
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
        className={`flex-col gap-3 py-6 pl-6 pr-5.5 ${
          toggleDropdown ? "flex" : "hidden"
        }`}
      >
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
          <span>All</span>
        </button>

        {brands.map((brand) => (
          <SparePartBrandItem
            key={brand.id}
            brand={brand}
            onBrandSelect={onBrandSelect}
            selectedBrands={selectedBrands}
          />
        ))}
      </div>
    </div>
  );
};

export default SparePartBrandsDropdown;
