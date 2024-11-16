import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { TbCalendarPlus } from 'react-icons/tb';

import { AuthOptions } from '@/app/api/auth/[...nextauth]/route';
import { LoginButton, LogoutButton } from '@/components/auth-button';
import { CurrentParkingStatus } from '@/components/current-parking-status';
import { Providers } from '@/components/providers';

export default async function LoginPage() {
  const session = await getServerSession(AuthOptions);
  return (
    <main className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-center'>Science Parking</h1>
      {session?.user ? <p>Welcome, {session.user.name}!</p> : <LoginButton />}
      {session?.user && (
        <>
          <Providers>
            <CurrentParkingStatus />
          </Providers>
          <Link href='/calendar'>
            <button className='primary large w-full'>
              <TbCalendarPlus /> Reserve spot
            </button>
          </Link>
          <LogoutButton />
        </>
      )}
    </main>
  );
}
