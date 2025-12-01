'use client';

import * as React from 'react';
import { profile, skills, projects, experience, education, achievements, links } from '@/lib/data';
import { useCommandHistory } from '@/hooks/use-command-history';
import { handleCommand } from './command-handler';
import { HistoryItem } from '@/lib/types';
import { Terminal as TerminalIcon, MessageSquare } from 'lucide-react';
import { WelcomeMessage } from './outputs';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

interface TerminalProps {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  setTheme: (theme: string) => void;
  setShowChat: (show: boolean) => void;
}

const TerminalHeader = ({ setShowChat }: { setShowChat: (show: boolean) => void }) => (
  <div className="grid grid-cols-3 items-center h-10 px-2 sm:px-3 bg-card/50 backdrop-blur-sm border-b flex-shrink-0">
    <div className="flex items-center gap-1.5">
      <div className="w-3 h-3 rounded-full bg-red-500"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
    </div>
    <div className="text-center text-sm font-sans text-muted-foreground truncate">
      <TerminalIcon className="inline-block h-4 w-4 mr-1 -mt-0.5" />
      <span className="hidden sm:inline">afroz@portfolio: ~</span>
      <span className="sm:hidden">afroz@portfolio</span>
    </div>
    <div className="flex justify-end">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowChat(true)}
        className={cn(
          "h-8 text-xs sm:text-sm bg-background/80 backdrop-blur-sm border-primary/50 text-primary hover:bg-primary/10 hover:text-primary",
          "ai-chat-button-glow"
        )}
      >
          <MessageSquare className="mr-2 h-4 w-4" />
          <span>Assistant</span>
      </Button>
    </div>
  </div>
);

const InputLine = ({ value, onChange, onKeyDown, inputRef }: any) => (
  <div className="flex text-base w-full items-center bg-input/70 p-2 rounded-md">
    <span className="text-primary font-bold mr-2">&gt;</span>
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      className="bg-transparent border-none outline-none w-full text-foreground font-code"
      autoFocus
      autoComplete="off"
      autoCapitalize="off"
      autoCorrect="off"
      spellCheck="false"
    />
    <span className="w-2 h-4 bg-primary caret ml-1"></span>
  </div>
);

export default function Terminal({ history, setHistory, setTheme, setShowChat }: TerminalProps) {
  const [inputValue, setInputValue] = React.useState('');
  const { commandHistory, navigateHistory, addCommandToHistory } = useCommandHistory();
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    inputRef.current?.focus();
  }, [history]);
  
  React.useEffect(() => {
    const focusInput = () => inputRef.current?.focus();
    focusInput();
    // Re-focus on window focus
    window.addEventListener('focus', focusInput);
    return () => {
        window.removeEventListener('focus', focusInput);
    }
  }, []);

  const processCommand = (command: string) => {
    if (command.trim().toLowerCase() === 'clear') {
        setHistory([{ id: 0, input: '', output: <WelcomeMessage /> }]);
        return;
    }
    addCommandToHistory(command);
    const output = handleCommand({
      command,
      setHistory,
      setTheme,
      setShowChat,
      onCommand: processCommand,
      data: { profile, skills, projects, experience, education, achievements, links },
    });
    setHistory(prev => [...prev, { id: prev.length, input: command, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if(inputValue.trim()){
        processCommand(inputValue);
      } else {
        setHistory(prev => [...prev, { id: prev.length, input: '', output: null }]);
      }
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevCommand = navigateHistory('up');
      if(prevCommand) setInputValue(prevCommand);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextCommand = navigateHistory('down');
      setInputValue(nextCommand || '');
    } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        setHistory([{ id: 0, input: '', output: <WelcomeMessage /> }]);
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col bg-background/50 backdrop-blur-sm" onClick={handleTerminalClick}>
      <TerminalHeader setShowChat={setShowChat} />
      <div ref={terminalRef} className="flex-grow p-2 sm:p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {history.map((item) => (
            <div key={item.id}>
              {item.input && (
                <div className="flex text-base">
                  <span className="text-primary font-bold mr-2">&gt;</span>
                  <span>{item.input}</span>
                </div>
              )}
              {item.output && <div className="mt-1">{item.output}</div>}
            </div>
          ))}
        </div>
        <div className="mt-4">
          <InputLine
            value={inputValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            inputRef={inputRef}
          />
        </div>
      </div>
    </div>
  );
}
