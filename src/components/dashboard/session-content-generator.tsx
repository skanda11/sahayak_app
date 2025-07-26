"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Loader2, Wand2 } from "lucide-react";
import { generateSessionContent } from "@/ai/flows/session-content-generation";
import { addContent } from "@/lib/mock-data";

interface Props {
    classId: string;
    subjectId: string;
    grade: string;
    subject: string;
}

export default function SessionContentGenerator({ classId, subjectId, grade, subject }: Props) {
    const [topic, setTopic] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast({
                title: "Topic is required",
                description: "Please enter a topic title to generate content.",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await generateSessionContent({ topic, subject, grade });
            
            await addContent({
                classId,
                subjectId,
                subjectName: subject,
                grade,
                sessionTitle: topic,
                sessionContent: result.sessionContent,
                status: 'under-review',
            });
            
            toast({
                title: "Content Generated Successfully!",
                description: `Session content for "${topic}" is now available for review.`,
                className: "bg-accent text-accent-foreground"
            });
            setTopic('');
        } catch (error) {
            console.error("Content generation failed:", error);
            toast({
                title: "Generation Failed",
                description: "Something went wrong while generating the content.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Introduction to Algebra, The Solar System"
                disabled={isLoading}
                className="h-11 text-base"
            />
            <Button onClick={handleGenerate} disabled={isLoading || !topic.trim()} className="h-11 w-full sm:w-auto">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Generate Content
            </Button>
        </div>
    )
}
