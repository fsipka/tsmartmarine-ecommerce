import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://marineapi.tsmart.ai';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const response = await fetch(`${API_BASE_URL}/Companies/createsupplier`, {
      method: 'POST',
      body: formData,
    });

    const responseText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Failed to register supplier',
          details: responseText,
          status: response.status,
          statusText: response.statusText
        },
        { status: response.status }
      );
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = { message: responseText };
    }

    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('Supplier registration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
