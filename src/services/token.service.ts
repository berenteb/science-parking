import axios from 'axios';
import { JWT } from 'next-auth/jwt';

import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '@/config/environment.config';

export async function refreshAccessToken(token: JWT) {
  if (typeof token.refreshToken !== 'string') {
    return {
      ...token,
      error: 'RefreshTokenMissing',
    };
  }

  try {
    const searchParams = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken,
    });

    const url = `https://oauth2.googleapis.com/token?${searchParams.toString()}`;

    const response = await axios.post<{
      access_token: string;
      refresh_token?: string;
      expires_in: number;
    }>(url, null, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return {
      ...token,
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token ?? token.refreshToken,
      expiresAt: Date.now() + response.data.expires_in * 1000,
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}
