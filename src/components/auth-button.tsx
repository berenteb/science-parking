'use client';

import { signIn, signOut } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';
import { TbLogout } from 'react-icons/tb';

export function LoginButton() {
  return (
    <button onClick={() => signIn('google')} className='primary large'>
      <FcGoogle />
      <span>Sign in with Google</span>
    </button>
  );
}

export function LogoutButton() {
  return (
    <button onClick={() => signOut()} className='large w-full'>
      <TbLogout />
      <span>Sign out</span>
    </button>
  );
}
