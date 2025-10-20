import { api } from '../client';
import { ApiResponse } from '../types';
import { OrderDto } from '@/types/order';

export interface CreatedByUser {
  id: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  contentUrl: string | null;
  companyId: number;
  createdDate: string;
  updatedDate: string;
}

export interface OrderAccessory {
  id: number;
  name: string;
  code: string;
  description: string | null;
  salePrice: number;
  purchasePrice: number;
  stock: number;
  unit: number;
  currencyType: number;
}

export interface OrderSparePart {
  id: number;
  name: string;
  code: string;
  description: string | null;
  salePrice: number;
  purchasePrice: number;
  stock: number;
  unit: number;
  currencyType: number;
}

export interface OrderItem {
  id: number;
  orderId: number;
  accessoryId: number | null;
  sparePartId: number | null;
  serviceId: number | null;
  yachtId: number | null;
  quantity: number | null;
  unitPrice: number | null;
  lineTotal: number | null;
  accessory: OrderAccessory | null;
  sparePart: OrderSparePart | null;
  service: any | null;
  yacht: any | null;
  createdDate: string;
  updatedDate: string;
  companyId: number;
}

export interface Order {
  id: number;
  code: string;
  orderItemCount: number;
  orderStatus: number;
  orderStatusName: string;
  description: string | null;
  shippingAddress: string | null;
  billingAddress: string | null;
  totalAmount: number;
  discountAmount: number;
  paymentType: string | null;
  paymentStatus: string | null;
  paymentDate: string | null;
  createdByUser: CreatedByUser;
  orderItems: OrderItem[];
  createdDate: string;
  updatedDate: string;
  companyId: number;
}

export const orderService = {
  // Get all orders with details
  getAllWithDetails: async (): Promise<Order[]> => {
    try {
      const response = await api.get<ApiResponse<Order[]>>('/orders/getallwithdetails');
      return response.data.data || [];
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  },

  // Get single order with details
  getWithDetails: async (orderId: number): Promise<Order> => {
    try {
      const response = await api.get<ApiResponse<Order>>(`/orders/getwithdetails/${orderId}`);
      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      throw error;
    }
  },

  // Get order by ID
  getById: async (id: number): Promise<Order> => {
    const response = await api.get<ApiResponse<Order>>(`/orders/${id}`);
    return response.data.data;
  },

  // Create new order
  create: async (orderData: Partial<Order>): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/orders', orderData);
    return response.data.data;
  },

  // Create new order from checkout (using OrderDto)
  createFromCheckout: async (orderDto: OrderDto): Promise<Order> => {
    const response = await api.post<ApiResponse<Order>>('/orders', orderDto);
    return response.data.data;
  },

  // Update order
  update: async (id: number, orderData: Partial<Order>): Promise<Order> => {
    const response = await api.put<ApiResponse<Order>>(`/orders/${id}`, orderData);
    return response.data.data;
  },

  // Delete order
  delete: async (id: number): Promise<void> => {
    await api.delete(`/orders/${id}`);
  },
};
