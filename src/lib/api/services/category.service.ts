import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance without auth for public endpoints
const publicClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export interface AccessoryCategory {
  id: number;
  name: string;
  description: string | null;
  parentCategoryId: number | null;
  createdDate: string;
  updatedDate: string;
  companyId: number;
}

export interface SparePartCategory {
  id: number;
  name: string;
  description: string | null;
  parentCategoryId: number | null;
  createdDate: string;
  updatedDate: string;
  companyId: number;
}

export interface ServiceCategory {
  id: number;
  name: string;
  description: string | null;
  parentCategoryId: number | null;
  createdDate: string;
  updatedDate: string;
  companyId: number;
}

export interface ServiceSubCategory {
  id: number;
  name: string;
  serviceCategoryId: number;
  files: any | null;
  createdDate: string;
  updatedDate: string;
  companyId: number | null;
}

export interface AccessorySubCategory {
  id: number;
  name: string;
  accessoryCategoryId: number;
  files: any | null;
  createdDate: string;
  updatedDate: string;
  companyId: number | null;
}

export interface SparePartSubCategory {
  id: number;
  name: string;
  sparePartCategoryId: number;
  files: any | null;
  createdDate: string;
  updatedDate: string;
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
  yachtBrandFiles: any[];
  yachtBrandPrimaryFile: any | null;
  files: any | null;
  createdDate: string | null;
  updatedDate: string | null;
  companyId: number | null;
}

export interface SparePartBrand {
  id: number;
  name: string;
  code: string;
  files: any | null;
  createdDate: string | null;
  updatedDate: string | null;
  companyId: number | null;
}

export interface ApiResponse<T> {
  data: T;
  statusCode: number;
  errors: string[] | null;
}

export const categoryService = {
  // Get all accessory categories
  getAccessoryCategories: async (): Promise<AccessoryCategory[]> => {
    try {
      const response = await publicClient.get<ApiResponse<AccessoryCategory[]>>('/accessorycategories');
      console.log('Accessory Categories API Response:', JSON.stringify(response.data.data, null, 2));
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
      console.log('Spare Part Categories API Response:', JSON.stringify(response.data.data, null, 2));
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
      console.log('Service Categories API Response:', JSON.stringify(response.data.data, null, 2));
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
      console.log('Service SubCategories API Response:', JSON.stringify(response.data.data, null, 2));
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
      console.log('Accessory SubCategories API Response:', JSON.stringify(response.data.data, null, 2));
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
      console.log('Spare Part SubCategories API Response:', JSON.stringify(response.data.data, null, 2));
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
      console.log('Yacht Brands API Response:', JSON.stringify(response.data.data, null, 2));
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
      console.log('Spare Part Brands API Response:', JSON.stringify(response.data.data, null, 2));
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch spare part brands:', error);
      throw error;
    }
  },
};
