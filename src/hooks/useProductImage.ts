"use client";
import { useState, useEffect } from 'react';
import { getSession } from '@/lib/auth/session';

/**
 * Custom hook for handling product images with fallback to company logo
 * @param imageUrl - Product image URL
 * @returns The image URL with fallback logic
 */
export function useProductImage(imageUrl?: string | null): string {
  const [fallbackImage, setFallbackImage] = useState<string>('/images/products/product-01.png');

  useEffect(() => {
    // Get company logo from session
    const session = getSession();
    if (session?.user?.companyLogoUrl) {
      setFallbackImage(session.user.companyLogoUrl);
    }
  }, []);

  // If product has an image, use it; otherwise use fallback (company logo or default)
  if (imageUrl) {
    return imageUrl;
  }

  return fallbackImage;
}

/**
 * Get the appropriate image URL for a product
 * Checks if product has preview images, otherwise uses company logo or default
 */
export function getProductImageUrl(
  previews?: string[] | null,
  companyLogoUrl?: string | null
): string {
  // If product has preview images, use the first one
  if (previews && previews.length > 0 && previews[0]) {
    return previews[0];
  }

  // Otherwise, use company logo if available
  if (companyLogoUrl) {
    return companyLogoUrl;
  }

  // Final fallback to default image
  return '/images/products/product-01.png';
}
