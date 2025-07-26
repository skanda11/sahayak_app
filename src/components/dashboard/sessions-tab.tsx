'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SessionsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Session Content Generation</CardTitle>
        <CardDescription>
          Specify the number of sessions for a subject to generate educational content.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Session content generation functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
