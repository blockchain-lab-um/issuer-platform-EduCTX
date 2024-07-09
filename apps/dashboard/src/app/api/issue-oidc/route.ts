import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { BasicEmail } from '@/components/EmailTemplates/BasicEmail';
import { Resend } from 'resend';
import { PinEmail } from '@/components/EmailTemplates/PinEmail';

const resend = new Resend(process.env.RESEND_API_KEY ?? '');

export async function POST(req: NextRequest) {
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
  }

  const body = await req.json();
  const headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('x-api-key', process.env.API_KEY || '');

  try {
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
    const { id, credentialOfferRequest, userPin } = await response.json();

    if (!id || !credentialOfferRequest) {
      throw new Error('Something went wrong');
    }

    // Send email with credential offer request
    const { error: basicEmailError } = await resend.emails.send({
      from: 'example@skippy-ai.com', // TODO: Change domaing to send from bclabum email
      to: email,
      subject: 'Claim your new digital credential',
      text: 'Claim your new digital credential',
      react: BasicEmail({
        qrCodeUrl: `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/image/${id}`,
      }),
    });

    if (basicEmailError) {
      throw new Error('Something went wrong');
    }

    // Send PIN in separate email
    const { error: pinEmailError } = await resend.emails.send({
      from: 'example@skippy-ai.com', // TODO: Change domaing to send from bclabum email
      to: email,
      subject: 'PIN for claiming your new digital credential',
      text: 'PIN for claiming your new digital credential',
      react: PinEmail({
        pin: userPin,
      }),
    });

    if (pinEmailError) {
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
