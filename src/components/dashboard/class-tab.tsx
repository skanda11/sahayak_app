
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import GradeInputForm from "./grade-input-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useState } from "react";
import { Button } from "../ui/button";
import MaterialUploadForm from "./material-upload-form";

export default function ClassTab() {
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Placeholder data
  const classes = ['Grade 5', 'Grade 6', 'Grade 7'];
  const subjects = ['Mathematics', 'Science', 'English', 'History', 'Biology'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Management</CardTitle>
        <CardDescription>
          Select a class and subject to manage grades, feedback, and reference materials.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Class</label>
                <Select onValueChange={setSelectedClass} value={selectedClass}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select or add a class" />
                    </SelectTrigger>
                    <SelectContent>
                        {classes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                         <SelectItem value="add-new-class">
                            <span className="text-primary">Add new class...</span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select or add a subject" />
                    </SelectTrigger>
                    <SelectContent>
                        {subjects.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                        <SelectItem value="add-new-subject">
                             <span className="text-primary">Add new subject...</span>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {selectedClass && selectedSubject && (
            <div className="space-y-6 pt-6 border-t">
                <div>
                    <h3 className="text-lg font-medium">Reference Materials for {selectedClass} - {selectedSubject}</h3>
                    <p className="text-sm text-muted-foreground">Upload textbooks, notes, or other reference materials for this subject.</p>
                    <MaterialUploadForm classId={selectedClass} subjectId={selectedSubject} />
                </div>
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium">Enter Grades for {selectedClass} - {selectedSubject}</h3>
                    <GradeInputForm />
                </div>

            </div>
        )}

      </CardContent>
    </Card>
  );
}
