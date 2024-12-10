import axios from 'axios';
import { JWT } from 'next-auth/jwt';

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@/config/environment.config';

export async function refreshAccessToken(token: JWT) {
  if (typeof token.refreshToken !== 'string') {
    return token;
  }
  try {
    const searchParams = new URLSearchParams();

    searchParams.append('client_id', GOOGLE_CLIENT_ID);
    searchParams.append('client_secret', GOOGLE_CLIENT_SECRET);
    searchParams.append('grant_type', 'refresh_token');
    searchParams.append('refresh_token', token.refreshToken);

    const url = `https://oauth2.googleapis.com/token?${searchParams.toString()}`;

    const response = await axios.post<{
      access_token: string;
      refresh_token?: string;
    }>(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return {
      ...token,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.error(error);
    return token;
  }
}
