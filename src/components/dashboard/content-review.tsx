'use client';

import { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllContent, updateContentStatus } from '@/lib/mock-data';
import type { Content } from '@/lib/types';
import { Check, Loader2 } from 'lucide-react';

export default function ContentReview() {
  const [content, setContent] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function loadContent() {
      setIsLoading(true);
      const allContent = await getAllContent();
      setContent(allContent);
      setIsLoading(false);
    }
    loadContent();
  }, []);

  const handleMarkAsReviewed = async (contentId: string) => {
    setUpdatingId(contentId);
    await updateContentStatus(contentId, 'reviewed');
    const updatedContent = content.map(item =>
      item.id === contentId ? { ...item, status: 'reviewed' } : item
    );
    setContent(updatedContent);
    setUpdatingId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content for Review</CardTitle>
        <CardDescription>
          Review the AI-generated session content and mark it as reviewed when ready.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {content.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No content has been generated yet.</p>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {content.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={item.id}>
                <AccordionTrigger>
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="text-left">
                      <p className="font-semibold">{item.sessionTitle}</p>
                      <p className="text-sm text-muted-foreground">{item.grade} - {item.subjectName}</p>
                    </div>
                    <Badge variant={item.status === 'reviewed' ? 'secondary' : 'default'} className={item.status === 'reviewed' ? 'bg-green-100 text-green-800' : ''}>
                      {item.status}
                    </Badge>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="prose max-w-none p-4 border rounded-md bg-muted/50">
                    <div dangerouslySetInnerHTML={{ __html: item.sessionContent }} />
                  </div>
                   {item.status === 'under-review' && (
                    <div className="text-right mt-4">
                      <Button
                        size="sm"
                        onClick={() => handleMarkAsReviewed(item.id)}
                        disabled={updatingId === item.id}
                      >
                        {updatingId === item.id ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Check className="mr-2 h-4 w-4" />
                        )}
                        Mark as Reviewed
                      </Button>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
