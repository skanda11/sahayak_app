"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { CheckCircle2, XCircle, Percent } from "lucide-react";
import { Progress } from "../ui/progress";

export default function QuizClient({ questions }: { questions: QuizQuestion[] }) {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);

    const handleAnswerChange = (questionIndex: number, value: string) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionIndex]: value }));
    };

    const handleSubmit = () => {
        let correctCount = 0;
        questions.forEach((q, i) => {
            if (answers[i] === q.correctAnswer) {
                correctCount++;
            }
        });
        setScore((correctCount / questions.length) * 100);
        setSubmitted(true);
    };

    const handleReset = () => {
        setAnswers({});
        setSubmitted(false);
        setScore(0);
    }
    
    const isAllAnswered = Object.keys(answers).length === questions.length;

    return (
        <div className="space-y-6">
            {!submitted ? (
                questions.map((q, index) => (
                    <Card key={index} className="bg-background/50">
                        <CardHeader>
                            <CardTitle className="text-base font-medium">{index + 1}. {q.question}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <RadioGroup onValueChange={(value) => handleAnswerChange(index, value)} value={answers[index]}>
                                {q.options.map(option => (
                                    <div key={option.letter} className="flex items-center space-x-3 rounded-md border p-3 hover:bg-accent/50 transition-colors">
                                        <RadioGroupItem value={option.letter} id={`${index}-${option.letter}`} />
                                        <Label htmlFor={`${index}-${option.letter}`} className="flex-1 cursor-pointer">{option.text}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </CardContent>
                    </Card>
                ))
            ) : (
                <>
                    <Card className="text-center">
                        <CardHeader>
                            <CardTitle className="text-3xl font-headline">Quiz Complete!</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-center gap-2 text-5xl font-bold text-primary">
                                <Percent />
                                <span>{score.toFixed(0)}</span>
                            </div>
                            <p className="text-muted-foreground">You answered {Math.round(score/100 * questions.length)} out of {questions.length} questions correctly.</p>
                            <Progress value={score} className="w-full" />
                        </CardContent>
                    </Card>

                    {questions.map((q, index) => {
                         const userAnswer = answers[index];
                         const isCorrect = userAnswer === q.correctAnswer;
                         return (
                            <Card key={index} className={isCorrect ? "border-green-500" : "border-red-500"}>
                                <CardHeader>
                                    <CardTitle className="text-base font-medium">{index + 1}. {q.question}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {q.options.map(option => {
                                        const isSelected = userAnswer === option.letter;
                                        const isCorrectAnswer = q.correctAnswer === option.letter;

                                        let stateClass = "";
                                        if (isSelected && isCorrect) stateClass = "bg-green-100 dark:bg-green-900/30";
                                        else if (isSelected && !isCorrect) stateClass = "bg-red-100 dark:bg-red-900/30";
                                        else if (isCorrectAnswer) stateClass = "bg-green-100 dark:bg-green-900/30";

                                        return (
                                            <div key={option.letter} className={`flex items-center justify-between rounded-md border p-3 mb-2 ${stateClass}`}>
                                                <span>{option.letter}) {option.text}</span>
                                                {isCorrectAnswer && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                                                {isSelected && !isCorrect && <XCircle className="h-5 w-5 text-red-600" />}
                                            </div>
                                        )
                                    })}
                                </CardContent>
                            </Card>
                         )
                    })}
                </>
            )}

            <div className="flex justify-end gap-4">
                {submitted ? (
                     <Button onClick={handleReset}>Try Again</Button>
                ) : (
                     <Button onClick={handleSubmit} disabled={!isAllAnswered}>Submit Quiz</Button>
                )}
            </div>
        </div>
    );
}
