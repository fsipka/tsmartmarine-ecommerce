"use client";

import React, { useState } from "react";

interface Category {
  id: number | string;
  name: string;
  count?: number;
  subcategories?: Category[];
  type?: 'yachts' | 'accessories' | 'services' | 'spare-parts';
}

interface CategoryItemProps {
  category: Category;
  level?: number;
  onLoadSubcategories?: (categoryType: string) => void;
  isLoadingSubcategories?: boolean;
  onCategorySelect?: (categoryId: number | string, categoryType?: string) => void;
  selectedCategories?: Set<number | string>;
}

interface CategoryItemProps {
  category: Category;
  level?: number;
  onLoadSubcategories?: (categoryType: string) => void;
  isLoadingSubcategories?: boolean;
  onCategorySelect?: (categoryId: number | string, categoryType?: string) => void;
  selectedCategories?: Set<number | string>;
  searchQuery?: string;
}

const CategoryItem = ({ category, level = 0, onLoadSubcategories, isLoadingSubcategories, onCategorySelect, selectedCategories, searchQuery }: CategoryItemProps) => {
  const hasSubcategories = category.subcategories && category.subcategories.length > 0;
  const isAllOption = category.name === 'All';
  // Check if it's an empty subcategories array (which means it's a leaf node like "All")
  const hasEmptySubcategories = category.subcategories && category.subcategories.length === 0;
  const canHaveSubcategories = category.type && category.type !== 'yachts' && !isAllOption && !hasEmptySubcategories;
  const isSelected = selectedCategories?.has(category.id) || false;

  // Check if any subcategory matches the search
  const hasMatchingSubcategory = (cat: Category, query: string): boolean => {
    if (!query || !cat.subcategories || cat.subcategories.length === 0) return false;
    const lowerQuery = query.toLowerCase();
    return cat.subcategories.some(sub =>
      sub.name.toLowerCase().includes(lowerQuery) || hasMatchingSubcategory(sub, query)
    );
  };

  // Auto-expand if search matches subcategories
  const shouldAutoExpand = searchQuery && hasMatchingSubcategory(category, searchQuery);
  const [expanded, setExpanded] = useState(false);

  // Update expanded state when search query changes
  React.useEffect(() => {
    if (shouldAutoExpand) {
      setExpanded(true);
      // Also load subcategories if not loaded
      if (canHaveSubcategories && !hasSubcategories && onLoadSubcategories) {
        onLoadSubcategories(category.type!);
      }
    }
  }, [searchQuery, shouldAutoExpand, canHaveSubcategories, hasSubcategories, onLoadSubcategories, category.type]);

  const handleClick = () => {
    if (canHaveSubcategories && !hasSubcategories && onLoadSubcategories && !expanded) {
      // Load subcategories on first expand
      onLoadSubcategories(category.type!);
    }

    if (canHaveSubcategories) {
      setExpanded(!expanded);
    } else {
      // Select category (includes "All" options and items with empty subcategories)
      // Pass categoryType for main categories (yachts, accessories, services, spare-parts)
      onCategorySelect?.(category.id, category.type);
    }
  };

  return (
    <div className={level > 0 ? "ml-4" : ""}>
      <button
        className={`${
          isSelected && "text-blue"
        } group flex items-center gap-2 w-full ease-out duration-200 hover:text-blue text-left`}
        onClick={handleClick}
        disabled={isLoadingSubcategories && expanded && canHaveSubcategories}
      >
        {!canHaveSubcategories && (
          <div
            className={`cursor-pointer flex items-center justify-center rounded w-4 h-4 border flex-shrink-0 ${
              isSelected ? "border-blue bg-blue" : "bg-white border-gray-3"
            }`}
          >
            <svg
              className={isSelected ? "block" : "hidden"}
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

        {canHaveSubcategories && (
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

        <span className={`${canHaveSubcategories ? "font-medium" : ""}`}>{category.name}</span>

        {isLoadingSubcategories && expanded && canHaveSubcategories && (
          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue"></div>
        )}
      </button>

      {hasSubcategories && expanded && (
        <div className="mt-2 space-y-2 pl-2">
          {category.subcategories!.map((subcat) => (
            <CategoryItem
              key={subcat.id}
              category={subcat}
              level={level + 1}
              onCategorySelect={onCategorySelect}
              selectedCategories={selectedCategories}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CategoryDropdownProps {
  categories: Category[];
  onLoadSubcategories?: (categoryType: string) => void;
  isLoadingSubcategories?: boolean;
  onCategorySelect?: (categoryId: number | string, categoryType?: string) => void;
  selectedCategories?: Set<number | string>;
}

const CategoryDropdown = ({ categories, onLoadSubcategories, isLoadingSubcategories, onCategorySelect, selectedCategories }: CategoryDropdownProps) => {
  const [toggleDropdown, setToggleDropdown] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [loadedForSearch, setLoadedForSearch] = useState(false);

  // When user starts searching, load all subcategories
  React.useEffect(() => {
    if (searchQuery.trim() !== '' && !loadedForSearch && onLoadSubcategories) {
      // Load all category types that have subcategories
      const categoriesToLoad = categories.filter(cat =>
        cat.type && cat.type !== 'yachts' && !cat.subcategories
      );

      categoriesToLoad.forEach(cat => {
        if (cat.type) {
          onLoadSubcategories(cat.type);
        }
      });

      setLoadedForSearch(true);
    }

    // Reset when search is cleared
    if (searchQuery.trim() === '') {
      setLoadedForSearch(false);
    }
  }, [searchQuery, loadedForSearch, categories, onLoadSubcategories]);

  // Recursive function to filter categories based on search
  const filterCategoryTree = (category: Category, query: string): Category | null => {
    const lowerQuery = query.toLowerCase();
    const categoryMatches = category.name.toLowerCase().includes(lowerQuery);

    // If category has subcategories, filter them recursively
    if (category.subcategories && category.subcategories.length > 0) {
      const filteredSubcategories = category.subcategories
        .map(sub => filterCategoryTree(sub, query))
        .filter((sub): sub is Category => sub !== null);

      // If this category matches OR any subcategory matches, include it
      if (categoryMatches || filteredSubcategories.length > 0) {
        return {
          ...category,
          subcategories: filteredSubcategories.length > 0 ? filteredSubcategories : category.subcategories
        };
      }
    } else {
      // Leaf node - include only if it matches
      if (categoryMatches) {
        return category;
      }
    }

    return null;
  };

  // Filter categories based on deep search
  const filteredCategories = searchQuery.trim() === ''
    ? categories
    : categories
        .map(cat => filterCategoryTree(cat, searchQuery))
        .filter((cat): cat is Category => cat !== null);

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
        <p className="text-dark font-medium">Categories</p>
        <button
          aria-label="button for category dropdown"
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
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            className="w-full px-3 py-2 text-sm border border-gray-3 rounded-md focus:outline-none focus:border-blue"
          />
        </div>

        {/* Categories List */}
        <div className="flex-col gap-3 py-4 px-6 flex">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onLoadSubcategories={onLoadSubcategories}
                isLoadingSubcategories={isLoadingSubcategories}
                onCategorySelect={onCategorySelect}
                selectedCategories={selectedCategories}
                searchQuery={searchQuery}
              />
            ))
          ) : (
            <p className="text-sm text-gray-4 text-center py-2">No categories found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryDropdown;
