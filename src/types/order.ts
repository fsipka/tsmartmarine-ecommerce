export enum PaymentStatus {
  Paid = 1,
  Unpaid = 2
}

export enum OrderStatus {
  Pending = 1,
  Processing = 2,
  Shipped = 3,
  Delivered = 4,
  Cancelled = 5,
  Refunded = 6
}

export enum PaymentType {
  BankTransfer = 1,
  CreditCard = 2
}

export interface OrderItemDto {
  orderId?: number;
  accessoryId?: number;
  sparePartId?: number;
  serviceId?: number;
  yachtId?: number;
  quantity?: number;
  unitPrice?: number;
  lineTotal?: number;
}

export interface OrderDto {
  code?: string;
  description?: string;
  shippingAddress?: string;
  billingAddress?: string;
  totalAmount: number;
  discountAmount: number;
  orderStatus?: OrderStatus;
  paymentType?: PaymentType;
  paymentStatus?: PaymentStatus;
  paymentDate?: string; // ISO date string
  orderItems: OrderItemDto[];
}

export interface BillingDetails {
  firstName: string;
  lastName: string;
  companyName?: string;
  country: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state?: string;
  phone: string;
  email: string;
}

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  companyName?: string;
  country: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state?: string;
}
