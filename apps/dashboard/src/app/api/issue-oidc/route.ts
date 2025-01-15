import { type NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { renderBasicEmail } from '@/components/EmailTemplates/BasicEmail';
import { renderPinEmail } from '@/components/EmailTemplates/PinEmail';
import nodemailer from 'nodemailer';
import { UTApi } from 'uploadthing/server';
import QRCode from 'qrcode';
import { randomUUID } from 'node:crypto';
import type { EducationCredentialType } from '@/lib/credentialSubjectTypes';
import PdfPrinter from 'pdfmake';
import { EducationCredentialPDF } from '@/components/PDFTemplates/EducationCredentialPDF';
import type Mail from 'nodemailer/lib/mailer';

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
  tls: {
    ciphers: 'SSLv3',
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

    const { pin, location } = await response.json();

    if (!location || !pin) {
      throw new Error('Something went wrong');
    }

    const qrCodeBuffer = await QRCode.toBuffer(location);

    const utapi = new UTApi({
      token: process.env.UPLOADTHING_TOKEN,
    });

    const file = new File([qrCodeBuffer], `${randomUUID()}.png`, {
      type: 'image/png',
    });

    const uploadResponse = (await utapi.uploadFiles([file]))[0];

    if (!uploadResponse || uploadResponse.error) {
      console.error(uploadResponse.error);
      throw new Error('Something went wrong');
    }

    const basicEmailHtml = await renderBasicEmail({
      qrCodeUrl: uploadResponse.data.url,
    });

    let attachments: Mail.Attachment[] = [];

    // Send PDF email (only for education credentials)
    if (
      Array.isArray(data.credential_type) &&
      data.credential_type.includes('EducationCredential')
    ) {
      const credentialSubject =
        data.credential_subject as EducationCredentialType;

      const docDefinition = EducationCredentialPDF(credentialSubject);

      const fonts = {
        Inter: {
          normal: 'public/fonts/Inter_18pt-Regular.ttf',
          bold: 'public/fonts/Inter_18pt-Bold.ttf',
          italics: 'public/fonts/Inter_18pt-Italic.ttf',
          bolditalics: 'public/fonts/Inter_18pt-BoldItalic.ttf',
        },
      };

      const printer = new PdfPrinter(fonts);

      // Create PDF Buffer that we send as attachment
      const pdfBuffer = await new Promise<Buffer>((resolve) => {
        const pdfDoc = printer.createPdfKitDocument(docDefinition);
        const buffs: unknown[] = [];
        pdfDoc.on('data', (d) => {
          buffs.push(d as readonly Uint8Array[]);
        });
        pdfDoc.on('end', () => {
          resolve(Buffer.concat(buffs as readonly Uint8Array[]));
        });
        pdfDoc.end();
      });

      attachments = [
        {
          filename: 'potrdilo.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ];
    }

    const emailOptions: Mail.Options = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: 'Blockchain Lab:UM (EduCTX)',
      html: basicEmailHtml,
      attachments: attachments,
    };

    // Send email with credential offer request
    let sendMessageInfo = await transporter.sendMail(emailOptions);

    if (sendMessageInfo.rejected.length > 0) {
      throw new Error('Failed to send first email');
    }

    // Send PIN in separate email
    const pinEmailHtml = await renderPinEmail({ pin });

    emailOptions.html = pinEmailHtml;
    emailOptions.attachments = [];

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
