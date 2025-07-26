'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClassTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Management</CardTitle>
        <CardDescription>
          Define the grades and subjects for your classes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>Class management functionality will be implemented here.</p>
      </CardContent>
    </Card>
  );
}
