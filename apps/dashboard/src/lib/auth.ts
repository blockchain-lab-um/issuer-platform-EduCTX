import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(_, req) {
        const user = {
          id: '1',
          name: 'ETF UNSA',
          email: 'etf-unsa@example.com',
        };

        if (
          req.body?.username === process.env.USERNAME &&
          req.body?.password === process.env.PASSWORD
        ) {
          return user;
        }

        return null;
      },
    }),
  ],
};
