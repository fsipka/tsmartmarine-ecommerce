/**
 * Format a number with thousand separators
 * @param num - The number to format
 * @returns Formatted string with thousand separators
 */
export const formatNumber = (num: number | undefined | null): string => {
  if (num === undefined || num === null) return '0';
  return num.toLocaleString('en-US');
};

/**
 * Format a price with thousand separators
 * @param price - The price to format
 * @returns Formatted price string with thousand separators
 */
export const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null) return '0';
  return price.toLocaleString('en-US');
};
