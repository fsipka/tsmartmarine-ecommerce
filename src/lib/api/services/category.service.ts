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

export interface CategoryFile {
  id: number;
  name: string;
  url: string;
  isDocument: boolean;
  isPrimary: boolean;
  createdDate: string | null;
  updatedDate: string | null;
  companyId: number | null;
}

export interface AccessoryCategory {
  id: number;
  name: string;
  description: string | null;
  parentCategoryId: number | null;
  accessoryCategoryFiles?: CategoryFile[];
  accessoryCategoryPrimaryFile?: CategoryFile | null;
  createdDate: string;
  updatedDate: string;
  companyId: number;
}

export interface SparePartCategory {
  id: number;
  name: string;
  description: string | null;
  parentCategoryId: number | null;
  sparePartCategoryFiles?: CategoryFile[];
  sparePartCategoryPrimaryFile?: CategoryFile | null;
  createdDate: string;
  updatedDate: string;
  companyId: number;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description: string | null;
  parentCategoryId: number | null;
  serviceCategoryFiles?: CategoryFile[];
  serviceCategoryPrimaryFile?: CategoryFile | null;
  createdDate: string;
  updatedDate: string;
  companyId: number;
}

export interface ServiceSubCategory {
  id: number;
  name: string;
  serviceCategoryId: number;
  serviceSubCategoryFiles?: CategoryFile[];
  serviceSubCategoryPrimaryFile?: CategoryFile | null;
  createdDate: string;
  updatedDate: string;
  companyId: number | null;
}

export interface AccessorySubCategory {
  id: number;
  name: string;
  accessoryCategoryId: number;
  accessorySubCategoryFiles?: CategoryFile[];
  accessorySubCategoryPrimaryFile?: CategoryFile | null;
  createdDate: string;
  updatedDate: string;
  companyId: number | null;
}

export interface SparePartSubCategory {
  id: number;
  name: string;
  sparePartCategoryId: number;
  sparePartSubCategoryFiles?: CategoryFile[];
  sparePartSubCategoryPrimaryFile?: CategoryFile | null;
  createdDate: string;
  updatedDate: string;
  companyId: number | null;
}

export interface YachtBrandFile {
  id: number;
  yachtBrandId: number;
  name: string;
  url: string;
  isDocument: boolean;
  isPrimary: boolean;
  createdDate: string | null;
  updatedDate: string | null;
  companyId: number | null;
}

export interface YachtModel {
  id: number;
  name: string;
  code: string;
  yachtBrandId: number;
  registeredLength: number | null;
  overallLength: number | null;
  depth: number | null;
  breadth: number | null;
  grossTonnage: number | null;
  netTonnage: number | null;
  engineMakeAndModel: string | null;
  enginePower: number | null;
  isBrandNew: boolean;
  shipType: number;
  methodOfPropulsion: number;
  files: any | null;
  createdDate: string | null;
  updatedDate: string | null;
  companyId: number | null;
}

export interface YachtBrand {
  id: number;
  name: string;
  code: string;
  yachtModels: YachtModel[];
  yachtBrandFiles: YachtBrandFile[];
  yachtBrandPrimaryFile: YachtBrandFile | null;
  files: any | null;
  createdDate: string | null;
  updatedDate: string | null;
  companyId: number | null;
}

export interface SparePartBrand {
  id: number;
  name: string;
  code: string;
  sparePartBrandFiles?: CategoryFile[];
  sparePartBrandPrimaryFile?: CategoryFile | null;
  createdDate: string | null;
  updatedDate: string | null;
  companyId: number | null;
}

export const categoryService = {
  // Get all accessory categories
  getAccessoryCategories: async (): Promise<AccessoryCategory[]> => {
    try {
      const response = await publicClient.get<ApiResponse<AccessoryCategory[]>>('/accessorycategories');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch accessory categories:', error);
      throw error;
    }
  },

  // Get all spare part categories
  getSparePartCategories: async (): Promise<SparePartCategory[]> => {
    try {
      const response = await publicClient.get<ApiResponse<SparePartCategory[]>>('/sparepartcategories');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch spare part categories:', error);
      throw error;
    }
  },

  // Get all service categories
  getServiceCategories: async (): Promise<ServiceCategory[]> => {
    try {
      const response = await publicClient.get<ApiResponse<ServiceCategory[]>>('/servicecategories');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch service categories:', error);
      throw error;
    }
  },

  // Get all service subcategories
  getServiceSubCategories: async (): Promise<ServiceSubCategory[]> => {
    try {
      const response = await publicClient.get<ApiResponse<ServiceSubCategory[]>>('/servicesubcategories');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch service subcategories:', error);
      throw error;
    }
  },

  // Get all accessory subcategories
  getAccessorySubCategories: async (): Promise<AccessorySubCategory[]> => {
    try {
      const response = await publicClient.get<ApiResponse<AccessorySubCategory[]>>('/accessorysubcategories');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch accessory subcategories:', error);
      throw error;
    }
  },

  // Get all spare part subcategories
  getSparePartSubCategories: async (): Promise<SparePartSubCategory[]> => {
    try {
      const response = await publicClient.get<ApiResponse<SparePartSubCategory[]>>('/sparepartsubcategories');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch spare part subcategories:', error);
      throw error;
    }
  },

  // Get all yacht brands with models
  getYachtBrands: async (): Promise<YachtBrand[]> => {
    try {
      const response = await publicClient.get<ApiResponse<YachtBrand[]>>('/yachtbrands');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch yacht brands:', error);
      throw error;
    }
  },

  // Get all spare part brands
  getSparePartBrands: async (): Promise<SparePartBrand[]> => {
    try {
      const response = await publicClient.get<ApiResponse<SparePartBrand[]>>('/sparepartbrands');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch spare part brands:', error);
      throw error;
    }
  },
};
