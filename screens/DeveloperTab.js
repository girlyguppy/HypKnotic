import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';
import { useHabits } from '../data/HabitsContext';

// Realistic sample data fitting the app's theme
const SAMPLE_REWARDS = [
  { name: 'Extra Screen Time', description: '30 minutes of uninterrupted screen time', points: 50 },
  { name: 'Sleep In', description: 'Permission to sleep in an extra hour', points: 75 },
  { name: 'Choose Dinner', description: 'Pick what to have for dinner tonight', points: 40 },
  { name: 'Massage', description: 'A relaxing 15-minute massage', points: 100 },
  { name: 'Movie Night Pick', description: 'Choose the movie for movie night', points: 30 },
  { name: 'Day Off Chores', description: 'Skip assigned chores for one day', points: 150 },
  { name: 'Special Treat', description: 'Get a favorite snack or dessert', points: 25 },
  { name: 'Free Pass', description: 'Skip one assigned task without penalty', points: 200 },
];

const SAMPLE_PUNISHMENTS = [
  { name: 'Early Bedtime', description: 'Go to bed 30 minutes early', count: 0 },
  { name: 'Extra Chores', description: 'Complete one additional household task', count: 0 },
  { name: 'No Sweets', description: 'No desserts or sweets for the day', count: 0 },
  { name: 'Writing Lines', description: 'Write an affirmation 25 times', count: 0 },
  { name: 'Screen Time Reduction', description: 'Reduce screen time by 1 hour today', count: 0 },
  { name: 'Corner Time', description: '10 minutes of quiet reflection time', count: 0 },
];

const SAMPLE_TASKS = [
  { 
    name: 'Morning Routine', 
    description: 'Complete full morning routine by 9 AM',
    mode: 'task',
    rewardCondition: 'completion',
    requiredCompletion: 1,
  },
  { 
    name: 'Exercise Session', 
    description: 'Complete a 30-minute workout',
    mode: 'task',
    rewardCondition: 'completion',
    requiredCompletion: 1,
  },
  { 
    name: 'Drink Water', 
    description: 'Drink 8 glasses of water today',
    mode: 'task',
    rewardCondition: 'progress',
    requiredCompletion: 8,
  },
  { 
    name: 'Study/Practice', 
    description: 'Complete study or practice sessions',
    mode: 'task',
    rewardCondition: 'progress',
    requiredCompletion: 3,
  },
];

const SAMPLE_BAD_HABITS = [
  { 
    name: 'Nail Biting', 
    description: 'Avoid biting nails',
    mode: 'badHabit',
    punishmentCondition: 'threshold',
    maxSlipups: 3,
  },
  { 
    name: 'Swearing', 
    description: 'Avoid using inappropriate language',
    mode: 'badHabit',
    punishmentCondition: 'slipup',
    maxSlipups: 5,
  },
  { 
    name: 'Late Night Snacking', 
    description: 'No eating after 9 PM',
    mode: 'badHabit',
    punishmentCondition: 'threshold',
    maxSlipups: 2,
  },
];

