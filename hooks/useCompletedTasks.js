import { useState } from 'react';

export default function useCompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState([]);

  // Function to log completed tasks, rewards, or punishments with a date and points
  const logCompletion = (itemName, itemType, points) => {
    const dateCompleted = new Date().toLocaleDateString();
    setCompletedTasks([
      ...completedTasks,
      { itemName, itemType, points, dateCompleted },
    ]);
  };

  // Function to fetch completed items by type (e.g., 'reward', 'punishment', 'task')
  const getCompletedByType = (type) =>
    completedTasks.filter((task) => task.itemType === type);

  return { completedTasks, logCompletion, getCompletedByType };
}