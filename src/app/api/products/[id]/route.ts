import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/options';

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (session?.user?.accessToken) {
      headers['Authorization'] = `Bearer ${session.user.accessToken}`;
    }

    const response = await axios.get(`${API_URL}/products/${id}`, { headers });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('API Error:', error.response?.data || error.message);

    return NextResponse.json(
      {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch product',
        errors: error.response?.data?.errors,
      },
      { status: error.response?.status || 500 }
    );
  }
}
