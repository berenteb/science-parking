import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@/config/environment.config';

export const AuthOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: `openid https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`,
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.accessToken) {
        return {
          ...session,
          accessToken: token.accessToken,
        };
      }

      return session;
    },
    async jwt({ account, token }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
  },
};

const handler = NextAuth(AuthOptions);

export { handler as GET, handler as POST };
