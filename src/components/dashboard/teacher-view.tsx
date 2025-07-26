'use client';

import { getAllStudents, getSubjectById } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GradeInputForm from "./grade-input-form";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import type { Student } from "@/lib/types";
import { Skeleton } from "../ui/skeleton";

function TeacherViewContent({ students }: { students: Student[] }) {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Student Overview</CardTitle>
                        <CardDescription>View all students and their average performance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Student</TableHead>
                                    <TableHead className="text-center">Average Grade</TableHead>
                                    <TableHead className="hidden md:table-cell">Recent Feedback</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {students.map(student => {
                                    const averageGrade = student.grades.length > 0 
                                        ? student.grades.reduce((acc, g) => acc + g.grade, 0) / student.grades.length
                                        : 0;
                                    const latestGrade = student.grades.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                                    const latestSubject = latestGrade ? getSubjectById(latestGrade.subjectId) : null;

                                    return (
                                        <TableRow key={student.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="student avatar" />
                                                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="font-medium">{student.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex flex-col items-center gap-1">
                                                    <span>{averageGrade.toFixed(1)}%</span>
                                                    <Progress value={averageGrade} className="h-2 w-24" />
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell max-w-xs truncate">
                                                {latestGrade 
                                                    ? `"${latestGrade.feedback}" on ${latestSubject?.name}`
                                                    : "No feedback yet."
                                                }
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Input Grades</CardTitle>
                        <CardDescription>Add a new grade and feedback for a student.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GradeInputForm students={students} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function TeacherViewSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
                <Skeleton className="h-[400px] w-full" />
            </div>
            <div>
                <Skeleton className="h-[400px] w-full" />
            </div>
        </div>
    )
}

export default function TeacherView() {
    const [students, setStudents] = useState<Student[] | null>(null);

    useEffect(() => {
        getAllStudents().then(setStudents);
    }, []);

    if (students === null) {
        return <TeacherViewSkeleton />;
    }

    return <TeacherViewContent students={students} />;
}
