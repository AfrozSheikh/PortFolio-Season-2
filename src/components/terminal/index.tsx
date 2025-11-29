'use client';

import * as React from 'react';
import { profile, skills, projects, experience, education, achievements, links } from '@/lib/data';
import { useCommandHistory } from '@/hooks/use-command-history';
import { handleCommand } from './command-handler';
import { HistoryItem } from '@/lib/types';
import { Terminal as TerminalIcon } from 'lucide-react';

interface TerminalProps {
  history: HistoryItem[];
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
  setTheme: (theme: string) => void;
  setShowChat: (show: boolean) => void;
}

const TerminalHeader = () => (
  <div className="flex items-center h-8 px-3 bg-zinc-800/50 dark:bg-zinc-800/50 border-b border-white/10 flex-shrink-0">
    <div className="flex space-x-2">
      <div className="w-3 h-3 rounded-full bg-red-500"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
      <div className="w-3 h-3 rounded-full bg-green-500"></div>
    </div>
    <div className="flex-grow text-center text-sm font-sans text-zinc-400">
      <TerminalIcon className="inline-block h-4 w-4 mr-1 -mt-0.5" />
      <span>afroz@portfolio: ~</span>
    </div>
  </div>
);

const InputLine = ({ value, onChange, onKeyDown, inputRef }: any) => (
  <div className="flex text-base w-full">
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
  }, [history]);

  const processCommand = (command: string) => {
    if (command.trim() === 'clear') {
        setHistory([]);
        return;
    }
    const output = handleCommand({
      command,
      setHistory,
      setTheme,
      setShowChat,
      data: { profile, skills, projects, experience, education, achievements, links },
    });
    setHistory(prev => [...prev, { id: prev.length, input: command, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if(inputValue.trim()){
        addCommandToHistory(inputValue);
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
        setHistory([]);
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="h-full flex flex-col bg-background/80 backdrop-blur-sm" onClick={handleTerminalClick}>
      <TerminalHeader />
      <div ref={terminalRef} className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col space-y-4">
          {history.map((item, index) => (
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
