import { randomUUID } from 'node:crypto';
import QRCode from 'qrcode';
import { UTApi } from 'uploadthing/server';

const main = async () => {
  // const payload = {
  //   credential_type: ['VerifiableCredential', 'EventTicketCredential'],
  //   credential_subject: {
  //     eventId: 'b78c28de-719a-41a2-93cd-fe742d1cee45',
  //     eventName: 'Tailor Switft',
  //   },
  // };

  // const headers = new Headers();
  // headers.append('Content-Type', 'application/json');
  // headers.append(
  //   'x-api-key',
  //   'ZjFkNmMwOGYtOTc3ZS00ZmMyLTk3MjAtNjU3N2RmZGRhY2U2',
  // );

  // const response = await fetch(
  //   'http://localhost:3001/oidc/create-credential-offer',
  //   {
  //     method: 'POST',
  //     headers: headers,
  //     body: JSON.stringify(payload),
  //   },
  // );

  // const data = await response.json();

  const qrCodeBuffer = await QRCode.toBuffer('test123');

  const utapi = new UTApi({
    token: process.env.UPLOADTHING_TOKEN,
  });

  const file = new File([qrCodeBuffer], `${randomUUID()}.png`, {
    type: 'image/png',
  });

  const uploadResponse = (await utapi.uploadFiles([file]))[0];

  console.log(uploadResponse);
};

main().catch(console.error);
