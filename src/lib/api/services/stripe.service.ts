import { api } from '../client';
import { ApiResponse } from '../types';

export interface CreatePaymentIntentRequest {
  amount: number; // Amount in cents
  currency: string;
}

export interface PaymentIntentResponse {
  clientSecret: string;
}

export const stripeService = {
  // Create Payment Intent using TSmart Marine API
  createPaymentIntent: async (amount: number, currency: string = 'usd'): Promise<string> => {
    try {
      const requestPayload: CreatePaymentIntentRequest = {
        amount: Math.round(amount * 100), // Convert to cents
        currency: currency.toLowerCase(),
      };

      console.log('Creating Payment Intent:', requestPayload);

      const response = await api.post<ApiResponse<PaymentIntentResponse>>(
        '/stripe/CreatePaymentIntent',
        requestPayload
      );

      const clientSecret = response.data.data?.clientSecret || response.data.clientSecret;

      if (!clientSecret) {
        throw new Error('Client Secret not received from API');
      }

      console.log('Payment Intent created successfully');
      return clientSecret;
    } catch (error: any) {
      console.error('Failed to create payment intent:', error);
      throw error;
    }
  },
};
