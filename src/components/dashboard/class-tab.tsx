
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GradeInputForm from "./grade-input-form";

export default function ClassTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Management</CardTitle>
        <CardDescription>
          Input student grades and feedback here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GradeInputForm />
      </CardContent>
    </Card>
  );
}
