
import { getAllStudents, getSubjectById, getAllSubjects, seedDatabase } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import GradeInputForm from "./grade-input-form";
import { Progress } from "@/components/ui/progress";
import type { Student, Subject } from "@/lib/types";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Users, BookOpen, Database, User } from "lucide-react";
import Link from "next/link";
import { SeedButton } from "./seed-button";


// This is now an async Server Component
export default async function TeacherView() {
    const students = await getAllStudents();
    const subjects = getAllSubjects();

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold font-headline">Teacher Dashboard</h1>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{students.length}</div>
                        <p className="text-xs text-muted-foreground">students enrolled</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{subjects.length}</div>
                        <p className="text-xs text-muted-foreground">subjects offered</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Database Actions</CardTitle>
                         <Database className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <SeedButton />
                        <p className="text-xs text-muted-foreground mt-2">Add mock data if empty.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quick Views</CardTitle>
                         <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         <div className="flex flex-col gap-2">
                            <Button asChild size="sm" className="w-full">
                                <Link href="/student-view?studentId=student-1">
                                    <User className="mr-2" />
                                    View as Student 1
                                </Link>
                            </Button>
                            <Button asChild size="sm" variant="outline" className="w-full">
                                <Link href="/student-view?studentId=student-2">
                                    <User className="mr-2" />
                                    View as Student 2
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
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
                                        const latestGrade = [...student.grades].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
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
                            <GradeInputForm />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
