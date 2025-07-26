'use client';

import { getStudentById, getSubjectById } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressChart } from './progress-chart';
import { GradesTable } from './grades-table';
import AiInsights from './ai-insights';
import { Award, TrendingDown, TrendingUp, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Student } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import ConceptClarifier from '../concept-clarification/concept-clarifier';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

function StudentViewContent({ student }: { student: Student }) {
  const grades = student.grades.map(g => g.grade);
  const averageGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
  const latestGrades = student.grades.slice(-2);
  const gradeTrend = latestGrades.length > 1 ? latestGrades[1].grade - latestGrades[0].grade : 0;
  
  const sortedGrades = [...student.grades].sort((a, b) => b.grade - a.grade);
  const bestSubjectId = sortedGrades.length > 0 ? sortedGrades[0].subjectId : null;
  const bestSubject = bestSubjectId ? getSubjectById(bestSubjectId) : null;


  return (
    <Tabs defaultValue="dashboard">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold font-headline">Student Dashboard</h1>
        <TabsList>
            <TabsTrigger value="dashboard">Overview</TabsTrigger>
            <TabsTrigger value="clarifier">Concept Clarifier</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="dashboard">
        <div className="flex flex-col gap-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
                        <Target className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{averageGrade.toFixed(1)}%</div>
                        <p className="text-xs text-muted-foreground">Overall performance</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Grade Trend</CardTitle>
                        {gradeTrend >= 0 ? <TrendingUp className="h-4 w-4 text-accent-foreground" /> : <TrendingDown className="h-4 w-4 text-destructive" />}
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${gradeTrend >= 0 ? 'text-accent-foreground' : 'text-destructive'}`}>
                            {gradeTrend >= 0 ? '+' : ''}{gradeTrend.toFixed(1)}%
                        </div>
                        <p className="text-xs text-muted-foreground">From last assessment</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Best Subject</CardTitle>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{bestSubject?.name || 'N/A'}</div>
                        <p className="text-xs text-muted-foreground">Highest scoring subject</p>
                    </CardContent>
                </Card>
                <AiInsights student={student} />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Performance Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProgressChart grades={student.grades} />
                    </CardContent>
                </Card>
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Grades</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <GradesTable grades={student.grades.slice(-5).reverse()} />
                    </CardContent>
                </Card>
            </div>
        </div>
      </TabsContent>
      <TabsContent value="clarifier">
        <ConceptClarifier />
      </TabsContent>
    </Tabs>
  );
}

function StudentViewSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <Skeleton className="lg:col-span-3 h-80 w-full" />
                <Skeleton className="lg:col-span-2 h-80 w-full" />
            </div>
        </div>
    )
}

export default function StudentView({ studentId }: { studentId: string }) {
    const [student, setStudent] = useState<Student | null | undefined>(null);

    useEffect(() => {
        getStudentById(studentId).then(setStudent);
    }, [studentId]);

    if (student === null) {
        return <StudentViewSkeleton />;
    }

    if (student === undefined) {
        return <div>Student not found.</div>;
    }

    return <StudentViewContent student={student} />;
}
