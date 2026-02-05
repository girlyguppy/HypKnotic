import React, { createContext, useContext, useState, useCallback } from 'react';

const HistoryContext = createContext();

export const useHistory = () => useContext(HistoryContext);

// Action types for history entries
export const HistoryType = {
  REWARD_PURCHASED: 'reward_purchased',
  REWARD_USED: 'reward_used',
  REWARD_CREATED: 'reward_created',
  REWARD_DELETED: 'reward_deleted',
  PUNISHMENT_CREATED: 'punishment_created',
  PUNISHMENT_DELETED: 'punishment_deleted',
  PUNISHMENT_APPLIED: 'punishment_applied',
  PUNISHMENT_COMPLETED: 'punishment_completed',
  TASK_CREATED: 'task_created',
  TASK_COMPLETED: 'task_completed',
  TASK_PROGRESS: 'task_progress',
  TASK_FAILED: 'task_failed',
  TASK_DELETED: 'task_deleted',
  HABIT_SLIPUP: 'habit_slipup',
  POINTS_ADDED: 'points_added',
  POINTS_SUBTRACTED: 'points_subtracted',
  NOTE_CREATED: 'note_created',
  NOTE_DELETED: 'note_deleted',
  JOURNAL_CREATED: 'journal_created',
  JOURNAL_DELETED: 'journal_deleted',
  THEME_CHANGED: 'theme_changed',
};

// Human-readable labels for history types
const typeLabels = {
  [HistoryType.REWARD_PURCHASED]: 'Reward Purchased',
  [HistoryType.REWARD_USED]: 'Reward Used',
  [HistoryType.REWARD_CREATED]: 'Reward Created',
  [HistoryType.REWARD_DELETED]: 'Reward Deleted',
  [HistoryType.PUNISHMENT_CREATED]: 'Punishment Created',
  [HistoryType.PUNISHMENT_DELETED]: 'Punishment Deleted',
  [HistoryType.PUNISHMENT_APPLIED]: 'Punishment Applied',
  [HistoryType.PUNISHMENT_COMPLETED]: 'Punishment Completed',
  [HistoryType.TASK_CREATED]: 'Task Created',
  [HistoryType.TASK_COMPLETED]: 'Task Completed',
  [HistoryType.TASK_PROGRESS]: 'Task Progress',
  [HistoryType.TASK_FAILED]: 'Task Failed',
  [HistoryType.TASK_DELETED]: 'Task Deleted',
  [HistoryType.HABIT_SLIPUP]: 'Habit Slip-up',
  [HistoryType.POINTS_ADDED]: 'Points Added',
  [HistoryType.POINTS_SUBTRACTED]: 'Points Subtracted',
  [HistoryType.NOTE_CREATED]: 'Note Created',
  [HistoryType.NOTE_DELETED]: 'Note Deleted',
  [HistoryType.JOURNAL_CREATED]: 'Journal Entry Created',
  [HistoryType.JOURNAL_DELETED]: 'Journal Entry Deleted',
  [HistoryType.THEME_CHANGED]: 'Theme Changed',
};

// Categorize history types
export const getHistoryCategory = (type) => {
  if (type.startsWith('reward')) return 'Rewards';
  if (type.startsWith('punishment')) return 'Punishments';
  if (type.startsWith('task') || type.startsWith('habit')) return 'Habits';
  if (type.startsWith('note')) return 'Notes';
  if (type.startsWith('journal')) return 'Journals';
  if (type.startsWith('points')) return 'Points';
  return 'Other';
};

export const HistoryProvider = ({ children }) => {
  const [history, setHistory] = useState([]);

  // Add a new history entry
  const addHistoryEntry = useCallback((type, details = {}) => {
    const entry = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      label: typeLabels[type] || type,
      category: getHistoryCategory(type),
      details,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
    };
    
    setHistory(prev => [entry, ...prev]);
    return entry;
  }, []);

  // Get history filtered by category
  const getHistoryByCategory = useCallback((category) => {
    return history.filter(entry => entry.category === category);
  }, [history]);

  // Get history filtered by type
  const getHistoryByType = useCallback((type) => {
    return history.filter(entry => entry.type === type);
  }, [history]);

  // Get history for a specific date
  const getHistoryByDate = useCallback((date) => {
    const dateStr = new Date(date).toLocaleDateString();
    return history.filter(entry => entry.date === dateStr);
  }, [history]);

  // Get recent history (last N entries)
  const getRecentHistory = useCallback((count = 10) => {
    return history.slice(0, count);
  }, [history]);

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  // Get stats
  const getStats = useCallback(() => {
    const today = new Date().toLocaleDateString();
    const todayEntries = history.filter(entry => entry.date === today);
    
    return {
      total: history.length,
      today: todayEntries.length,
      byCategory: {
        rewards: getHistoryByCategory('Rewards').length,
        punishments: getHistoryByCategory('Punishments').length,
        habits: getHistoryByCategory('Habits').length,
        notes: getHistoryByCategory('Notes').length,
        journals: getHistoryByCategory('Journals').length,
      },
    };
  }, [history, getHistoryByCategory]);

  return (
    <HistoryContext.Provider
      value={{
        history,
        addHistoryEntry,
        getHistoryByCategory,
        getHistoryByType,
        getHistoryByDate,
        getRecentHistory,
        clearHistory,
        getStats,
        HistoryType,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
};
