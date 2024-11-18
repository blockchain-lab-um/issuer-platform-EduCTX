import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { renderBasicEmail } from '@/components/EmailTemplates/BasicEmail';
import { renderPinEmail } from '@/components/EmailTemplates/PinEmail';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  // secure: true,
  // port: 465,

  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
      `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/oidc/create-credential-offer`,
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
    const { id, pin, location } = await response.json();

    if (!id || !location || !pin) {
      throw new Error('Something went wrong');
    }

    const basicEmailHtml = await renderBasicEmail({
      qrCodeUrl: `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/image/${id}`,
    });

    const emailOptions = {
      // from: 'example@skippy-ai.com',
      fron: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Blockchain Lab:UM (EduCTX)',
      html: basicEmailHtml,
    };

    // Send email with credential offer request
    let sendMessageInfo = await transporter.sendMail(emailOptions);

    if (sendMessageInfo.rejected.length > 0) {
      throw new Error('Failed to send first email');
    }

    // Send PIN in separate email
    const pinEmailHtml = await renderPinEmail({ pin });

    emailOptions.html = pinEmailHtml;

    sendMessageInfo = await transporter.sendMail(emailOptions);

    if (sendMessageInfo.rejected.length > 0) {
      throw new Error('Failed to send second email');
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
