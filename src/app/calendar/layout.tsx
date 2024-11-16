import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { PropsWithChildren } from 'react';

import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { Providers } from '@/components/providers';

export default async function CalendarsLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(AuthOptions);

  if (!session) {
    return redirect('/');
  }
  return <Providers>{children}</Providers>;
}
