
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MaterialUploadForm from "./material-upload-form";
import ExistingMaterials from "./existing-materials";
import { SeedButton } from "./seed-button";

// Mock data for classes and subjects
const classes = [
    { id: 'grade-5', name: 'Grade 5' },
    { id: 'grade-6', name: 'Grade 6' },
    { id: 'grade-7', name: 'Grade 7' },
]

const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' },
]

export default function ClassTab() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Management</CardTitle>
          <CardDescription>
            Select a class and subject to manage reference materials.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select onValueChange={setSelectedClass} value={selectedClass}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a Class" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map(c => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                 <Select onValueChange={setSelectedSubject} value={selectedSubject} disabled={!selectedClass}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a Subject" />
                    </SelectTrigger>
                    <SelectContent>
                        {subjects.map(s => (
                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedClass && selectedSubject && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <MaterialUploadForm classId={selectedClass} subjectId={selectedSubject} />
                    <ExistingMaterials classId={selectedClass} subjectId={selectedSubject} />
                 </div>
            )}
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
