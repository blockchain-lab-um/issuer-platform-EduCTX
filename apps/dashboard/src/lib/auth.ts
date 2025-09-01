import type { NextAuthOptions } from 'next-auth';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
    }),
    ...(process.env.USE_TEST_PROVIDER
      ? [
          CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize() {
              // Always return a successful authentication
              return {
                id: '1',
                name: 'Test User',
                email: 'test@example.com',
              };
            },
          }),
        ]
      : []),
  ],
};
