import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, TextInput, Modal, StyleSheet, Alert, BackHandler, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomWeekPicker from '../tools/CustomWeekPicker';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';
import sanitizeHtml from 'sanitize-html';
import { useHabits } from '../data/HabitsContext';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function HabitsTab() {
  const { tasks, setTasks, addTask } = useHabits();
  const { rewards, punishments, updatePunishmentCount, updateRewardCount, addPoints, subtractPoints } = useRewardsPunishments();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [rewardPoints, setRewardPoints] = useState(0);
  const [punishmentPoints, setPunishmentPoints] = useState(0);
  const [selectedRewards, setSelectedRewards] = useState([]);
  const [selectedPunishments, setSelectedPunishments] = useState([]);
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date(new Date().setHours(23, 45, 0, 0))); // Default to 11:45 PM
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [recurrence, setRecurrence] = useState('none'); // Options: 'none', 'daily', 'weekly', 'monthly'
  const [selectedDays, setSelectedDays] = useState([]);
  const [progress, setProgress] = useState(0);
  const [slipups, setSlipups] = useState(0);
  const [rewardCondition, setRewardCondition] = useState('progress'); // Options: 'progress', 'completion'
  const [punishmentCondition, setPunishmentCondition] = useState('slipup'); // Options: 'slipup', 'threshold'
  const [mode, setMode] = useState('task'); // Options: 'task', 'badHabit'
  const [hasChanges, setHasChanges] = useState(false);
  const [requiredCompletion, setRequiredCompletion] = useState(1);
  const [maxSlipups, setMaxSlipups] = useState(3);
  const [progressPoints, setProgressPoints] = useState(0);
  const [completionPoints, setCompletionPoints] = useState(0);
  const [slipupPoints, setSlipupPoints] = useState(0);
  const [theme] = useAtom(themeAtom);
  const [successPoints, setSuccessPoints] = useState(0);
  const [failurePoints, setFailurePoints] = useState(0);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors?.background || theme.container?.backgroundColor || '#F3E8FF',
      padding: 16,
    },
    addButton: {
      backgroundColor: theme.colors?.primary || theme.button?.backgroundColor || '#9B59B6',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 16,
    },
    addButtonText: {
      color: theme.colors?.textOnPrimary || theme.buttonText?.color || '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    taskCard: {
      backgroundColor: theme.colors?.surface || theme.entryContainer?.backgroundColor || '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
      marginHorizontal: 4,
      borderWidth: 1,
      borderColor: theme.colors?.border || theme.borderColor || '#DDDDDD',
    },
    taskModeIndicator: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors?.info || '#2196F3',
    },
    badHabitModeIndicator: {
      borderLeftWidth: 4,
      borderLeftColor: theme.colors?.danger || '#DC3545',
    },
    taskTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors?.text || theme.title?.color || '#1A1A1A',
      marginBottom: 4,
    },
    taskText: {
      fontSize: 14,
      color: theme.colors?.textSecondary || theme.textColor || '#666666',
      marginBottom: 2,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginVertical: 8,
    },
    progressButton: {
      backgroundColor: theme.colors?.success || theme.incrementButtonBackground || '#28A745',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      flex: 1,
      marginRight: 8,
      alignItems: 'center',
    },
    progressButtonText: {
      color: theme.colors?.successText || theme.incrementButtonTextColor || '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    completedButton: {
      backgroundColor: theme.colors?.textMuted || '#888888',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      flex: 1,
      marginRight: 8,
      alignItems: 'center',
    },
    completedButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    slipupButton: {
      backgroundColor: theme.colors?.warning || '#FF6347',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      flex: 1,
      marginRight: 8,
      alignItems: 'center',
    },
    slipupButtonText: {
      color: theme.colors?.warningText || '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    failedButton: {
      backgroundColor: theme.colors?.danger || '#DC3545',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      flex: 1,
      marginRight: 8,
      alignItems: 'center',
      opacity: 0.6,
    },
    failedButtonText: {
      color: theme.colors?.dangerText || '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    deleteButton: {
      backgroundColor: theme.colors?.danger || theme.deleteButtonBackground || '#DC3545',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
    },
    deleteButtonText: {
      color: theme.colors?.dangerText || theme.deleteButtonTextColor || '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      width: '90%',
      maxWidth: 500,
      backgroundColor: theme.colors?.surface || theme.formBackground || '#FFFFFF',
      borderRadius: 16,
      padding: 20,
      paddingBottom: 90,
      maxHeight: '97%',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.colors?.text || theme.title?.color || '#1A1A1A',
      marginBottom: 16,
    },
    input: {
      backgroundColor: theme.colors?.inputBackground || theme.inputBackground || '#FFFFFF',
      borderWidth: 1,
      borderColor: theme.colors?.border || theme.inputBorderColor || '#DDDDDD',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.colors?.inputText || theme.textColor || '#1A1A1A',
      marginVertical: 8,
    },
    infoBox: {
      backgroundColor: theme.colors?.surfaceVariant || (theme.isDark ? '#2A2A2A' : '#F5F5F5'),
      padding: 12,
      borderRadius: 8,
      marginTop: 10,
    },
    infoTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 5,
      color: theme.colors?.text || theme.title?.color || '#1A1A1A',
    },
    infoText: {
      fontSize: 14,
      color: theme.colors?.textSecondary || theme.textColor || '#666666',
    },
    label: {
      fontSize: 16,
      marginBottom: 5,
      color: theme.colors?.text || theme.title?.color || '#1A1A1A',
    },
    picker: {
      backgroundColor: theme.colors?.inputBackground || '#FFFFFF',
      color: theme.colors?.text || '#1A1A1A',
    },
    pickerItem: {
      color: theme.colors?.text || '#1A1A1A',
    },
    halfWidth: {
      width: '48%',
    },
    fullWidth: {
      width: '100%',
      marginTop: 10,
    },
    scrollContainer: {
      maxHeight: 50,
      marginVertical: 10,
    },
    quantityBox: {
      width: 50,
      height: 30,
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
      borderRadius: 5,
      textAlign: 'center',
      backgroundColor: theme.colors?.inputBackground || '#FFFFFF',
      color: theme.colors?.text || '#1A1A1A',
    },
    rewardText: {
      flex: 1,
      marginRight: 10,
      color: theme.colors?.text || '#1A1A1A',
    },
    punishmentText: {
      flex: 1,
      marginRight: 10,
      color: theme.colors?.text || '#1A1A1A',
    },
    numberInput: {
      width: '30%',
      marginLeft: 10,
      padding: 8,
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
      borderRadius: 8,
      backgroundColor: theme.colors?.inputBackground || '#FFFFFF',
      color: theme.colors?.text || '#1A1A1A',
    },
    formGroup: {
      marginBottom: 15,
    },
    actionButton: {
      backgroundColor: theme.colors?.primary || '#9B59B6',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 4,
    },
    actionButtonText: {
      color: theme.colors?.textOnPrimary || '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    secondaryButton: {
      backgroundColor: theme.colors?.textMuted || '#888888',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 4,
    },
    secondaryButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButton: {
      backgroundColor: theme.colors?.danger || '#DC3545',
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 4,
    },
    cancelButtonText: {
      color: theme.colors?.dangerText || '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  }), [theme]);

  const handleCreateTask = () => {
    if (!taskName) return;

    const sanitizedTaskName = sanitizeHtml(taskName);
    const sanitizedTaskDescription = sanitizeHtml(taskDescription);

    const newTask = {
      name: sanitizedTaskName,
      description: sanitizedTaskDescription,
      rewards: selectedRewards,
      punishments: selectedPunishments,
      successPoints,
      failurePoints,
      dueDate,
      dueTime, // Ensure dueTime is correctly used
      recurrence,
      selectedDays,
      progress: 0,
      slipups: 0,
      rewardCondition,
      punishmentCondition,
      mode,
      isCompleted: false,
      requiredCompletion: parseInt(requiredCompletion) || 1,
      maxSlipups: parseInt(maxSlipups) || 3
    };

    setTasks([...tasks, newTask]);
    resetModalFields();
    setIsModalVisible(false);
  };

  const resetModalFields = () => {
    setTaskName('');
    setTaskDescription('');
    setRewardPoints(0);
    setPunishmentPoints(0);
    setSelectedRewards([]);
    setSelectedPunishments([]);
    setDueDate(new Date());
    setDueTime(new Date(new Date().setHours(23, 45, 0, 0))); // Reset to 11:45 PM
    setRecurrence('none');
    setSelectedDays([]);
    setProgress(0);
    setSlipups(0);
    setRewardCondition('progress');
    setPunishmentCondition('slipup');
    setMode('task');
    setCurrentStep(1);
    setHasChanges(false);
    setRequiredCompletion(1);
    setMaxSlipups(3);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || dueTime;
    setShowTimePicker(false);
    // Ensure the selected time is correctly set with respect to the current date
    const updatedTime = new Date(dueDate);
    updatedTime.setHours(currentTime.getHours());
    updatedTime.setMinutes(currentTime.getMinutes());
    updatedTime.setSeconds(0);
    updatedTime.setMilliseconds(0);
    setDueTime(updatedTime);
  };

  const handleRecurrenceChange = (type) => setRecurrence(type);

  const handleCompleteTask = (task) => {
    // Create a lookup map for rewards
    const rewardsMap = rewards.reduce((map, r) => {
      map[r.name] = r;
      return map;
    }, {});

    const updatedTasks = tasks.map((t) => {
      if (t.name === task.name) {
        const newProgress = t.progress + 1;
        const isNowCompleted = newProgress >= t.requiredCompletion;

        // Give rewards based on condition
        if (t.rewardCondition === 'progress') {
          // Give points for each progress increment
          if (t.successPoints && t.successPoints > 0) {
            addPoints(t.successPoints);
          }
          // Give rewards for each progress
          if (t.rewards && t.rewards.length > 0) {
            t.rewards.forEach((reward) => {
              const currentReward = rewardsMap[reward.name];
              updateRewardCount(reward.name, (currentReward?.quantity || 0) + reward.quantity);
            });
          }
        } else if (t.rewardCondition === 'completion' && isNowCompleted) {
          // Give points only on completion
          if (t.successPoints && t.successPoints > 0) {
            addPoints(t.successPoints);
          }
          // Give rewards only on completion
          if (t.rewards && t.rewards.length > 0) {
            t.rewards.forEach((reward) => {
              const currentReward = rewardsMap[reward.name];
              updateRewardCount(reward.name, (currentReward?.quantity || 0) + reward.quantity);
            });
          }
        }

        return { ...t, progress: newProgress, isCompleted: isNowCompleted };
      }
      return t;
    });

    setTasks(updatedTasks);
  };

  const handleFailTask = (task) => {
    // Create a lookup map for punishments
    const punishmentsMap = punishments.reduce((map, p) => {
      map[p.name] = p;
      return map;
    }, {});

    const updatedTasks = tasks.map((t) => {
      if (t.name === task.name) {
        // Subtract points for failure
        if (t.failurePoints && t.failurePoints > 0) {
          subtractPoints(t.failurePoints);
        }
        // Apply punishments
        if (t.punishments && t.punishments.length > 0) {
          t.punishments.forEach((punishment) => {
            const currentPunishment = punishmentsMap[punishment.name];
            if (currentPunishment) {
              updatePunishmentCount(punishment.name, currentPunishment.count + punishment.quantity);
            }
          });
        }
        return { ...t, hasFailed: true };
      }
      return t;
    });

    setTasks(updatedTasks);
  };

  const handleSlipup = (task) => {
    // Create a lookup map for punishments
    const punishmentsMap = punishments.reduce((map, p) => {
      map[p.name] = p;
      return map;
    }, {});

    const updatedTasks = tasks.map((t) => {
      if (t.name === task.name) {
        const newSlipups = t.slipups + 1;
        const hasFailed = newSlipups >= t.maxSlipups;

        if (t.punishmentCondition === 'slipup') {
          // Apply punishments for each slipup
          if (t.punishments && t.punishments.length > 0) {
            t.punishments.forEach((punishment) => {
              const currentPunishment = punishmentsMap[punishment.name];
              if (currentPunishment) {
                updatePunishmentCount(punishment.name, currentPunishment.count + punishment.quantity);
              }
            });
          }
          // Subtract slipup points
          if (t.failurePoints && t.failurePoints > 0) {
            subtractPoints(t.failurePoints);
          }
        } else if (t.punishmentCondition === 'threshold' && hasFailed) {
          // Apply punishments only when threshold is reached
          if (t.punishments && t.punishments.length > 0) {
            t.punishments.forEach((punishment) => {
              const currentPunishment = punishmentsMap[punishment.name];
              if (currentPunishment) {
                updatePunishmentCount(punishment.name, currentPunishment.count + punishment.quantity);
              }
            });
          }
          // Subtract failure points
          if (t.failurePoints && t.failurePoints > 0) {
            subtractPoints(t.failurePoints);
          }
        }
        return { ...t, slipups: newSlipups, hasFailed };
      }
      return t;
    });

    setTasks(updatedTasks);
  };

  const handleRewardSelect = (reward) => {
    if (reward === '') return;
    const existingReward = selectedRewards.find((r) => r.name === reward);
    if (existingReward) {
      setSelectedRewards(
        selectedRewards.map((r) =>
          r.name === reward ? { ...r, quantity: r.quantity + 1 } : r
        )
      );
    } else {
      setSelectedRewards([...selectedRewards, { name: reward, quantity: 1 }]);
    }
  };

  const handlePunishmentSelect = (punishment) => {
    if (punishment === '') return;
    const existingPunishment = selectedPunishments.find((p) => p.name === punishment);
    if (existingPunishment) {
      setSelectedPunishments(
        selectedPunishments.map((p) =>
          p.name === punishment ? { ...p, quantity: p.quantity + 1 } : p
        )
      );
    } else {
      setSelectedPunishments([...selectedPunishments, { name: punishment, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (type, name, quantity) => {
    if (isNaN(quantity) || quantity < 1) return;
    if (type === 'reward') {
      setSelectedRewards(
        selectedRewards.map((r) =>
          r.name === name ? { ...r, quantity } : r
        )
      );
    } else if (type === 'punishment') {
      setSelectedPunishments(
        selectedPunishments.map((p) =>
          p.name === name ? { ...p, quantity } : p
        )
      );
    }
  };

  const handleDeleteTask = (task) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this task? You will need to remake it if deleted.")) {
        const updatedTasks = tasks.filter((t) => t.name !== task.name);
        setTasks(updatedTasks);
      }
    } else {
      Alert.alert(
        "Delete Task",
        "Are you sure you want to delete this task? You will need to remake it if deleted.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: () => {
              const updatedTasks = tasks.filter((t) => t.name !== task.name);
              setTasks(updatedTasks);
            },
            style: "destructive"
          }
        ]
      );
    }
  };

  useEffect(() => {
    const backAction = () => {
      if (isModalVisible) {
        if (hasChanges) {
          if (Platform.OS === 'web') {
            if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
              resetModalFields();
            }
          } else {
            Alert.alert(
              "Discard changes?",
              "You have unsaved changes. Are you sure you want to discard them?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "Discard", onPress: resetModalFields, style: "destructive" }
              ]
            );
          }
        } else {
          setIsModalVisible(false);
        }
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [isModalVisible, hasChanges]);

  const renderItem = ({ item }) => (
    <View style={[
      dynamicStyles.taskCard,
      item.mode === 'task' ? dynamicStyles.taskModeIndicator : dynamicStyles.badHabitModeIndicator
    ]}>
      <Text style={dynamicStyles.taskTitle}>{item.name}</Text>
      <Text style={dynamicStyles.taskText}>{item.description}</Text>
      <Text style={dynamicStyles.taskText}>Due: {item.dueDate.toLocaleDateString()} {item.dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      <Text style={dynamicStyles.taskText}>Recurrence: {item.recurrence}</Text>
      {item.selectedDays.length > 0 && (
        <Text style={dynamicStyles.taskText}>Days: {item.selectedDays.join(', ')}</Text>
      )}
      {item.rewards.length > 0 && (
        <Text style={dynamicStyles.taskText}>Rewards: {item.rewards.map(r => `${r.name} (x${r.quantity})`).join(', ')}</Text>
      )}
      {item.punishments.length > 0 && (
        <Text style={dynamicStyles.taskText}>Punishments: {item.punishments.map(p => `${p.name} (x${p.quantity})`).join(', ')}</Text>
      )}
      {item.mode === 'task' && (
        <Text style={dynamicStyles.taskText}>Progress: {item.progress}/{item.requiredCompletion}</Text>
      )}
      {item.mode === 'badHabit' && (
        <Text style={dynamicStyles.taskText}>Slipups: {item.slipups}/{item.maxSlipups}</Text>
      )}
      <View style={dynamicStyles.row}>
        {item.mode === 'task' && !item.isCompleted && (
          <TouchableOpacity 
            style={dynamicStyles.progressButton}
            onPress={() => handleCompleteTask(item)}
          >
            <Text style={dynamicStyles.progressButtonText}>+1 Progress ({item.progress}/{item.requiredCompletion})</Text>
          </TouchableOpacity>
        )}
        {item.mode === 'task' && item.isCompleted && (
          <TouchableOpacity style={dynamicStyles.completedButton} disabled={true}>
            <Text style={dynamicStyles.completedButtonText}>✓ Completed</Text>
          </TouchableOpacity>
        )}
        {item.mode === 'badHabit' && !item.hasFailed && (
          <TouchableOpacity 
            style={dynamicStyles.slipupButton}
            onPress={() => handleSlipup(item)}
          >
            <Text style={dynamicStyles.slipupButtonText}>Slipup ({item.slipups}/{item.maxSlipups})</Text>
          </TouchableOpacity>
        )}
        {item.mode === 'badHabit' && item.hasFailed && (
          <TouchableOpacity style={dynamicStyles.failedButton} disabled={true}>
            <Text style={dynamicStyles.failedButtonText}>Failed</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity 
          style={dynamicStyles.deleteButton}
          onPress={() => handleDeleteTask(item)}
        >
          <Text style={dynamicStyles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={dynamicStyles.container}>
      <TouchableOpacity
        style={dynamicStyles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={dynamicStyles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }}>
        {tasks.map((item, index) => (
          <View key={index}>
            {renderItem({ item })}
          </View>
        ))}
      </ScrollView>
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={() => {
          if (hasChanges) {
            if (Platform.OS === 'web') {
              if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
                resetModalFields();
              }
            } else {
              Alert.alert(
                "Discard changes?",
                "You have unsaved changes. Are you sure you want to discard them?",
                [
                  { text: "Cancel", style: "cancel" },
                  { text: "Discard", onPress: resetModalFields, style: "destructive" }
                ]
              );
            }
          } else {
            setIsModalVisible(false);
          }
        }}>
          <View style={dynamicStyles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"} 
              style={[dynamicStyles.modalContainer, { flex: 1, alignSelf: 'center', marginTop: 0 }]}>
              <TouchableWithoutFeedback>
                <View>
                  {currentStep === 1 && (
                    <>
                      <Text style={dynamicStyles.modalTitle}>Create Task</Text>
                      <TextInput
                        style={dynamicStyles.input}
                        placeholder="Task Name"
                        placeholderTextColor={theme.colors?.textMuted || theme.placeholderTextColor || '#888'}
                        value={taskName}
                        onChangeText={(text) => {
                          setTaskName(text);
                          setHasChanges(true);
                        }}
                      />
                      <TextInput
                        style={dynamicStyles.input}
                        placeholder="Task Description"
                        placeholderTextColor={theme.colors?.textMuted || theme.placeholderTextColor || '#888'}
                        value={taskDescription}
                        onChangeText={(text) => {
                          setTaskDescription(text);
                          setHasChanges(true);
                        }}
                      />
                      <Text style={dynamicStyles.label}>Mode:</Text>
                      <View style={[dynamicStyles.input, { padding: 0 }]}>
                        <Picker
                          selectedValue={mode}
                          style={dynamicStyles.picker}
                          onValueChange={(itemValue) => {
                            setMode(itemValue);
                            setHasChanges(true);
                          }}
                        >
                          <Picker.Item label="Task" value="task" color={theme.colors?.text || '#1A1A1A'} />
                          <Picker.Item label="Bad Habit" value="badHabit" color={theme.colors?.text || '#1A1A1A'} />
                        </Picker>
                      </View>
                      <View style={dynamicStyles.infoBox}>
                        <Text style={dynamicStyles.infoTitle}>Mode:</Text>
                        <Text style={dynamicStyles.infoText}>{mode === 'task' ? 'Task: A positive habit or goal you want to achieve.' : 'Bad Habit: A negative habit you want to reduce or eliminate.'}</Text>
                      </View>
                      <TouchableOpacity 
                        style={[dynamicStyles.actionButton, !taskName && { opacity: 0.5 }]} 
                        onPress={() => setCurrentStep(2)} 
                        disabled={!taskName}
                      >
                        <Text style={dynamicStyles.actionButtonText}>Next</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={dynamicStyles.cancelButton} onPress={() => {
                        if (hasChanges) {
                          if (Platform.OS === 'web') {
                            if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
                              resetModalFields();
                            }
                          } else {
                            Alert.alert(
                              "Discard changes?",
                              "You have unsaved changes. Are you sure you want to discard them?",
                              [
                                { text: "Cancel", style: "cancel" },
                                { text: "Discard", onPress: resetModalFields, style: "destructive" }
                              ]
                            );
                          }
                        } else {
                          setIsModalVisible(false);
                        }
                      }}>
                        <Text style={dynamicStyles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <Text style={dynamicStyles.modalTitle}>{mode === 'task' ? 'Reward and Punishment Conditions' : 'Reward and Punishment Conditions'}</Text>
                      <View style={dynamicStyles.row}>
                        <View style={dynamicStyles.halfWidth}>
                          <Text style={dynamicStyles.label}>Points on reward:</Text>
                          <TextInput
                            style={dynamicStyles.input}
                            placeholder="Points for Success"
                            placeholderTextColor={theme.colors?.textMuted || '#888'}
                            value={String(successPoints)}
                            onChangeText={(text) => {
                              setSuccessPoints(parseInt(text) || 0);
                              setHasChanges(true);
                            }}
                            keyboardType="numeric"
                          />
                        </View>
                        <View style={dynamicStyles.halfWidth}>
                          <Text style={dynamicStyles.label}>Points on punishment:</Text>
                          <TextInput
                            style={dynamicStyles.input}
                            placeholder="Points for Failure"
                            placeholderTextColor={theme.colors?.textMuted || '#888'}
                            value={String(failurePoints)}
                            onChangeText={(text) => {
                              setFailurePoints(parseInt(text) || 0);
                              setHasChanges(true);
                            }}
                            keyboardType="numeric"
                          />
                        </View>
                      </View>
                      {mode === 'task' && (
                        <>
                          <Text style={dynamicStyles.label}>Reward Condition:</Text>
                          <View style={[dynamicStyles.input, { padding: 0 }]}>
                            <Picker
                              selectedValue={rewardCondition}
                              style={dynamicStyles.picker}
                              onValueChange={(itemValue) => {
                                setRewardCondition(itemValue);
                                setHasChanges(true);
                              }}
                            >
                              <Picker.Item label="Progress" value="progress" color={theme.colors?.text || '#1A1A1A'} />
                              <Picker.Item label="Completion" value="completion" color={theme.colors?.text || '#1A1A1A'} />
                            </Picker>
                          </View>
                        </>
                      )}
                      {mode === 'badHabit' && (
                        <>
                          <Text style={dynamicStyles.label}>Punishment Condition:</Text>
                          <View style={[dynamicStyles.input, { padding: 0 }]}>
                            <Picker
                              selectedValue={punishmentCondition}
                              style={dynamicStyles.picker}
                              onValueChange={(itemValue) => {
                                setPunishmentCondition(itemValue);
                                setHasChanges(true);
                              }}
                            >
                              <Picker.Item label="Slipup" value="slipup" color={theme.colors?.text || '#1A1A1A'} />
                              <Picker.Item label="Threshold" value="threshold" color={theme.colors?.text || '#1A1A1A'} />
                            </Picker>
                          </View>
                        </>
                      )}
                      <View style={dynamicStyles.infoBox}>
                        <Text style={dynamicStyles.infoTitle}>Condition Description:</Text>
                        <Text style={dynamicStyles.infoText}>{mode === 'task' ? 
                          (rewardCondition === 'progress' ? 'Rewards are given based on progress.' : 'Rewards are given upon completion.') : 
                          (punishmentCondition === 'slipup' ? 'Punishments are given for each slipup.' : 'Punishments are given if the threshold is reached.')}</Text>
                      </View>
                      <Text style={dynamicStyles.label}>Rewards:</Text>
                      <View style={[dynamicStyles.input, { padding: 0 }]}>
                        <Picker
                          selectedValue=""
                          style={dynamicStyles.picker}
                          onValueChange={(itemValue) => {
                            handleRewardSelect(itemValue);
                            setHasChanges(true);
                          }}
                        >
                          <Picker.Item label="Select" value="" color={theme.colors?.text || '#1A1A1A'} />
                          {rewards.map((item, index) => (
                          <Picker.Item key={index} label={item.name} value={item.name} color={theme.colors?.text || '#1A1A1A'} />
                        ))}
                        </Picker>
                      </View>
                      <ScrollView style={dynamicStyles.scrollContainer} persistentScrollbar={true}>
                        {selectedRewards.map((item, index) => (
                          <View key={index} style={dynamicStyles.row}>
                            <Text style={dynamicStyles.rewardText}>{item.name}</Text>
                            <TextInput
                              style={dynamicStyles.quantityBox}
                              keyboardType="numeric"
                              value={String(item.quantity)}
                              onChangeText={(text) => {
                                handleQuantityChange('reward', item.name, parseInt(text));
                                setHasChanges(true);
                              }}
                              scrollEnabled={false}
                            />
                          </View>
                        ))}
                      </ScrollView>
                      <Text style={dynamicStyles.label}>Punishments:</Text>
                      <View style={[dynamicStyles.input, { padding: 0 }]}>
                        <Picker
                          selectedValue=""
                          style={dynamicStyles.picker}
                          onValueChange={(itemValue) => {
                            handlePunishmentSelect(itemValue);
                            setHasChanges(true);
                          }}
                        >
                          <Picker.Item label="Select" value="" color={theme.colors?.text || '#1A1A1A'} />
                          {punishments.map((item, index) => (
                            <Picker.Item key={index} label={item.name} value={item.name} color={theme.colors?.text || '#1A1A1A'} />
                          ))}
                        </Picker>
                      </View>
                      <ScrollView style={dynamicStyles.scrollContainer} persistentScrollbar={true}>
                        {selectedPunishments.map((item, index) => (
                          <View key={index} style={dynamicStyles.row}>
                            <Text style={dynamicStyles.punishmentText}>{item.name}</Text>
                            <TextInput
                              style={dynamicStyles.quantityBox}
                              keyboardType="numeric"
                              value={String(item.quantity)}
                              onChangeText={(text) => {
                                handleQuantityChange('punishment', item.name, parseInt(text));
                                setHasChanges(true);
                              }}
                              scrollEnabled={true}
                            />
                          </View>
                        ))}
                      </ScrollView>
                      <TouchableOpacity style={dynamicStyles.actionButton} onPress={() => setCurrentStep(3)}>
                        <Text style={dynamicStyles.actionButtonText}>Next</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={dynamicStyles.secondaryButton} onPress={() => setCurrentStep(1)}>
                        <Text style={dynamicStyles.secondaryButtonText}>Back</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={dynamicStyles.cancelButton} onPress={() => {
                        if (hasChanges) {
                          if (Platform.OS === 'web') {
                            if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
                              resetModalFields();
                            }
                          } else {
                            Alert.alert(
                              "Discard changes?",
                              "You have unsaved changes. Are you sure you want to discard them?",
                              [
                                { text: "Cancel", style: "cancel" },
                                { text: "Discard", onPress: resetModalFields, style: "destructive" }
                              ]
                            );
                          }
                        } else {
                          setIsModalVisible(false);
                        }
                      }}>
                        <Text style={dynamicStyles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                  {currentStep === 3 && (
                    <>
                      <Text style={dynamicStyles.modalTitle}>Set Recurrence and Due Time</Text>
                      <Text style={dynamicStyles.label}>Recurrence:</Text>
                      <View style={[dynamicStyles.input, { padding: 0 }]}>
                        <Picker
                          selectedValue={recurrence}
                          style={dynamicStyles.picker}
                        onValueChange={(itemValue) => {
                          setRecurrence(itemValue);
                          setHasChanges(true);
                        }}
                      >
                        <Picker.Item label="None" value="none" color={theme.colors?.text || '#1A1A1A'} />
                        <Picker.Item label="Daily" value="daily" color={theme.colors?.text || '#1A1A1A'} />
                        <Picker.Item label="Weekly" value="weekly" color={theme.colors?.text || '#1A1A1A'} />
                        <Picker.Item label="Monthly" value="monthly" color={theme.colors?.text || '#1A1A1A'} />
                        </Picker>
                      </View>
                      {recurrence === 'weekly' && (
                        <View style={dynamicStyles.row}>
                          <CustomWeekPicker
                            selectedDays={selectedDays}
                            onDaysChange={(days) => {
                              setSelectedDays(days);
                              setHasChanges(true);
                            }}
                            style={dynamicStyles.halfWidth}
                          />
                          <TouchableOpacity
                            style={[dynamicStyles.halfWidth, dynamicStyles.input]}
                            onPress={() => setShowTimePicker(true)}
                          >
                            <Text style={{ color: theme.colors?.text || '#1A1A1A' }}>
                              {dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      {recurrence !== 'weekly' && (
                        <TouchableOpacity
                          style={[dynamicStyles.fullWidth, dynamicStyles.input]}
                          onPress={() => setShowTimePicker(true)}
                        >
                          <Text style={{ color: theme.colors?.text || '#1A1A1A' }}>
                            {dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </Text>
                        </TouchableOpacity>
                      )}
                      {showTimePicker && (
                        <DateTimePicker
                          value={dueTime}
                          mode="time"
                          is24Hour={false}
                          display="default"
                          onChange={handleTimeChange}
                        />
                      )}
                      <TouchableOpacity style={dynamicStyles.actionButton} onPress={handleCreateTask}>
                        <Text style={dynamicStyles.actionButtonText}>Create Task</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={dynamicStyles.secondaryButton} onPress={() => setCurrentStep(2)}>
                        <Text style={dynamicStyles.secondaryButtonText}>Back</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={dynamicStyles.cancelButton} onPress={() => {
                        if (hasChanges) {
                          if (Platform.OS === 'web') {
                            if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
                              resetModalFields();
                            }
                          } else {
                            Alert.alert(
                              "Discard changes?",
                              "You have unsaved changes. Are you sure you want to discard them?",
                              [
                                { text: "Cancel", style: "cancel" },
                                { text: "Discard", onPress: resetModalFields, style: "destructive" }
                              ]
                            );
                          }
                        } else {
                          setIsModalVisible(false);
                        }
                      }}>
                        <Text style={dynamicStyles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

// Minimal static styles - most styling is now in dynamicStyles based on theme
const styles = StyleSheet.create({
  // Empty - all styles are now dynamic
});