import axios from 'axios';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { AuthOptions } from '@/config/auth-options';

export async function GET() {
  const session = await getServerSession(AuthOptions);
  if (!session) {
    return NextResponse.redirect('http://localhost:3000');
  }
  const accessToken = (session as any).accessToken;
  const calendarListResponse = await axios.get('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return NextResponse.json(calendarListResponse.data);
}
