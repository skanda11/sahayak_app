import { AppLayout } from '@/components/layout/app-layout';
import React from 'react';

export default function ConceptClarificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
