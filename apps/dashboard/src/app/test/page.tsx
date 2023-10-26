'use client';

import { signIn, signOut, useSession } from 'next-auth/react';

export default function Test() {
  const { data: session, status } = useSession();
  if (session) {
    return (
      <>
        Signed in <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  );
}
