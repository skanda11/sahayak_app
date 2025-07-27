
'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Wand2, Save } from 'lucide-react';
import { generateSessionContent } from '@/ai/flows/session-content-generation';
import { addContent } from '@/lib/mock-data';

// Mock data - in a real app, this would come from a database
const classes = [
    { id: 'grade-5', name: 'Grade 5' },
    { id: 'grade-6', name: 'Grade 6' },
    { id: 'grade-7', name: 'Grade 7' },
];

const subjects = [
    { id: 'math', name: 'Mathematics' },
    { id: 'science', name: 'Science' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' },
    { id: 'biology', name: 'Biology' },
];

interface GeneratedContent {
    sessionTitle: string;
    sessionContent: string;
}

export default function AiContentStudio() {
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
    const [selectedClass, setSelectedClass] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');
    const { toast } = useToast();

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            toast({
                title: 'Prompt is required',
                description: 'Please enter a prompt to generate content.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        setGeneratedContent(null);
        try {
            console.log(`Invoking Gemini API with prompt: "${prompt}"`);
            const result = await generateSessionContent({ prompt });
            setGeneratedContent(result);
        } catch (error) {
            console.error('Content generation failed:', error);
            toast({
                title: 'Generation Failed',
                description: 'Something went wrong while generating the content.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!generatedContent || !selectedClass || !selectedSubject) {
            toast({
                title: 'Missing Information',
                description: 'Please select a class and subject before saving.',
                variant: 'destructive',
            });
            return;
        }

        setIsLoading(true);
        try {
            const gradeName = classes.find(c => c.id === selectedClass)?.name ?? 'Unknown Grade';
            const subjectName = subjects.find(s => s.id === selectedSubject)?.name ?? 'Unknown Subject';

            await addContent({
                ...generatedContent,
                classId: selectedClass,
                subjectId: selectedSubject,
                grade: gradeName,
                subjectName: subjectName,
                status: 'under-review',
            });

            toast({
                title: 'Content Saved Successfully!',
                description: `Session content for "${generatedContent.sessionTitle}" is now available for review.`,
                className: 'bg-accent text-accent-foreground',
            });
            // Reset state
            setPrompt('');
            setGeneratedContent(null);
            setSelectedClass('');
            setSelectedSubject('');

        } catch (error) {
            console.error('Failed to save content:', error);
             toast({
                title: 'Save Failed',
                description: 'Something went wrong while saving the content.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>AI Content Studio</CardTitle>
                <CardDescription>
                    Generate educational content for your students using a prompt.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Explain the water cycle for 5th graders, including a diagram description and a 3-question quiz."
                        disabled={isLoading}
                        className="h-24 text-base"
                    />
                    <Button onClick={handleGenerate} disabled={isLoading || !prompt.trim()} className="w-full sm:w-auto">
                        {isLoading && !generatedContent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                        Generate Content
                    </Button>

                    {isLoading && !generatedContent && (
                        <div className="text-center py-4">
                            <p className="text-muted-foreground">Generating content, please wait...</p>
                        </div>
                    )}

                    {generatedContent && (
                        <div className="space-y-4 pt-4 border-t">
                             <h3 className="text-xl font-semibold">Generated Content: {generatedContent.sessionTitle}</h3>
                             <div className="prose max-w-none p-4 border rounded-md bg-muted/50 h-64 overflow-y-auto">
                                <div dangerouslySetInnerHTML={{ __html: generatedContent.sessionContent }} />
                            </div>
                            <div className="space-y-2">
                                <h4 className="font-semibold">Assign to a Class & Subject</h4>
                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Select onValueChange={setSelectedClass} value={selectedClass} disabled={isLoading}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Class" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {classes.map(c => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <Select onValueChange={setSelectedSubject} value={selectedSubject} disabled={isLoading}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a Subject" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {subjects.map(s => (
                                                <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                             <Button onClick={handleSave} disabled={isLoading || !selectedClass || !selectedSubject} className="w-full sm:w-auto">
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                Save Content for Review
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
