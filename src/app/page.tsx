'use client';

import * as React from 'react';
import Terminal from '@/components/terminal';
import ChatPanel from '@/components/chat-panel';
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
    <main className="relative flex min-h-screen flex-col items-center justify-center p-2 sm:p-4 lg:p-6 transition-colors duration-300 bg-background text-foreground">
      <div className="w-full max-w-7xl flex-grow rounded-lg border shadow-2xl shadow-primary/10 overflow-hidden bg-card">
        {showChat ? (
          <ChatPanel setShowChat={setShowChat} />
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
