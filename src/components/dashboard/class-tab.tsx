
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GradeInputForm from "./grade-input-form";
import { SeedButton } from "./seed-button";


export default function ClassTab() {

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grade Input</CardTitle>
          <CardDescription>
            Enter grades and feedback for students. If a roll number is not found, you will be prompted to create a new student.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GradeInputForm />
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Database Management</CardTitle>
          <CardDescription>
            Use this button to populate your Firestore database with initial mock data for students and grades. This is useful for the first time setup.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <SeedButton />
        </CardContent>
       </Card>
    </div>
  );
}
