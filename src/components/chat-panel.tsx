
'use client';

import * as React from 'react';
import { Bot, Loader2, Send, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { profile } from '@/lib/data';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
}

const QUICK_PROMPTS = [
    "Why should we hire you?",
    "Tell me about the web-monitor-saas project.",
    "How do your skills match a senior frontend developer role?",
];

export default function ChatPanel() {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  React.useEffect(() => {
    if(messages.length === 0 && !isLoading) {
      addMessage("Hello! I'm Afroz's AI assistant. You can ask me anything about his skills, projects, or experience. How can I help you?", 'ai');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const addMessage = (text: string, sender: 'user' | 'ai') => {
    setMessages(prev => [...prev, { id: Date.now().toString(), text, sender }]);
  };

  const handleSend = async (prompt?: string) => {
    const userMessage = prompt || input;
    if (!userMessage.trim()) return;

    addMessage(userMessage, 'user');
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'generic-chat',
          payload: {
            message: userMessage,
            history: messages
          }
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }

      const data = await res.json();
      const aiResponse = data.answer || data.explanation || data.summary || "I'm not sure how to answer that. Please try asking another way.";
      addMessage(aiResponse, 'ai');

    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get response from AI assistant.',
      });
      addMessage("Sorry, I encountered an error. Please try again.", 'ai');
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex h-full flex-col bg-background text-foreground">
      <CardHeader className="flex-shrink-0 border-b">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile.avatarUrl} alt="AI Assistant" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 block h-3 w-3 rounded-full border-2 border-background bg-green-500" />
          </div>
          <div>
            <CardTitle className="font-headline text-lg text-primary">AI Assistant</CardTitle>
            <CardDescription>Ask about Afroz&apos;s profile, projects, and skills.</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-grow" ref={scrollAreaRef}>
        <div className="p-4 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex items-start gap-3", message.sender === 'user' ? "justify-end" : "")}>
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><Bot size={20} /></AvatarFallback>
                </Avatar>
              )}
              <div className={cn("max-w-md rounded-xl px-4 py-2.5", message.sender === 'user' ? "bg-primary/90 text-primary-foreground" : "bg-muted")}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback><User size={20} /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback><Bot size={20} /></AvatarFallback>
              </Avatar>
              <div className="max-w-md rounded-xl px-4 py-3 bg-muted">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Assistant is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        {messages.length <= 1 && !isLoading && (
            <div className="p-4 space-y-2">
                <p className='text-sm text-muted-foreground'>Or try one of these prompts:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {QUICK_PROMPTS.map(prompt => (
                        <button
                          key={prompt}
                          onClick={() => handleSend(prompt)}
                          className="text-left text-sm p-3 rounded-lg border bg-background hover:bg-muted transition-colors"
                        >
                          {prompt}
                        </button>
                    ))}
                </div>
            </div>
        )}
      </ScrollArea>

      <div className="border-t p-4 flex-shrink-0">
        <div className="relative">
          <Textarea
            ref={inputRef}
            placeholder="Ask anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            className="pr-20 min-h-[40px]"
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            {input && <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setInput('')}><X size={18}/></Button>}
            <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()} size="icon" className="h-8 w-8">
              <Send size={18}/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