export default function DeveloperTab() {
  const [theme] = useAtom(themeAtom);
  const { rewards, punishments, addReward, addPunishment, addPoints } = useRewardsPunishments();
  const { addTask, tasks } = useHabits();
  const [log, setLog] = useState([]);

  const addLog = (message) => {
    setLog(prev => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 9)]);
  };

  const handleAddSampleRewards = () => {
    let added = 0;
    SAMPLE_REWARDS.forEach(reward => {
      if (!rewards.find(r => r.name === reward.name)) {
        addReward({ ...reward, quantity: 0 });
        added++;
      }
    });
    addLog(`Added ${added} sample rewards`);
  };

  const handleAddSamplePunishments = () => {
    let added = 0;
    SAMPLE_PUNISHMENTS.forEach(punishment => {
      if (!punishments.find(p => p.name === punishment.name)) {
        addPunishment(punishment);
        added++;
      }
    });
    addLog(`Added ${added} sample punishments`);
  };

  const handleAddSampleTasks = () => {
    if (rewards.length === 0 || punishments.length === 0) {
      addLog('⚠️ Add rewards and punishments first!');
      return;
    }

    const currentTasks = tasks || [];
    let added = 0;
    [...SAMPLE_TASKS, ...SAMPLE_BAD_HABITS].forEach(template => {
      if (!currentTasks.find(t => t.name === template.name)) {
        const dueDate = new Date();
        dueDate.setHours(dueDate.getHours() + Math.floor(Math.random() * 24) + 1);
        
        // Pick random rewards/punishments
        const selectedRewards = rewards
          .slice(0, 2)
          .map(r => ({ name: r.name, quantity: 1 }));
        
        const selectedPunishments = punishments
          .slice(0, 2)
          .map(p => ({ name: p.name, quantity: 1 }));

        addTask({
          ...template,
          rewards: selectedRewards,
          punishments: selectedPunishments,
          successPoints: Math.floor(Math.random() * 20) + 10,
          failurePoints: Math.floor(Math.random() * 15) + 5,
          recurrence: 'daily',
          selectedDays: [],
          dueDate,
          dueTime: dueDate,
          progress: 0,
          slipups: 0,
          isCompleted: false,
          hasFailed: false,
        });
        added++;
      }
    });
    addLog(`Added ${added} sample tasks/habits`);
  };

  const handleAddPoints = (amount) => {
    addPoints(amount);
    addLog(`Added ${amount} points`);
  };

  const handleQuickSetup = () => {
    handleAddSampleRewards();
    handleAddSamplePunishments();
    // Use slightly longer delay to ensure state updates have propagated
    setTimeout(() => {
      if (rewards.length > 0 && punishments.length > 0) {
        handleAddSampleTasks();
      } else {
        addLog('⚠️ Please run Quick Setup again to add tasks');
      }
    }, 200);
    handleAddPoints(100);
    addLog('🚀 Quick setup complete!');
  };

  // Dynamic styles
  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors?.background || '#F3E8FF',
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors?.text || '#1A1A1A',
      marginBottom: 16,
    },
    section: {
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors?.text || '#1A1A1A',
      marginBottom: 12,
    },
    button: {
      backgroundColor: theme.colors?.primary || '#9B59B6',
      padding: 14,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 4,
    },
    buttonText: {
      color: theme.colors?.textOnPrimary || '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    quickButton: {
      backgroundColor: theme.colors?.success || '#28A745',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginBottom: 16,
    },
    quickButtonText: {
      color: theme.colors?.successText || '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    pointsRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    pointButton: {
      backgroundColor: theme.colors?.info || '#17A2B8',
      padding: 12,
      borderRadius: 8,
      minWidth: 80,
      alignItems: 'center',
    },
    logContainer: {
      backgroundColor: theme.isDark ? '#1A1A1A' : '#F5F5F5',
      borderRadius: 8,
      padding: 12,
      height: 150,
    },
    logScrollView: {
      flex: 1,
    },
    logText: {
      fontSize: 12,
      color: theme.colors?.textSecondary || '#666666',
      fontFamily: 'monospace',
      marginBottom: 4,
    },
    stats: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 12,
    },
    stat: {
      alignItems: 'center',
    },
    statValue: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors?.primary || '#9B59B6',
    },
    statLabel: {
      fontSize: 12,
      color: theme.colors?.textSecondary || '#666666',
    },
  };

  return (
    <ScrollView style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>🛠️ Developer Tools</Text>
      
      {/* Quick Setup */}
      <TouchableOpacity style={dynamicStyles.quickButton} onPress={handleQuickSetup}>
        <Text style={dynamicStyles.quickButtonText}>🚀 Quick Setup (Add All Sample Data)</Text>
      </TouchableOpacity>

      {/* Stats */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Current Data</Text>
        <View style={dynamicStyles.stats}>
          <View style={dynamicStyles.stat}>
            <Text style={dynamicStyles.statValue}>{rewards.length}</Text>
            <Text style={dynamicStyles.statLabel}>Rewards</Text>
          </View>
          <View style={dynamicStyles.stat}>
            <Text style={dynamicStyles.statValue}>{punishments.length}</Text>
            <Text style={dynamicStyles.statLabel}>Punishments</Text>
          </View>
          <View style={dynamicStyles.stat}>
            <Text style={dynamicStyles.statValue}>{tasks?.length || 0}</Text>
            <Text style={dynamicStyles.statLabel}>Tasks</Text>
          </View>
        </View>
      </View>

      {/* Individual Actions */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Add Sample Data</Text>
        <TouchableOpacity style={dynamicStyles.button} onPress={handleAddSampleRewards}>
          <Text style={dynamicStyles.buttonText}>Add Sample Rewards</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.button} onPress={handleAddSamplePunishments}>
          <Text style={dynamicStyles.buttonText}>Add Sample Punishments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.button} onPress={handleAddSampleTasks}>
          <Text style={dynamicStyles.buttonText}>Add Sample Tasks & Habits</Text>
        </TouchableOpacity>
      </View>

      {/* Points Management */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Quick Points</Text>
        <View style={dynamicStyles.pointsRow}>
          <TouchableOpacity style={dynamicStyles.pointButton} onPress={() => handleAddPoints(10)}>
            <Text style={dynamicStyles.buttonText}>+10</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dynamicStyles.pointButton} onPress={() => handleAddPoints(50)}>
            <Text style={dynamicStyles.buttonText}>+50</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dynamicStyles.pointButton} onPress={() => handleAddPoints(100)}>
            <Text style={dynamicStyles.buttonText}>+100</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Activity Log */}
      <View style={dynamicStyles.section}>
        <Text style={dynamicStyles.sectionTitle}>Activity Log</Text>
        <View style={dynamicStyles.logContainer}>
          <ScrollView style={dynamicStyles.logScrollView} nestedScrollEnabled={true}>
            {log.length > 0 ? (
              log.map((entry, i) => (
                <Text key={i} style={dynamicStyles.logText}>{entry}</Text>
              ))
            ) : (
              <Text style={dynamicStyles.logText}>No activity yet...</Text>
            )}
          </ScrollView>
        </View>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}