import axios from 'axios';
import { ApiResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance without auth for public endpoints
const publicClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

interface FileObject {
  id: number;
  url: string;
  name: string;
  isDocument: boolean;
  isPrimary: boolean;
}

export interface Yacht {
  id: number;
  name: string;
  description: string | null;
  model: string | null;
  year: number | null;
  length: number | null;
  price: number;
  salePrice?: number;
  yachtBrandId: number | null;
  yachtModelId: number | null;
  yachtFiles?: FileObject[];
  yachtPrimaryFile?: FileObject | null;
  createdDate: string;
  updatedDate: string;
  companyId: number;
}

export interface Accessory {
  id: number;
  name: string;
  description: string | null;
  code: string;
  accessoryCategoryId: number | null;
  accessorySubCategoryId: number | null;
  salePrice: number;
  purchasePrice: number;
  stock: number;
  unit: number;
  currencyType: number;
  accessoryFiles?: FileObject[];
  accessoryPrimaryFile?: FileObject | null;
  createdDate: string;
  updatedDate: string;
  companyId: number;
}

export interface SparePart {
  id: number;
  name: string;
  code: string;
  description: string | null;
  sparePartBrandId: number | null;
  sparePartCategoryId: number | null;
  sparePartSubCategoryId: number | null;
  salePrice: number;
  purchasePrice: number;
  stock: number;
  unit: number;
  currencyType: number;
  partNumber: string | null;
  sparePartFiles?: FileObject[];
  sparePartPrimaryFile?: FileObject | null;
  createdDate: string;
  updatedDate: string;
  companyId: number;
}

export interface Service {
  id: number;
  name: string;
  code: string;
  description: string | null;
  serviceCategoryId: number | null;
  serviceSubCategoryId: number | null;
  price: number;
  salePrice?: number;
  unit: number;
  currencyType: number;
  serviceFiles?: FileObject[];
  servicePrimaryFile?: FileObject | null;
  createdDate: string;
  updatedDate: string;
  companyId: number;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  type: 'yacht' | 'accessory' | 'spare-part' | 'service';
  brandId?: number | null;
  categoryId?: number | null;
  subCategoryId?: number | null;
  code?: string;
  stock?: number;
  images?: string[];
  yachtPrimaryFile?: FileObject | null;
  accessoryPrimaryFile?: FileObject | null;
  sparePartPrimaryFile?: FileObject | null;
  servicePrimaryFile?: FileObject | null;
  originalData: Yacht | Accessory | SparePart | Service;
}

const CONTENT_BASE_URL = 'https://marineapi.tsmart.ai/contents/';

// Helper function to extract and format image URLs
const extractImageUrls = (files?: FileObject[]): string[] => {
  if (!files || files.length === 0) return [];

  return files
    .filter(file => !file.isDocument && file.url)
    .map(file => `${CONTENT_BASE_URL}${file.url}`);
};

// Helper function to convert API product to component Product type
const convertToComponentProduct = (apiProduct: Product): any => {
  const getImageUrl = () => {
    // Check if images array exists and has items
    if (apiProduct.images && apiProduct.images.length > 0) {
      const firstImage = apiProduct.images[0];
      // If image is already a full URL, return it
      if (firstImage && (firstImage.startsWith('http') || firstImage.startsWith('https'))) {
        return firstImage;
      }
      // Otherwise return the image path
      if (firstImage) {
        return firstImage;
      }
    }

    // Check primary file based on product type
    const primaryFile = apiProduct.yachtPrimaryFile ||
                       apiProduct.accessoryPrimaryFile ||
                       apiProduct.sparePartPrimaryFile ||
                       apiProduct.servicePrimaryFile;

    if (primaryFile && primaryFile.url) {
      return `${CONTENT_BASE_URL}${primaryFile.url}`;
    }

    // Return null instead of placeholder - components will handle fallback to company logo
    return null;
  };

  const imageUrl = getImageUrl();
  const images = apiProduct.images && apiProduct.images.length > 0
    ? apiProduct.images
    : (imageUrl ? [imageUrl] : []);

  const result = {
    id: apiProduct.id,
    title: apiProduct.name,
    description: apiProduct.description || '',
    price: apiProduct.price,
    discountedPrice: apiProduct.price * 0.9, // 10% discount for display
    reviews: Math.floor(Math.random() * 100) + 10, // Random reviews between 10-110
    type: apiProduct.type,
    imgs: {
      thumbnails: images,
      previews: images,
    },
  };

  return result;
};

export const productsService = {
  // Get all yachts
  getYachts: async (): Promise<Yacht[]> => {
    try {
      const response = await publicClient.get<ApiResponse<Yacht[]>>('/yachts');
      const yachts = response.data.data || [];
      return yachts;
    } catch (error) {
      console.error('Failed to fetch yachts:', error);
      throw error;
    }
  },

  // Get all accessories
  getAccessories: async (): Promise<Accessory[]> => {
    try {
      const response = await publicClient.get<ApiResponse<Accessory[]>>('/accessories');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch accessories:', error);
      throw error;
    }
  },

  // Get all spare parts
  getSpareParts: async (): Promise<SparePart[]> => {
    try {
      const response = await publicClient.get<ApiResponse<SparePart[]>>('/spareparts');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch spare parts:', error);
      throw error;
    }
  },

  // Get all services
  getServices: async (): Promise<Service[]> => {
    try {
      const response = await publicClient.get<ApiResponse<Service[]>>('/services');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch services:', error);
      throw error;
    }
  },

  // Get all products (combined)
  getAllProducts: async (): Promise<Product[]> => {
    try {
      const [yachts, accessories, spareParts, services] = await Promise.all([
        productsService.getYachts(),
        productsService.getAccessories(),
        productsService.getSpareParts(),
        productsService.getServices(),
      ]);

      const products: Product[] = [
        ...yachts.map(yacht => ({
          id: yacht.id,
          name: yacht.name,
          description: yacht.description,
          price: yacht.salePrice || yacht.price || 0,
          type: 'yacht' as const,
          categoryId: yacht.yachtBrandId,
          subCategoryId: yacht.yachtModelId,
          images: extractImageUrls(yacht.yachtFiles),
          yachtPrimaryFile: yacht.yachtPrimaryFile,
          originalData: yacht,
        })),
        ...accessories.map(accessory => ({
          id: accessory.id,
          name: accessory.name,
          description: accessory.description,
          price: accessory.salePrice,
          type: 'accessory' as const,
          categoryId: accessory.accessoryCategoryId,
          subCategoryId: accessory.accessorySubCategoryId,
          code: accessory.code,
          stock: accessory.stock,
          images: extractImageUrls(accessory.accessoryFiles),
          accessoryPrimaryFile: accessory.accessoryPrimaryFile,
          originalData: accessory,
        })),
        ...spareParts.map(sparePart => ({
          id: sparePart.id,
          name: sparePart.name,
          description: sparePart.description,
          price: sparePart.salePrice,
          type: 'spare-part' as const,
          brandId: sparePart.sparePartBrandId,
          categoryId: sparePart.sparePartCategoryId,
          subCategoryId: sparePart.sparePartSubCategoryId,
          code: sparePart.code,
          stock: sparePart.stock,
          images: extractImageUrls(sparePart.sparePartFiles),
          sparePartPrimaryFile: sparePart.sparePartPrimaryFile,
          originalData: sparePart,
        })),
        ...services.map(service => ({
          id: service.id,
          name: service.name,
          description: service.description,
          price: service.salePrice || service.price || 0,
          type: 'service' as const,
          categoryId: service.serviceCategoryId,
          subCategoryId: service.serviceSubCategoryId,
          code: service.code,
          images: extractImageUrls(service.serviceFiles),
          servicePrimaryFile: service.servicePrimaryFile,
          originalData: service,
        })),
      ];

      return products;
    } catch (error) {
      console.error('Failed to fetch all products:', error);
      throw error;
    }
  },

  // Get all products converted to component format
  getAllProductsForComponents: async (): Promise<any[]> => {
    try {
      const products = await productsService.getAllProducts();
      return products.map(convertToComponentProduct);
    } catch (error) {
      console.error('Failed to fetch products for components:', error);
      return [];
    }
  },
};
