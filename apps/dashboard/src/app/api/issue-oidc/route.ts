import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { Basic } from '@/components/EmailTemplates/BasicEmail';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
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

  const body = await req.json();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('x-api-key', process.env.API_KEY || '');

  try {
    // TODO: Use the email from the request body
    const { data, email } = body;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/oidc/credential-offer`,
      {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error('Something went wrong');
    }

    // Extract id from response
    const { id, credentialOfferRequest } = await response.json();

    if (!id || !credentialOfferRequest) {
      throw new Error('Something went wrong');
    }

    // Send email with credential offer request
    const { error } = await resend.emails.send({
      from: 'example@skippy-ai.com',
      to: email,
      subject: 'Claim your new digital credential',
      text: 'Claim your new digital credential',
      react: Basic({
        qrCodeUrl: `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/image/${id}`,
      }),
    });

    if (error) {
      throw new Error('Something went wrong');
    }

    return NextResponse.json({
      success: true,
      data: {},
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: error.status || 500,
      },
    );
  }
}
