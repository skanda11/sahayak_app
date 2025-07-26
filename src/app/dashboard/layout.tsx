import { AppLayout } from '@/components/layout/app-layout';
import React, { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function DashboardLoading() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <Skeleton className="h-[400px] w-full" />
                </div>
                <div>
                    <Skeleton className="h-[400px] w-full" />
                </div>
            </div>
        </div>
    )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLayout>
        <Suspense fallback={<DashboardLoading />}>
            {children}
        </Suspense>
    </AppLayout>
  );
}
