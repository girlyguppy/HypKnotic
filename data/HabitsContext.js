import React, { createContext, useContext, useState } from 'react';

const HabitsContext = createContext();

export const useHabits = () => useContext(HabitsContext);

export const HabitsProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks([...tasks, task]);
  };

  const removeTask = (taskName) => {
    setTasks(tasks.filter(task => task.name !== taskName));
  };

  const updateTask = (taskName, updates) => {
    setTasks(tasks.map(task => 
      task.name === taskName ? { ...task, ...updates } : task
    ));
  };

  return (
    <HabitsContext.Provider
      value={{
        tasks,
        setTasks,
        addTask,
        removeTask,
        updateTask,
      }}
    >
      {children}
    </HabitsContext.Provider>
  );
};