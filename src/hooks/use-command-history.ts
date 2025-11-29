'use client';

import * as React from 'react';

export const useCommandHistory = () => {
  const [commandHistory, setCommandHistory] = React.useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = React.useState(-1);

  const addCommandToHistory = (command: string) => {
    if (command && command.trim()) {
      setCommandHistory(prev => [command, ...prev.filter(c => c !== command).slice(0, 49)]);
      setHistoryIndex(-1);
    }
  };

  const navigateHistory = (direction: 'up' | 'down') => {
    if (direction === 'up') {
      const newIndex = Math.min(historyIndex + 1, commandHistory.length - 1);
      setHistoryIndex(newIndex);
      return commandHistory[newIndex];
    } else { // 'down'
      const newIndex = Math.max(historyIndex - 1, -1);
      setHistoryIndex(newIndex);
      return newIndex >= 0 ? commandHistory[newIndex] : '';
    }
  };

  return { commandHistory, addCommandToHistory, navigateHistory };
};
