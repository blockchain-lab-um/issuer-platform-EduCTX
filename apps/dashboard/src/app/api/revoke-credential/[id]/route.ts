import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse, type NextRequest } from 'next/server';

const AUTHORIZED_ACCOUNTS = process.env.AUTHORIZED_ACCOUNTS
  ? process.env.AUTHORIZED_ACCOUNTS.split(',')
  : [];

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const id = (await params).id;
  let authorized = false;

  if (
    process.env.BFF_API_KEY &&
    process.env.BFF_API_KEY === req.headers.get('x-api-key')
  ) {
    authorized = true;
  }

  if (!authorized) {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        {
          error: 'Not authenticated',
        },
        {
          status: 401,
        },
      );
    }

    if (
      !session ||
      !session.user?.email ||
      !AUTHORIZED_ACCOUNTS.includes(session.user.email)
    ) {
      return NextResponse.json(
        {
          error: 'Not authorized',
        },
        {
          status: 401,
        },
      );
    }

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('x-api-key', process.env.API_KEY || '');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/revocation/${id}`,
        {
          method: 'POST',
          headers,
          body: JSON.stringify({}),
        },
      );

      if (!response.ok) {
        throw new Error('Something went wrong');
      }

      return NextResponse.json({
        success: true,
        data: {},
      });
    } catch (error) {
      // console.error(error);
      return NextResponse.json(
        {
          error: 'Failed to revoke credential',
        },
        {
          status: 500,
        },
      );
    }
  }
}
