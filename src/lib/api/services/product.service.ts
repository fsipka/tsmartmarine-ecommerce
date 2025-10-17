import { api } from '../client';
import { ApiResponse, PaginatedResponse, Product, ProductFilters } from '../types';

export const productService = {
  // Get all products with filters
  getProducts: async (filters?: ProductFilters): Promise<PaginatedResponse<Product[]>> => {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });
    }

    const response = await api.get<PaginatedResponse<Product[]>>(
      `/products?${params.toString()}`
    );
    return response.data;
  },

  // Get product by ID
  getProductById: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return response.data.data;
  },

  // Search products
  searchProducts: async (query: string, page = 1, pageSize = 10): Promise<PaginatedResponse<Product[]>> => {
    const response = await api.get<PaginatedResponse<Product[]>>(
      `/products/search?q=${encodeURIComponent(query)}&pageNumber=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get products by category
  getProductsByCategory: async (
    category: string,
    page = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<Product[]>> => {
    const response = await api.get<PaginatedResponse<Product[]>>(
      `/products/category/${category}?pageNumber=${page}&pageSize=${pageSize}`
    );
    return response.data;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8): Promise<Product[]> => {
    const response = await api.get<ApiResponse<Product[]>>(
      `/products/featured?limit=${limit}`
    );
    return response.data.data;
  },
};
