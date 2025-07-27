
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ActivityTab from './activity-tab';
import ClassTab from './class-tab';
import ContentReview from './content-review';
import PerformanceTab from './performance-tab';
import { useRouter, useSearchParams } from 'next/navigation';

export default function TeacherDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'class';

  const onTabChange = (value: string) => {
    router.push(`/dashboard?tab=${value}`);
  }

  return (
    <Tabs value={tab} onValueChange={onTabChange}>
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
      </TabsContent>
    </Tabs>
  );
}
