// API Response Types
export interface ApiResponse<T = any> {
  clientSecret: string;
  data: T;
  success: boolean;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
}

// Auth Types
export type AccountType = 'buyer' | 'vendor';

export interface LoginRequest {
  email: string;
  password: string;
  accountType?: AccountType;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface VendorRegisterRequest {
  CompanyName: string;
  Country?: string;
  Website?: string | null;
  Phone?: string | null;
  AdminName: string;
  AdminSurname?: string | null;
  AdminEmail: string;
  AdminPhone?: string | null;
  AdminPassword: string;
}

export interface AuthResponse {
  token: string;
  accessToken?: string;
  refreshToken?: string;
  expiration: string;
  user?: User;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyId?: number;
  role?: string;
  accountType?: AccountType;
  approvalStatus?: number;
}

// Product Types
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  category: string;
  brand?: string;
  imgs: {
    thumbnails: string[];
    previews: string[];
  };
  inStock: boolean;
  quantity?: number;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  pageNumber?: number;
  pageSize?: number;
}

// Order Types
export interface Order {
  id: string;
  userId: string;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  items: OrderItem[];
  shippingAddress: Address;
  billingAddress: Address;
}

export enum OrderStatus {
  Pending = "Pending",
  Processing = "Processing",
  Shipped = "Shipped",
  Delivered = "Delivered",
  Cancelled = "Cancelled"
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export interface Address {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  zipCode?: string;
}

// Cart Types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
}
