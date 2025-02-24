import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

const AUTHORIZED_ACCOUNTS = process.env.AUTHORIZED_ACCOUNTS
  ? process.env.AUTHORIZED_ACCOUNTS.split(',')
  : [];

export const dynamic = 'force-dynamic';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (
    !session ||
    !session.user?.email ||
    !AUTHORIZED_ACCOUNTS.includes(session.user.email)
  ) {
    // Not authorized
    return <div className="h-screen bg-gray-50">Not authorized</div>;
  }
  const getCredentials = async () => {
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_ISSUER_ENDPOINT}/credentials`,
        {
          headers: {
            'x-api-key': process.env.API_KEY || '',
          },
        },
      );
      const credentials = await result.json();
      return credentials as any[];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const credentials = await getCredentials();

  return (
    <div className="h-screen bg-gray-50">
      <div className="flex flex-col items-center justify-center h-full">
        <h1 className="text-2xl font-bold">Credentials</h1>
        <div className="mt-4 flex flex-col gap-4">
          {credentials.map((credential) => (
            <div key={credential.vc.id} className="flex flex-row gap-2">
              <div>{credential.vc.id}</div>
              <div>{credential.vc.type.slice(1).join(', ')}</div>
              <div>{new Date(credential.iat * 1000).toLocaleString()}</div>
              <div>{credentialSubject(credential)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const credentialSubject = (credential: any) => {
  const credentialSubject = credential.vc.credentialSubject;

  if (credential.vc.type.includes('EducationCredential')) {
    return (
      <div>
        {credentialSubject.currentFamilyName}{' '}
        {credentialSubject.currentGivenName}
      </div>
    );
  }

  if (credential.vc.type.includes('CouponCredential')) {
    return (
      <div>
        {credentialSubject.couponId} {credentialSubject.couponName}
      </div>
    );
  }

  return JSON.stringify(credentialSubject);
};
