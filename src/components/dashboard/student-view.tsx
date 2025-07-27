

'use client';

import { getSubjectById } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProgressChart } from './progress-chart';
import { GradesTable } from './grades-table';
import {AiInsights} from './ai-insights';
import { Award, TrendingDown, TrendingUp, Target, ClipboardCheck, FileText, FolderOpen } from 'lucide-react';
import type { Student, Assignment, Material } from '@/lib/types';
import ConceptClarifier from '../concept-clarification/concept-clarifier';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import StudentQuery from './student-query';
import AssignmentView from './assignment-view';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';

export default function StudentDashboard({ student, assignments, materials }: { student: Student, assignments: Assignment[], materials: (Material & {subjectName: string})[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') || 'dashboard';

  const grades = student.grades.map(g => g.grade);
  const averageGrade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;
  
  // Sort grades by date to get the latest for trend calculation
  const sortedGradesByDate = [...student.grades].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const latestGrades = sortedGradesByDate.slice(-2);
  const gradeTrend = latestGrades.length > 1 ? latestGrades[1].grade - latestGrades[0].grade : 0;
  
  const sortedGradesByScore = [...student.grades].sort((a, b) => b.grade - a.grade);
  const bestSubjectId = sortedGradesByScore.length > 0 ? sortedGradesByScore[0].subjectId : null;
  const bestSubject = bestSubjectId ? getSubjectById(bestSubjectId) : null;

  const openAssignments = assignments.filter(a => a.status === 'pending');

  const materialsBySubject = materials.reduce((acc, material) => {
    (acc[material.subjectName] = acc[material.subjectName] || []).push(material);
    return acc;
  }, {} as Record<string, (Material & {subjectName: string})[]>);

  const onTabChange = (value: string) => {
    router.push(`/dashboard?role=student&studentId=${student.id}&tab=${value}`);
  }

  return (
    <Tabs value={tab} onValueChange={onTabChange}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-headline">Student Dashboard</h1>
        <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="dashboard" className="flex-1 sm:flex-initial">Overview</TabsTrigger>
            <TabsTrigger value="assignments" className="flex-1 sm:flex-initial">
                Assignments
                {openAssignments.length > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {openAssignments.length}
                    </span>
                )}
            </TabsTrigger>
            <TabsTrigger value="references" className="flex-1 sm:flex-initial">References</TabsTrigger>
            <TabsTrigger value="clarifier" className="flex-1 sm:flex-initial">Concept Clarifier</TabsTrigger>
            <TabsTrigger value="query" className="flex-1 sm:flex-initial">Ask a Query</TabsTrigger>
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
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
                <Card className="xl:col-span-3">
                    <CardHeader>
                        <CardTitle>Performance Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ProgressChart grades={student.grades} />
                    </CardContent>
                </Card>
                <Card className="xl:col-span-2">
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
      <TabsContent value="assignments">
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold font-headline">Your Assignments</h2>
            {assignments.length === 0 ? (
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                        <ClipboardCheck className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mt-4">All Caught Up!</h3>
                        <p className="text-muted-foreground mt-2">You don't have any pending assignments.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {assignments.map(assignment => (
                        <AssignmentView key={assignment.id} assignment={assignment} studentId={student.id} />
                    ))}
                </div>
            )}
        </div>
      </TabsContent>
      <TabsContent value="references">
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold font-headline">Reference Materials</h2>
            {materials.length === 0 ? (
                <Card>
                    <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
                        <FolderOpen className="h-12 w-12 text-muted-foreground" />
                        <h3 className="text-xl font-semibold mt-4">No Materials Found</h3>
                        <p className="text-muted-foreground mt-2">Your teacher has not uploaded any reference materials yet.</p>
                    </CardContent>
                </Card>
            ) : (
                <Accordion type="multiple" className="w-full">
                {Object.entries(materialsBySubject).map(([subjectName, subjectMaterials]) => (
                  <AccordionItem value={subjectName} key={subjectName}>
                    <AccordionTrigger className="text-xl font-semibold">
                      {subjectName}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {subjectMaterials.map((material) => (
                           <Card key={material.id}>
                               <CardContent className="p-3">
                                   <a href={material.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                                       <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                                       <div className="flex-grow truncate">
                                           <p className="font-medium truncate group-hover:underline">{material.name}</p>
                                           <Badge variant="outline" className="text-xs">{material.type}</Badge>
                                       </div>
                                   </a>
                               </CardContent>
                           </Card>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
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
