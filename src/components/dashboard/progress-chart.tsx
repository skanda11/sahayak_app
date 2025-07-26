"use client";

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Grade, Subject } from '@/lib/types';
import { useMemo } from 'react';
import { getAllSubjects } from '@/lib/mock-data';

interface ProgressChartProps {
  grades: Grade[];
}

export function ProgressChart({ grades }: ProgressChartProps) {
  const subjects = getAllSubjects();
  const data = useMemo(() => {
    const dataByDate: { [date: string]: any } = {};
    grades.forEach(grade => {
      const date = new Date(grade.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!dataByDate[date]) {
        dataByDate[date] = { date };
      }
      dataByDate[date][grade.subjectId] = grade.grade;
    });
    
    return Object.values(dataByDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [grades]);

  const subjectColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

  return (
    <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart
            data={data}
            margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
            }}
            >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[50, 100]} tickFormatter={(value) => `${value}%`}/>
            <Tooltip
                contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "var(--radius)",
                }}
            />
            <Legend wrapperStyle={{fontSize: "14px"}} />
            {subjects.map((subject, index) => (
                <Line
                key={subject.id}
                type="monotone"
                dataKey={subject.id}
                name={subject.name}
                stroke={subjectColors[index % subjectColors.length]}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                />
            ))}
            </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
