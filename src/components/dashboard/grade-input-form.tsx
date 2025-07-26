
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Subject } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { addGrade, getAllSubjects, getStudentByRollNumber, createAssignment } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  rollNumber: z.string().min(1, { message: "Roll number is required." }),
  studentId: z.string().optional(),
  studentName: z.string().optional(),
  subjectId: z.string().min(1, { message: "Please select a subject." }),
  grade: z.coerce.number().min(0).max(100, { message: "Grade must be between 0 and 100." }),
  feedback: z.string().min(5, { message: "Feedback must be at least 5 characters." }).max(200),
})


export default function GradeInputForm() {
    const { toast } = useToast()
    const router = useRouter()
    const subjects = getAllSubjects();
    const [foundStudentName, setFoundStudentName] = useState<string | null>(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isNewStudent, setIsNewStudent] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            rollNumber: "",
            studentId: "",
            studentName: "",
            subjectId: "",
            grade: undefined,
            feedback: "",
        },
    })

    const debounced = useDebouncedCallback(async (rollNumber: string) => {
        if (rollNumber) {
            setIsSearching(true);
            const student = await getStudentByRollNumber(rollNumber);
            if (student) {
                setFoundStudentName(student.name);
                form.setValue("studentId", student.id);
                form.setValue("studentName", student.name);
                form.clearErrors("rollNumber");
                setIsNewStudent(false);
            } else {
                setFoundStudentName(null);
                setIsNewStudent(true);
                form.setError("rollNumber", { type: "manual", message: "New student. Please provide a name." });
            }
            setIsSearching(false);
        } else {
            setFoundStudentName(null);
            setIsNewStudent(false);
        }
    }, 500);

    const keywords = ['improvement', 'areas', 'improve', 'build'];

    async function onSubmit(values: z.infer<typeof formSchema>) {
        let studentId = values.studentId;
        let studentName = values.studentName;
        const subject = subjects.find(s => s.id === values.subjectId);
        if (!subject) return;

        if (isNewStudent) {
            if (!studentName) {
                 toast({
                    title: "Error",
                    description: "Please enter a name for the new student.",
                    variant: "destructive"
                });
                return;
            }
            // Create a new student ID. This could be more sophisticated in a real app.
            studentId = `student-${Date.now()}`;
        }

        if (!studentId || !studentName) {
            toast({
              title: "Error",
              description: "Could not find or create a student. Please check the details and try again.",
              variant: "destructive"
            });
            return;
        }

        await addGrade(studentId, studentName, values.subjectId, values.grade, values.feedback, values.rollNumber)
        
        toast({
          title: "Grade Submitted!",
          description: `Grade for ${studentName} in ${subject?.name} has been recorded.`,
          className: "bg-accent text-accent-foreground"
        })

        // Check for keywords and create assignment
        const feedbackText = values.feedback.toLowerCase();
        if (keywords.some(keyword => feedbackText.includes(keyword))) {
            try {
                await createAssignment(studentId, subject.id, subject.name, values.feedback);
                toast({
                    title: "Assignment Created",
                    description: `An assignment has been created for ${studentName} based on your feedback.`,
                    className: "bg-primary text-primary-foreground"
                })
            } catch(e) {
                console.error("Failed to create assignment:", e);
                toast({
                    title: "Assignment Failed",
                    description: "Could not create an assignment for the student.",
                    variant: "destructive"
                })
            }
        }

        form.reset({
            rollNumber: "",
            studentId: "",
            studentName: "",
            subjectId: "",
            grade: undefined,
            feedback: "",
        });
        setFoundStudentName(null);
        setIsNewStudent(false);
        router.refresh()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="rollNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Student Roll Number</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input 
                                      placeholder="e.g., R001" 
                                      {...field} 
                                      onChange={(e) => {
                                        field.onChange(e);
                                        debounced(e.target.value);
                                      }}
                                    />
                                    {isSearching && <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />}
                                </div>
                            </FormControl>
                             <FormMessage />
                             {foundStudentName && (
                                <p className="text-sm text-green-600 font-medium mt-1">Found: {foundStudentName}</p>
                            )}
                        </FormItem>
                    )}
                />
                 {isNewStudent && (
                    <FormField
                        control={form.control}
                        name="studentName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Student Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter the new student's full name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                 <FormField
                    control={form.control}
                    name="subjectId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a subject" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {subjects.map(subject => (
                                        <SelectItem key={subject.id} value={subject.id}>{subject.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Grade (%)</FormLabel>
                            <FormControl>
                                <Input type="number" placeholder="e.g., 85" {...field} value={field.value ?? ''}/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="feedback"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Feedback</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Please mention the areas of improvement for the student. This prompt will be used to generate specialised content for the student." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting || (!foundStudentName && !isNewStudent)}>
                    {form.formState.isSubmitting ? "Submitting..." : "Submit Grade"}
                </Button>
            </form>
        </Form>
    )
}
