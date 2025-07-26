'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassTab from './class-tab';
import PerformanceTab from './performance-tab';
import ActivityTab from './activity-tab';

export default function TeacherView() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
             <Tabs defaultValue="class" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="class">Class</TabsTrigger>
                    <TabsTrigger value="performance">Performance</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>
                <TabsContent value="class">
                    <ClassTab />
                </TabsContent>
                <TabsContent value="performance">
                    <PerformanceTab />
                </TabsContent>
                <TabsContent value="activity">
                    <ActivityTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
