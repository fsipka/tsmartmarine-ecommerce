import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.user?.accessToken) {
      headers['Authorization'] = `Bearer ${session.user.accessToken}`;
    }

    // Forward query parameters to the .NET API
    const queryString = searchParams.toString();
    const url = `${API_URL}/products${queryString ? `?${queryString}` : ''}`;

    const response = await axios.get(url, { headers });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);

    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch products',
        errors: error.response?.data?.errors,
      },
      { status: error.response?.status || 500 }
    );
  }
}
