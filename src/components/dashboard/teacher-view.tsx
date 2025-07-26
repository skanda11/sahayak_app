
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClassTab from './class-tab';
import SessionsTab from './sessions-tab';
import ReviewTab from './review-tab';

export default function TeacherView() {
    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
            <Tabs defaultValue="class">
                <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="class">Class</TabsTrigger>
                    <TabsTrigger value="sessions">Sessions</TabsTrigger>
                    <TabsTrigger value="review">Review</TabsTrigger>
                </TabsList>
                <TabsContent value="class">
                   <ClassTab />
                </TabsContent>
                <TabsContent value="sessions">
                    <SessionsTab />
                </TabsContent>
                <TabsContent value="review">
                    <ReviewTab />
                </TabsContent>
            </Tabs>
        </div>
    );
}
