import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosRequestConfig, Method } from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

interface ProxyOptions {
  method: Method;
  endpoint: string;
  body?: any;
  requireAuth?: boolean;
}

/**
 * Proxy helper to forward requests to .NET API
 * Handles authentication, error handling, and response formatting
 */
export async function proxyToApi(
  request: NextRequest,
  options: ProxyOptions
): Promise<NextResponse> {
  try {
    const session = options.requireAuth ? await getServerSession(authOptions) : null;

    // Check authentication if required
    if (options.requireAuth && !session) {
      return NextResponse.json(
        {
          success: false,
          message: 'Unauthorized',
        },
        { status: 401 }
      );
    }

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.user?.accessToken) {
      headers['Authorization'] = `Bearer ${session.user.accessToken}`;
    }

    // Forward query parameters
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const url = `${API_URL}${options.endpoint}${queryString ? `?${queryString}` : ''}`;

    // Prepare axios config
    const config: AxiosRequestConfig = {
      method: options.method,
      url,
      headers,
    };

    // Add body for POST, PUT, PATCH requests
    if (options.body && ['POST', 'PUT', 'PATCH'].includes(options.method)) {
      config.data = options.body;
    }

    // Make the request to .NET API
    const response = await axios(config);

    return NextResponse.json(response.data, {
      status: response.status,
    });
  } catch (error: any) {
    console.error('API Proxy Error:', {
      endpoint: options.endpoint,
      error: error.response?.data || error.message,
    });

    // Handle specific error cases
    const status = error.response?.status || 500;
    const message =
      error.response?.data?.message ||
      error.message ||
      'An error occurred while processing your request';

    return NextResponse.json(
      {
        success: false,
        message,
        errors: error.response?.data?.errors,
      },
      { status }
    );
  }
}

/**
 * Helper to extract body from request
 */
export async function getRequestBody(request: NextRequest) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
