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
import type { Student, Subject } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { addGrade } from "@/lib/mock-data"
import { useRouter } from "next/navigation"

const formSchema = z.object({
  studentId: z.string().min(1, { message: "Please select a student." }),
  subjectId: z.string().min(1, { message: "Please select a subject." }),
  grade: z.coerce.number().min(0).max(100, { message: "Grade must be between 0 and 100." }),
  feedback: z.string().min(5, { message: "Feedback must be at least 5 characters." }).max(200),
})

interface GradeInputFormProps {
    students: Student[];
    subjects: Subject[];
}

export default function GradeInputForm({ students, subjects }: GradeInputFormProps) {
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            studentId: "",
            subjectId: "",
            grade: undefined,
            feedback: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        // In a real app, this would be a server action
        addGrade(values.studentId, values.subjectId, values.grade, values.feedback)
        
        toast({
          title: "Grade Submitted!",
          description: `Grade for ${students.find(s => s.id === values.studentId)?.name} in ${subjects.find(s => s.id === values.subjectId)?.name} has been recorded.`,
          className: "bg-accent text-accent-foreground"
        })
        form.reset()
        router.refresh()
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Student</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a student" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {students.map(student => (
                                        <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="subjectId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                                <Input type="number" placeholder="e.g., 85" {...field} />
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
                                <Textarea placeholder="Provide constructive feedback..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Submitting..." : "Submit Grade"}
                </Button>
            </form>
        </Form>
    )
}
