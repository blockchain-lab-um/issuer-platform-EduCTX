import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (session) {
    return NextResponse.json({
      id: 1,
    });
  }

  return NextResponse.json(
    {
      error: 'Not authenticated',
    },
    {
      status: 401,
    },
  );
}
