'use client';

import * as React from 'react';
import Terminal from '@/components/terminal';
import ChatPanel from '@/components/chat-panel';
import { Button } from '@/components/ui/button';
import { MessageSquare, Terminal as TerminalIcon } from 'lucide-react';
import { type HistoryItem } from '@/lib/types';
import { WelcomeMessage } from '@/components/terminal/outputs';

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
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4 lg:p-8 transition-colors duration-300">
      <div className="absolute top-4 right-4 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowChat(!showChat)}
          className="bg-background/80 backdrop-blur-sm"
        >
          {showChat ? (
            <>
              <TerminalIcon className="mr-2 h-4 w-4" /> Go to Terminal
            </>
          ) : (
            <>
              <MessageSquare className="mr-2 h-4 w-4" /> Chat with AI
            </>
          )}
        </Button>
      </div>

      <div className="w-full max-w-7xl flex-grow rounded-lg border shadow-2xl shadow-primary/10 overflow-hidden">
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
