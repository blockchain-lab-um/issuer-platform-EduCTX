import { authOptions } from '@/lib/auth';
import clsx from 'clsx';
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

  const getClaimedCoupons = async () => {
    try {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/coupons/claimed-coupons`,
        {
          headers: {
            'x-api-key': process.env.API_KEY || '',
          },
        },
      );

      if (!result.ok) {
        throw new Error('Failed to fetch claimed coupons');
      }

      const claimedCoupons = await result.json();
      return (claimedCoupons as any[]).sort((a, b) => {
        return (
          new Date(a.claimedAt).getTime() - new Date(b.claimedAt).getTime()
        );
      });
    } catch (error) {
      console.error(error);
      return [];
    }
  };

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
      return (credentials as any[]).filter(
        (credential) => credential.email && credential.credential,
      );
    } catch (error) {
      console.error(error);
      return [];
    }
  };

  const claimedCoupons = await getClaimedCoupons();
  const credentials = await getCredentials();

  const credentialIdToEmailMap = new Map(
    credentials.map((credential) => [
      credential.credential.vc.id,
      credential.email,
    ]),
  );

  return (
    <>
      <div className="w-full max-w-[1920px] mx-auto h-full flex flex-col p-8">
        <div className="bg-green-500 text-white py-4 px-6 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">Claimed Coupons</h1>
        </div>
        <div className="flex-grow overflow-auto bg-white shadow-md rounded-b-lg">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="py-4 px-6 text-left">Coupon Name</th>
                <th className="py-4 px-6 text-left">Coupon</th>
                <th className="py-4 px-6 text-left">Claimed At</th>
                <th className="py-4 px-6 text-left">Credential ID</th>
                <th className="py-4 px-6 text-left">Email</th>
              </tr>
            </thead>
            <tbody>
              {claimedCoupons.map(
                ({ couponName, coupon, claimedAt, credentialId }, index) => (
                  <tr
                    key={index}
                    className={clsx(
                      'border-b border-gray-100 transition-colors',
                      index % 2 === 0
                        ? 'bg-white hover:bg-gray-50'
                        : 'bg-gray-50 hover:bg-gray-100',
                    )}
                  >
                    <td className="py-4 px-6">
                      <div className="text-xs font-mono truncate max-w-[150px] md:max-w-[250px]">
                        {couponName}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs font-mono truncate max-w-[150px] md:max-w-[250px]">
                        {coupon}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-600">
                        {new Date(claimedAt).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-xs font-mono truncate max-w-[150px] md:max-w-[250px]">
                        {credentialId}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-medium text-gray-800">
                        {credentialIdToEmailMap.get(credentialId)}
                      </span>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
