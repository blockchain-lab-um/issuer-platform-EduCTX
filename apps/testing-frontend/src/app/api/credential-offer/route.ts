import type { NextRequest } from 'next/server';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const dynamic = 'force-dynamic';

const SUPPORTED_CREDENTIAL_TYPES = [
  'InTimeIssuance',
  'DefferedIssuance',
  'PreAuthIssuance',
];

export async function POST(request: NextRequest) {
  try {
    // Read request body
    const { credentialType, client_id } = await request.json();

    if (!client_id) {
      return new Response('Missing client_id parameter', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (!credentialType) {
      return new Response('Missing credentialType parameter', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    if (!SUPPORTED_CREDENTIAL_TYPES.includes(credentialType)) {
      return new Response('Invalid credentialType parameter', {
        status: 400,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const response = await fetch(
      `${process.env.ISSUER_ENDPOINT}/oidc/create-credential-offer`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.API_KEY!,
        },
        body: JSON.stringify({
          credential_type: [
            'VerifiableCredential',
            'VerifiableAttestation',
            credentialType,
          ],
          flow:
            credentialType === 'PreAuthIssuance'
              ? 'pre-authorized_code'
              : 'authorization_code',
          format: 'jwt_vc_json',
          credential_subject: {},
          client_id,
        }),
      },
    );

    console.log(response.status);

    if (!response.ok) {
      return new Response('Error processing request', {
        status: 500,
        headers: {
          ...CORS_HEADERS,
        },
      });
    }

    const { pin, location } = await response.json();

    if (!location) {
      throw new Error('Something went wrong');
    }

    return new Response(
      JSON.stringify({
        pin,
        location,
      }),
      {
        status: 200,
        headers: {
          ...CORS_HEADERS,
        },
      },
    );
  } catch (error) {
    console.log(error);
    return new Response('Error processing request', {
      status: 500,
      headers: {
        ...CORS_HEADERS,
      },
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
    },
  });
}
