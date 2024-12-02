// components/ClientSessionProvider.tsx
'use client';

import { SessionProvider } from "next-auth/react";

export function ClientSessionProvider({ children }: { children: React.ReactNode }) {
  return     <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
  {children}
</SessionProvider>;
}