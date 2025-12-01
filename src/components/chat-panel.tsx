'use client';

import * as React from 'react';
import { Bot, Loader2, Send, User, X, Sparkles, Terminal as TerminalIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
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

export default function ChatPanel({ setShowChat }: { setShowChat: (show: boolean) => void }) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const { toast } = useToast();
  const viewportRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    if(viewportRef.current) {
        viewportRef.current.scrollTo({ top: viewportRef.current.scrollHeight, behavior: 'smooth' });
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

  const updateLastMessage = (text: string) => {
    setMessages(prev => {
        const lastMsg = prev[prev.length - 1];
        if(lastMsg && lastMsg.sender === 'ai'){
            return [...prev.slice(0, -1), {...lastMsg, text: lastMsg.text + text}];
        }
        // If last message is not from AI, create a new one
        return [...prev, {id: Date.now().toString(), text, sender: 'ai'}];
    });
  }

  const handleSend = async (prompt?: string) => {
    const userMessage = prompt || input;
    if (!userMessage.trim()) return;

    const newHistory = [...messages, { id: Date.now().toString(), text: userMessage, sender: 'user' as const }];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          history: messages
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }
      
      if (!res.body) {
        throw new Error('Response body is null');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      addMessage('', 'ai');

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        const chunk = decoder.decode(value, { stream: !done });
        updateLastMessage(chunk);
      }

    } catch (error) {
      console.error(error);
      const errText = "Sorry, I encountered an error. Please try again or use a quick prompt.";
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.sender === 'ai' && lastMsg.text === '') {
        updateLastMessage(errText);
      } else {
        addMessage(errText, 'ai');
      }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to get response from AI assistant.',
      });
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="flex h-full flex-col bg-card/80 backdrop-blur-sm text-card-foreground">
      <CardHeader className="flex-shrink-0 border-b p-4">
        <div className="flex items-center justify-between space-x-2 sm:space-x-4">
            <div className='flex items-center space-x-2 sm:space-x-4'>
                <div className="relative">
                    <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary/50">
                    <AvatarImage src={profile.avatarUrl} alt="AI Assistant" />
                    <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 block h-3 w-3 sm:h-4 sm:w-4 rounded-full border-2 border-background bg-green-500" />
                </div>
                <div>
                    <CardTitle className="font-headline text-base sm:text-lg text-primary flex items-center gap-2">
                        <Sparkles size={20}/>
                        <span>AI Assistant</span>
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Your guide to Afroz&apos;s portfolio.</CardDescription>
                </div>
            </div>
            <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChat(false)}
                className="h-8 text-xs sm:text-sm bg-background/80 backdrop-blur-sm border-primary/50 text-primary hover:bg-primary/10 hover:text-primary"
            >
                <TerminalIcon className="mr-2 h-4 w-4" />
                <span>Terminal</span>
            </Button>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-grow" viewportRef={viewportRef}>
        <div className="p-4 sm:p-6 space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex items-start gap-3 sm:gap-4", message.sender === 'user' ? "justify-end" : "")}>
              {message.sender === 'ai' && (
                <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-primary/20 bg-background">
                    <AvatarFallback className='bg-transparent text-primary'><Bot size={18} /></AvatarFallback>
                </Avatar>
              )}
              <div className={cn(
                  "max-w-xl rounded-lg px-3 py-2 sm:px-4 sm:py-3 shadow-sm prose prose-sm prose-invert prose-p:my-0",
                   message.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-muted"
                )}>
                {message.text ? (
                    <p className="whitespace-pre-wrap">{message.text}</p>
                ) : (
                    <div className="flex items-center space-x-2 text-muted-foreground p-1">
                        <Loader2 className="h-5 w-5 animate-spin" />
                    </div>
                )}
              </div>
              {message.sender === 'user' && (
                <Avatar className="h-8 w-8 sm:h-9 sm-w-9 border">
                  <AvatarFallback><User size={18} /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && messages[messages.length-1]?.sender !== 'ai' && (
            <div className="flex items-start gap-4">
              <Avatar className="h-9 w-9 border-2 border-primary/20 bg-background">
                <AvatarFallback className='bg-transparent text-primary'><Bot size={20} /></AvatarFallback>
              </Avatar>
              <div className="max-w-lg rounded-lg px-4 py-3 bg-muted shadow-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Assistant is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        {messages.length <= 1 && !isLoading && (
            <div className="p-4 sm:p-6 space-y-3">
                <p className='text-sm text-muted-foreground'>Or try one of these prompts:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {QUICK_PROMPTS.map(prompt => (
                        <button
                          key={prompt}
                          onClick={() => handleSend(prompt)}
                          className="text-left text-sm p-3 rounded-lg border bg-background/50 hover:bg-muted transition-colors text-foreground"
                        >
                          {prompt}
                        </button>
                    ))}
                </div>
            </div>
        )}
        <ScrollBar/>
      </ScrollArea>

      <div className="border-t bg-card/50 p-2 sm:p-4 flex-shrink-0">
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
            className="pr-20 sm:pr-24 min-h-[44px] text-base bg-input placeholder:text-muted-foreground"
            rows={1}
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            {input && !isLoading && <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9" onClick={() => setInput('')}><X size={18}/></Button>}
            <Button onClick={() => handleSend()} disabled={isLoading || !input.trim()} size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18}/>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
