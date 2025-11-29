'use client';

import * as React from 'react';
import { Bot, Loader2, Send } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { projects } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

type AIResponseType = string | null;

export default function ChatPanel() {
  const [activeTab, setActiveTab] = React.useState('why-hire');
  const [isLoading, setIsLoading] = React.useState(false);
  const [response, setResponse] = React.useState<AIResponseType>(null);
  const [jobRequirements, setJobRequirements] = React.useState('');
  const [selectedProject, setSelectedProject] = React.useState('');

  const { toast } = useToast();

  const handleQuery = async (type: string, payload?: any) => {
    setIsLoading(true);
    setResponse(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, payload }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data.answer || data.explanation || data.summary);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get response from AI assistant.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderResponse = () => {
    if (isLoading) {
      return (
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Assistant is thinking...</span>
        </div>
      );
    }
    if (response) {
      return (
        <div className="prose prose-sm prose-p:text-foreground/90 prose-strong:text-primary whitespace-pre-wrap rounded-md border bg-muted/30 p-4">
            {response}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="rounded-full border border-primary/50 bg-primary/20 p-2">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <div>
            <CardTitle className="font-headline text-lg text-primary">AI Assistant</CardTitle>
            <CardDescription>Ask about Afroz&apos;s profile, projects, and skills.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-grow overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="why-hire">Why Hire?</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills Match</TabsTrigger>
          </TabsList>
          <div className="flex-grow mt-4 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="pr-4">
                <TabsContent value="why-hire" className="mt-0">
                  <h3 className="font-semibold text-primary mb-2">Why should we hire Afroz?</h3>
                  <p className="text-sm text-muted-foreground mb-4">Click the button to get a concise summary of Afroz&apos;s key strengths and experiences for a hiring manager.</p>
                  <Button onClick={() => handleQuery('why-hire')} disabled={isLoading}>
                    <Send className="mr-2 h-4 w-4" />
                    Generate Summary
                  </Button>
                </TabsContent>
                <TabsContent value="projects" className="mt-0">
                  <h3 className="font-semibold text-primary mb-2">Explain a project</h3>
                  <p className="text-sm text-muted-foreground mb-4">Select one of Afroz&apos;s projects to get a detailed explanation from the AI assistant.</p>
                  <div className="flex items-center space-x-2">
                    <Select onValueChange={setSelectedProject} value={selectedProject}>
                      <SelectTrigger className="w-full md:w-[280px]">
                        <SelectValue placeholder="Select a project" />
                      </SelectTrigger>
                      <SelectContent>
                        {projects.map((p) => (
                          <SelectItem key={p.slug} value={p.slug}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button onClick={() => handleQuery('project-explanation', { projectSlug: selectedProject })} disabled={isLoading || !selectedProject}>
                      <Send className="mr-2 h-4 w-4" />
                      Explain
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent value="skills" className="mt-0">
                  <h3 className="font-semibold text-primary mb-2">Match skills to job requirements</h3>
                  <p className="text-sm text-muted-foreground mb-4">Paste your job requirements below, and the AI will generate a summary of how Afroz&apos;s skills align with the role.</p>
                  <Textarea
                    placeholder="Paste job description or required skills here..."
                    value={jobRequirements}
                    onChange={(e) => setJobRequirements(e.target.value)}
                    className="mb-2"
                    rows={6}
                  />
                  <Button onClick={() => handleQuery('skills-summary', { jobRequirements })} disabled={isLoading || !jobRequirements}>
                    <Send className="mr-2 h-4 w-4" />
                    Summarize Match
                  </Button>
                </TabsContent>
                <div className="mt-6">{renderResponse()}</div>
              </div>
            </ScrollArea>
          </div>
        </Tabs>
      </CardContent>
    </div>
  );
}
