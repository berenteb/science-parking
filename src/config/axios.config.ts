import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';

export const CalendarAxiosInstance = axios.create({
  baseURL: 'https://www.googleapis.com/calendar/v3',
});

CalendarAxiosInstance.interceptors.request.use(async (config) => {
  const accessToken = await getAccessToken();
  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

CalendarAxiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut();
    }
    return Promise.reject(error);
  }
);

async function getAccessToken() {
  const session = await getSession();
  if (!session) {
    throw new Error('No session found');
  }
  return (session as any).accessToken;
}
