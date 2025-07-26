'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReviewTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Review</CardTitle>
        <CardDescription>
          Review the generated session content and approve it for students.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Content review functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
