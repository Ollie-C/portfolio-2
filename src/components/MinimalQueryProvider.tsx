import React from 'react';

interface MinimalQueryProviderProps {
  children: React.ReactNode;
}

export default function MinimalQueryProvider({
  children,
}: MinimalQueryProviderProps) {
  return <>{children}</>;
}
