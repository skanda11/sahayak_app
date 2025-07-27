

'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActivityTab from './activity-tab';
import ClassTab from './class-tab';
import ContentReview from './content-review';
import PerformanceTab from './performance-tab';

export default function TeacherDashboard() {
  return (
    <Tabs defaultValue="class">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline">Teacher Dashboard</h1>
        <TabsList>
          <TabsTrigger value="class">Class</TabsTrigger>
          <TabsTrigger value="content-review">Content Review</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="class">
        <ClassTab />
      </TabsContent>
      <TabsContent value="content-review">
        <ContentReview />
      </TabsContent>
      <TabsContent value="performance">
        <PerformanceTab />
      </TabsContent>
      <TabsContent value="activity">
        <ActivityTab />
      </Tabs-Content>
    </Tabs>
  );
}
