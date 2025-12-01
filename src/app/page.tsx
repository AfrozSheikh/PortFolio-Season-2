'use client';

import * as React from 'react';
import Terminal from '@/components/terminal';
import ChatPanel from '@/components/chat-panel';
import { Button } from '@/components/ui/button';
import { MessageSquare, Terminal as TerminalIcon } from 'lucide-react';
import { type HistoryItem } from '@/lib/types';
import { WelcomeMessage } from '@/components/terminal/outputs';
import { cn } from '@/lib/utils';

export default function Home() {
  const [theme, setTheme] = React.useState('dark');
  const [showChat, setShowChat] = React.useState(false);
  const [history, setHistory] = React.useState<HistoryItem[]>([
    { id: 0, input: '', output: <WelcomeMessage /> },
  ]);

  React.useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 lg:p-6 transition-colors duration-300 bg-background text-foreground">
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowChat(!showChat)}
          className={cn(
            "bg-background/80 backdrop-blur-sm border-primary/50 text-primary hover:bg-primary/10 hover:text-primary",
            !showChat && "ai-chat-button-glow"
          )}
        >
          {showChat ? (
            <>
              <TerminalIcon className="mr-2 h-4 w-4" /> Terminal
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" /> Assistant
            </>
          )}
        </Button>
      </div>

      <div className="w-full max-w-7xl flex-grow rounded-lg border shadow-2xl shadow-primary/10 overflow-hidden bg-card">
        {showChat ? (
          <ChatPanel />
        ) : (
          <Terminal
            history={history}
            setHistory={setHistory}
            setTheme={setTheme}
            setShowChat={setShowChat}
          />
        )}
      </div>
    </main>
  );
}
