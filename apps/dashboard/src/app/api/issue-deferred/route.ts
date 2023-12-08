import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { API_KEY, ISSUER_ENDPOINT } from '@/config/api';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        error: 'Not authenticated',
      },
      {
        status: 401,
      }
    );
  }
  const schemaType = req.headers.get('schemaType');
  const body = await req.json();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('schemaType', schemaType || '');
  headers.append('x-api-key', API_KEY);
  try {
    const response = await fetch(`${ISSUER_ENDPOINT}/issue-deferred`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return NextResponse.json({
        success: true,
        data: await response.json(),
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: error.status || 500,
      }
    );
  }

  return NextResponse.json(
    {
      error: 'Something went wrong',
    },
    {
      status: 500,
    }
  );
}
