
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getAllStudents } from "@/lib/mock-data";
import type { Student } from "@/lib/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AiInsights } from "./ai-insights";
import Link from "next/link";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";

export default function PerformanceTab() {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStudents() {
      const allStudents = await getAllStudents();
      setStudents(allStudents);
      setIsLoading(false);
    }
    fetchStudents();
  }, []);

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Student Performance</CardTitle>
                <CardDescription>
                Review student performance and get AI-powered insights.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-32">
                    <p className="text-muted-foreground">Loading student data...</p>
                </div>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Performance</CardTitle>
        <CardDescription>
          Review student performance and get AI-powered insights.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Average Grade</TableHead>
                    <TableHead>AI Insights</TableHead>
                    <TableHead className="text-right">View Dashboard</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map(student => {
                    const averageGrade = student.grades.length > 0 ? student.grades.reduce((acc, g) => acc + g.grade, 0) / student.grades.length : 0;
                    return (
                        <TableRow key={student.id}>
                            <TableCell>{student.name}</TableCell>
                            <TableCell>{averageGrade > 0 ? `${averageGrade.toFixed(1)}%` : 'N/A'}</TableCell>
                            <TableCell>
                                <AiInsights student={student} />
                            </TableCell>
                            <TableCell className="text-right">
                                <Button asChild variant="outline" size="sm">
                                    <Link href={`/dashboard?role=student&studentId=${student.id}`}>
                                        <ExternalLink className="mr-2 h-4 w-4"/>
                                        View
                                    </Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
