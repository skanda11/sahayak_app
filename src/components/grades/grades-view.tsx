
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Student, Subject } from '@/lib/types';
import { Badge } from '../ui/badge';

function getGradeColor(grade: number) {
    if (grade >= 90) return 'bg-green-500 hover:bg-green-500';
    if (grade >= 80) return 'bg-blue-500 hover:bg-blue-500';
    if (grade >= 70) return 'bg-yellow-500 hover:bg-yellow-500';
    return 'bg-red-500 hover:bg-red-500';
}

export default function GradesView({ students, subjects }: { students: Student[], subjects: Subject[] }) {
    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle>Student Grades Overview</CardTitle>
                    <CardDescription>A complete list of all student grades across every subject.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Student</TableHead>
                                {subjects.map(subject => (
                                    <TableHead key={subject.id} className="text-center">{subject.name}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map(student => {
                                const studentGrades = subjects.map(subject => {
                                    const grade = student.grades.find(g => g.subjectId === subject.id);
                                    return { subjectId: subject.id, grade };
                                });

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
                                        {studentGrades.map(({ subjectId, grade }) => (
                                            <TableCell key={`${student.id}-${subjectId}`} className="text-center">
                                                {grade ? (
                                                     <Badge variant="default" className={`text-white ${getGradeColor(grade.grade)}`}>
                                                        {grade.grade}%
                                                    </Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">N/A</span>
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
