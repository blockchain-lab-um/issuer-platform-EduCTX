import { CredentialsView } from '@/components/CredentialsView';
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

      if (!result.ok) {
        throw new Error('Failed to fetch credentials');
      }

      const credentials = await result.json();
      return credentials as any[];
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const credentials = await getCredentials();

  return <CredentialsView credentials={credentials} />;
}
