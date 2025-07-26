
'use client';

import { getSubjectById } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressChart } from './progress-chart';
import { GradesTable } from './grades-table';
import AiInsights from './ai-insights';
import { Award, TrendingDown, TrendingUp, Target } from 'lucide-react';
import type { Student } from '@/lib/types';
import ConceptClarifier from '../concept-clarification/concept-clarifier';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import StudentQuery from './student-query';

export default function StudentView({ student }: { student: Student }) {

  const grades = student.grades.map(g => g.grade);
  const averageGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
  
  // Sort grades by date to get the latest for trend calculation
  const sortedGradesByDate = [...student.grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestGrades = sortedGradesByDate.slice(-2);
  const gradeTrend = latestGrades.length > 1 ? latestGrades[1].grade - latestGrades[0].grade : 0;
  
  const sortedGradesByScore = [...student.grades].sort((a, b) => b.grade - a.grade);
  const bestSubjectId = sortedGradesByScore.length > 0 ? sortedGradesByScore[0].subjectId : null;
  const bestSubject = bestSubjectId ? getSubjectById(bestSubjectId) : null;

  return (
    <Tabs defaultValue="dashboard">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold font-headline">Student Dashboard</h1>
        <TabsList>
            <TabsTrigger value="dashboard">Overview</TabsTrigger>
            <TabsTrigger value="clarifier">Concept Clarifier</TabsTrigger>
            <TabsTrigger value="query">Ask a Query</TabsTrigger>
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
                        <GradesTable grades={sortedGradesByDate.slice(-5).reverse()} />
                    </CardContent>
                </Card>
            </div>
        </div>
      </TabsContent>
      <TabsContent value="clarifier">
        <ConceptClarifier />
      </TabsContent>
       <TabsContent value="query">
        <StudentQuery />
      </TabsContent>
    </Tabs>
  );
}
