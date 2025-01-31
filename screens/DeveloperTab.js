import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';
import { useTheme } from '../App';
import { useHabits } from '../data/HabitsContext';

// All possible combinations to test
const TEST_CONFIGS = {
  task: ['progress', 'completion'],
  badHabit: ['slipup', 'threshold']
};

const RECURRENCES = ['none', 'daily', 'weekly', 'monthly'];
const DAYS = ['Monday', 'Wednesday', 'Friday']; // Sample days for weekly

export default function DeveloperTab() {
  const theme = useTheme();
  const { rewards, punishments, addReward, addPunishment } = useRewardsPunishments();
  const { addTask } = useHabits();
  const [rewardCounter, setRewardCounter] = useState(1);
  const [punishmentCounter, setPunishmentCounter] = useState(1);
  const [habitCounter, setHabitCounter] = useState(1);
  const [testedCombos, setTestedCombos] = useState([]);

  const getNextUntested = () => {
    const allCombos = [];
    Object.entries(TEST_CONFIGS).forEach(([mode, conditions]) => {
      conditions.forEach(condition => {
        allCombos.push(`${mode}-${condition}`);
      });
    });
    
    return allCombos.find(combo => !testedCombos.includes(combo)) || allCombos[0];
  };

  const handleAddExampleReward = () => {
    const points = Math.max(0, rewardCounter - 2);
    addReward({
      name: `Test Reward ${rewardCounter}`,
      description: 'Test reward',
      points,
      quantity: 0
    });
    setRewardCounter(prev => prev + 1);
  };

  const handleAddExamplePunishment = () => {
    addPunishment({
      name: `Test Punishment ${punishmentCounter}`,
      description: 'Test punishment',
      count: 0
    });
    setPunishmentCounter(prev => prev + 1);
  };

  const handleAddExampleHabit = () => {
    if (rewards.length === 0 || punishments.length === 0) {
      alert('Please add some rewards and punishments first');
      return;
    }

    // Get next untested combination
    const nextCombo = getNextUntested();
    const [mode, condition] = nextCombo.split('-');

    // Generate random values
    const recurrence = RECURRENCES[Math.floor(Math.random() * RECURRENCES.length)];
    const dueDate = new Date();
    dueDate.setMinutes(dueDate.getMinutes() + Math.floor(Math.random() * 10));
    
    // Select random rewards/punishments
    const selectedRewards = rewards
      .filter(r => r.points > 0) // Non-free rewards only
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(r => ({ name: r.name, quantity: Math.floor(Math.random() * 3) + 1 }));

    const selectedPunishments = punishments
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map(p => ({ name: p.name, quantity: Math.floor(Math.random() * 3) + 1 }));

    const newHabit = {
      name: `Test ${condition} ${mode} ${habitCounter}`,
      description: `Auto-generated test habit`,
      mode,
      rewardCondition: mode === 'task' ? condition : 'none',
      punishmentCondition: mode === 'badHabit' ? condition : 'none',
      requiredCompletion: Math.floor(Math.random() * 5) + 1,
      maxSlipups: Math.floor(Math.random() * 5) + 1,
      rewards: selectedRewards,
      punishments: selectedPunishments,
      progressPoints: Math.floor(Math.random() * 10),
      completionPoints: Math.floor(Math.random() * 10),
      slipupPoints: Math.floor(Math.random() * 10),
      failurePoints: Math.floor(Math.random() * 10),
      recurrence,
      selectedDays: recurrence === 'weekly' ? DAYS : [],
      dueDate,
      dueTime: dueDate,
      progress: 0,
      slipups: 0,
      isCompleted: false
    };

    addTask(newHabit);
    setHabitCounter(prev => prev + 1);
    setTestedCombos(prev => [...prev, nextCombo]);
  };

  return (
    <View style={theme.container}>
      <Text style={theme.title}>Developer Tools</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Add Example Reward" 
          onPress={handleAddExampleReward}
        />
        <Button 
          title="Add Example Punishment" 
          onPress={handleAddExamplePunishment}
        />
        <Button 
          title="Add Example Habit" 
          onPress={handleAddExampleHabit}
        />
      </View>

      <View style={styles.counterInfo}>
        <Text>Reward Counter: {rewardCounter}</Text>
        <Text>Punishment Counter: {punishmentCounter}</Text>
        <Text>Habit Counter: {habitCounter}</Text>
        <Text>Combinations Tested: {testedCombos.length}/4</Text>
        <Text>Next: {getNextUntested()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    gap: 10,
    marginVertical: 20,
  },
  counterInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  }
});