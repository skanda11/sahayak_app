
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassTab from './class-tab';
import PerformanceTab from './performance-tab';
import ActivityTab from './activity-tab';

export default function TeacherView({children}: {children: React.ReactNode}) {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
            {children}
        </div>
    );
}
