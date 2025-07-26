import { getSubjectById } from '@/lib/mock-data';
import type { Grade } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

function getGradeColor(grade: number) {
    if (grade >= 90) return 'bg-green-500 hover:bg-green-500';
    if (grade >= 80) return 'bg-blue-500 hover:bg-blue-500';
    if (grade >= 70) return 'bg-yellow-500 hover:bg-yellow-500';
    return 'bg-red-500 hover:bg-red-500';
}

export function GradesTable({ grades }: { grades: Grade[] }) {
  return (
    <div className="w-full">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Grade</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {grades.map((grade, index) => {
                    const subject = getSubjectById(grade.subjectId);
                    if (!subject) return null;
                    return (
                        <TableRow key={`${grade.subjectId}-${index}`}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <subject.icon className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <div className="font-medium">{subject.name}</div>
                                        <div className="text-xs text-muted-foreground truncate">{grade.feedback}</div>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Badge variant="default" className={`text-white ${getGradeColor(grade.grade)}`}>
                                    {grade.grade}%
                                </Badge>
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    </div>
  );
}
