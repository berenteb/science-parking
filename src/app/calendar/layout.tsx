import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { PropsWithChildren } from 'react';

import { Providers } from '@/components/providers';
import { AuthOptions } from '@/config/auth-options';

export default async function CalendarsLayout({ children }: PropsWithChildren) {
  const session = await getServerSession(AuthOptions);

  if (!session) {
    return redirect('/');
  }
  return <Providers>{children}</Providers>;
}
