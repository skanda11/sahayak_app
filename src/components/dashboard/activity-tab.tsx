
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getAllStudents } from "@/lib/mock-data";
import type { Student, Assignment } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function ActivityTab() {
  const [studentsWithAssignments, setStudentsWithAssignments] = useState<(Student & {assignments: Assignment[]})[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      const allStudents = await getAllStudents();
      const studentsWithAssignments = allStudents.filter(s => s.assignments && s.assignments.length > 0) as (Student & {assignments: Assignment[]})[];
      setStudentsWithAssignments(studentsWithAssignments);
      setIsLoading(false);
    }
    fetchStudents();
  }, []);

  const allAssignments = studentsWithAssignments.flatMap(s => s.assignments.map(a => ({...a, studentName: s.name})));
  allAssignments.sort((a,b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime());


  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Student Activity</CardTitle>
                <CardDescription>
                    Monitor recent student activity and assignment submissions.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">Loading activity data...</p>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Activity</CardTitle>
        <CardDescription>
          Monitor recent student activity and assignment submissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {allAssignments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No assignments have been created yet.</p>
        ) : (
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Assigned On</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {allAssignments.map(assignment => (
                        <TableRow key={assignment.id}>
                            <TableCell>{assignment.studentName}</TableCell>
                            <TableCell>{assignment.subjectName}</TableCell>
                            <TableCell>{new Date(assignment.assignedDate).toLocaleDateString()}</TableCell>
                            <TableCell>
                                <Badge variant={assignment.status === 'completed' ? 'secondary' : 'default'} className={assignment.status === 'completed' ? 'bg-green-100 text-green-800' : ''}>
                                    {assignment.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        )}
      </CardContent>
    </Card>
  );
}
