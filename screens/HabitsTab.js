import React, { useState, useEffect } from 'react';
import { View, Text, Button, TouchableOpacity, TextInput, Modal, StyleSheet, Alert, BackHandler, TouchableWithoutFeedback, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomWeekPicker from '../tools/CustomWeekPicker';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';
import sanitizeHtml from 'sanitize-html';
import { useHabits } from '../data/HabitsContext';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

const updatePoints = (points) => {
  // Logic to update points
  console.log(`Updating points by ${points}`);
  // Add your logic to update the points here
};

export default function HabitsTab() {
  const { tasks, setTasks, addTask } = useHabits();
  const { rewards, punishments, updatePunishmentCount, updateRewardCount } = useRewardsPunishments();
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
  const [failurePoints, setFailurePoints] = useState(0);
  const [theme] = useAtom(themeAtom);

  const handleCreateTask = () => {
    if (!taskName) return;

    const sanitizedTaskName = sanitizeHtml(taskName);
    const sanitizedTaskDescription = sanitizeHtml(taskDescription);

    const newTask = {
      name: sanitizedTaskName,
      description: sanitizedTaskDescription,
      rewards: selectedRewards,
      punishments: selectedPunishments,
      rewardPoints,
      punishmentPoints,
      dueDate,
      dueTime,
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
    setDueTime(currentTime);
  };

  const handleRecurrenceChange = (type) => setRecurrence(type);

  const handleCompleteTask = (task) => {
    // Logic to complete the task
    task.isCompleted = true;
    updatePoints(task.rewardPoints);
    // Update the task state
    setTasks([...tasks]);
  };

  const handleFailTask = (task) => {
    // Logic to fail the task
    task.isCompleted = false;
    updatePoints(task.punishmentPoints);
    // Update the task state
    setTasks([...tasks]);
  };

  const handleSlipup = (task) => {
    const updatedTasks = tasks.map((t) => {
      if (t.name === task.name) {
        const newSlipups = t.slipups + 1;
        const hasFailed = newSlipups >= t.maxSlipups;

        if (t.punishmentCondition === 'slipup') {
          t.punishments.forEach((punishment) => {
            updatePunishmentCount(punishment.name, punishment.quantity); // Use quantity instead of count
          });
          // Add slipup points
          updatePoints(t.slipupPoints);
        } else if (t.punishmentCondition === 'threshold' && hasFailed) {
          t.punishments.forEach((punishment) => {
            updatePunishmentCount(punishment.name, punishment.quantity);
          });
          // Add failure points
          updatePoints(t.failurePoints);
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
    <View style={[theme.taskContainer, item.mode === 'task' ? styles.taskMode : styles.badHabitMode]}>
      <Text style={theme.item}>{item.name}</Text>
      <Text>{item.description}</Text>
      <Text>Due: {item.dueDate.toLocaleString()}</Text>
      <Text>Recurrence: {item.recurrence}</Text>
      <Text>Days: {item.selectedDays.join(', ')}</Text>
      <Text>Rewards: {item.rewards.map(r => `${r.name} (x${r.quantity})`).join(', ')}</Text>
      <Text>Punishments: {item.punishments.map(p => `${p.name} (x${p.quantity})`).join(', ')}</Text>
      {item.mode === 'task' && (
        <Text>Progress: {item.progress}/{item.requiredCompletion}</Text>
      )}
      {item.mode === 'badHabit' && (
        <Text>Slipups: {item.slipups}/{item.maxSlipups}</Text>
      )}
      <View style={styles.row}>
        {item.mode === 'task' && (
          <Button
            title={item.isCompleted ? "Completed" : "Complete Task"}
            onPress={() => handleCompleteTask(item)}
            disabled={item.isCompleted}
          />
        )}
        {item.mode === 'badHabit' && (
          <Button
            title="Slipup"
            onPress={() => handleSlipup(item)}
          />
        )}
        <Button
            title="Delete"
            onPress={() => handleDeleteTask(item)}
            color="red"
        />
      </View>
    </View>
  );

  return (
    <View style={theme.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      <ScrollView>
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
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView 
              behavior={Platform.OS === "ios" ? "padding" : "height"} 
              style={[styles.modalContainer, { flex: 1, alignSelf: 'center', marginTop: 0 }]}>
              <TouchableWithoutFeedback>
                <View>
                  {currentStep === 1 && (
                    <>
                      <Text style={theme.title}>Create Task</Text>
                      <TextInput
                        style={theme.input}
                        placeholder="Task Name"
                        value={taskName}
                        onChangeText={(text) => {
                          setTaskName(text);
                          setHasChanges(true);
                        }}
                      />
                      <TextInput
                        style={theme.input}
                        placeholder="Task Description"
                        value={taskDescription}
                        onChangeText={(text) => {
                          setTaskDescription(text);
                          setHasChanges(true);
                        }}
                      />
                      <Text>Mode:</Text>
                      <Picker
                        selectedValue={mode}
                        onValueChange={(itemValue) => {
                          setMode(itemValue);
                          setHasChanges(true);
                        }}
                      >
                        <Picker.Item label="Task" value="task" />
                        <Picker.Item label="Bad Habit" value="badHabit" />
                      </Picker>
                      {mode === 'task' && (
                        <>
                          <Text>Reward Condition:</Text>
                          <View style={styles.row}>
                            <Picker
                              style={styles.picker}
                              selectedValue={rewardCondition}
                              onValueChange={(itemValue) => {
                                setRewardCondition(itemValue);
                                setHasChanges(true);
                              }}
                            >
                              <Picker.Item label="Progress" value="progress" />
                              <Picker.Item label="Completion" value="completion" />
                            </Picker>
                            <TextInput
                              style={[styles.input, styles.numberInput]}
                              placeholder="Required Completion"
                              value={String(requiredCompletion)}
                              onChangeText={(text) => {
                                setRequiredCompletion(parseInt(text) || 1);
                                setHasChanges(true);
                              }}
                              keyboardType="numeric"
                            />
                          </View>
                        </>
                      )}
                      {mode === 'badHabit' && (
                        <>
                          <Text>Punishment Condition:</Text>
                          <View style={styles.row}>
                            <Picker
                              style={styles.picker}
                              selectedValue={punishmentCondition}
                              onValueChange={(itemValue) => {
                                setPunishmentCondition(itemValue);
                                setHasChanges(true);
                              }}
                            >
                              <Picker.Item label="Slipup" value="slipup" />
                              <Picker.Item label="Threshold" value="threshold" />
                            </Picker>
                            <TextInput
                              style={[styles.input, styles.numberInput]}
                              placeholder="Max Slipups"
                              value={String(maxSlipups)}
                              onChangeText={(text) => {
                                setMaxSlipups(parseInt(text) || 3);
                                setHasChanges(true);
                              }}
                              keyboardType="numeric"
                            />
                          </View>
                        </>
                      )}
                      {mode === 'task' && rewardCondition === 'progress' ? (
                        <Text>Rewards upon progress:</Text>
                      ) : (
                        <Text>Rewards upon completion:</Text>
                      )}
                      <Picker
                        selectedValue=""
                        onValueChange={(itemValue) => {
                          handleRewardSelect(itemValue);
                          setHasChanges(true);
                        }}
                      >
                        <Picker.Item label="Select" value="" />
                        {rewards.map((reward, index) => (
                          <Picker.Item key={index} label={reward.name} value={reward.name} />
                        ))}
                      </Picker>
                      <View>
                        {selectedRewards.map((reward, index) => (
                          <View key={index} style={theme.selectedItemContainer}>
                            <Text>{reward.name}</Text>
                            <TextInput
                              style={theme.quantityInput}
                              keyboardType="numeric"
                              value={String(reward.quantity)}
                              onChangeText={(text) => {
                                handleQuantityChange('reward', reward.name, parseInt(text));
                                setHasChanges(true);
                              }}
                            />
                          </View>
                        ))}
                      </View>
                      <Text>Punishments on failure:</Text>
                      <Picker
                        selectedValue=""
                        onValueChange={(itemValue) => {
                          handlePunishmentSelect(itemValue);
                          setHasChanges(true);
                        }}
                      >
                        <Picker.Item label="Select" value="" />
                        {punishments.map((punishment, index) => (
                          <Picker.Item key={index} label={punishment.name} value={punishment.name} />
                        ))}
                      </Picker>
                      <View>
                        {selectedPunishments.map((punishment, index) => (
                          <View key={index} style={theme.selectedItemContainer}>
                            <Text>{punishment.name}</Text>
                            <TextInput
                              style={theme.quantityInput}
                              keyboardType="numeric"
                              value={String(punishment.quantity)}
                              onChangeText={(text) => {
                                handleQuantityChange('punishment', punishment.name, parseInt(text));
                                setHasChanges(true);
                              }}
                            />
                          </View>
                        ))}
                      </View>
                      <Button title="Next" onPress={() => setCurrentStep(2)} disabled={!taskName} />
                      <Button title="Cancel" onPress={() => {
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
                      }} />
                      <View style={styles.infoBox}>
                        <Text style={styles.infoTitle}>Mode:</Text>
                        <Text>{mode === 'task' ? 'Task: A positive habit or goal you want to achieve.' : 'Bad Habit: A negative habit you want to reduce or eliminate.'}</Text>
                        {mode === 'task' && (
                          <>
                            <Text style={styles.infoTitle}>Reward Condition:</Text>
                            <Text>{rewardCondition === 'progress' ? 'Progress: Rewards are given based on progress.' : 'Completion: Rewards are given upon completion.'}</Text>
                            <Text style={styles.infoTitle}>Punishment Condition:</Text>
                            <Text>Not Completing: Punishments are given for not completing the task.</Text>
                          </>
                        )}
                        {mode === 'badHabit' && (
                          <>
                            <Text style={styles.infoTitle}>Reward Condition:</Text>
                            <Text>Rewards are given upon not reaching threshold.</Text>
                            <Text style={styles.infoTitle}>Punishment Condition:</Text>
                            <Text>{punishmentCondition === 'slipup' ? 'Slipup: Punishments are given for each slipup.' : 'Threshold: Punishments are given when a threshold is reached.'}</Text>
                          </>
                        )}
                      </View>
                      {mode === 'task' && (
                        <>
                          <View style={styles.formGroup}>
                            <Text style={styles.label}>Required Goal Amount:</Text>
                            <TextInput
                              style={[styles.input, styles.numberInput]}
                              placeholder="Goal amount"
                              value={String(requiredCompletion)}
                              onChangeText={(text) => {
                                setRequiredCompletion(parseInt(text) || 1);
                                setHasChanges(true);
                              }}
                              keyboardType="numeric"
                            />
                          </View>
                          <View style={styles.formGroup}>
                            <Text style={styles.label}>Points per Progress:</Text>
                            <TextInput
                              style={[styles.input, styles.numberInput]}
                              placeholder="0"
                              value={String(progressPoints)}
                              onChangeText={(text) => {
                                setProgressPoints(parseInt(text) || 0);
                                setHasChanges(true);
                              }}
                              keyboardType="numeric"
                            />
                          </View>
                          <View style={styles.formGroup}>
                            <Text style={styles.label}>Points on Completion:</Text>
                            <TextInput
                              style={[styles.input, styles.numberInput]}
                              placeholder="0"
                              value={String(completionPoints)}
                              onChangeText={(text) => {
                                setCompletionPoints(parseInt(text) || 0);
                                setHasChanges(true);
                              }}
                              keyboardType="numeric"
                            />
                          </View>
                        </>
                      )}

                      {mode === 'badHabit' && (
                        <>
                          <View style={styles.formGroup}>
                            <Text style={styles.label}>Failure Threshold Amount:</Text>
                            <TextInput
                              style={[styles.input, styles.numberInput]}
                              placeholder="Max slipups before failure"
                              value={String(maxSlipups)}
                              onChangeText={(text) => {
                                setMaxSlipups(parseInt(text) || 3);
                                setHasChanges(true);
                              }}
                              keyboardType="numeric"
                            />
                          </View>
                          <View style={styles.formGroup}>
                            <Text style={styles.label}>Points per Slipup:</Text>
                            <TextInput
                              style={[styles.input, styles.numberInput]}
                              placeholder="0"
                              value={String(slipupPoints)}
                              onChangeText={(text) => {
                                setSlipupPoints(parseInt(text) || 0);
                                setHasChanges(true);
                              }}
                              keyboardType="numeric"
                            />
                          </View>
                          <View style={styles.formGroup}>
                            <Text style={styles.label}>Points on Failure:</Text>
                            <TextInput
                              style={[styles.input, styles.numberInput]}
                              placeholder="0"
                              value={String(failurePoints)}
                              onChangeText={(text) => {
                                setFailurePoints(parseInt(text) || 0);
                                setHasChanges(true);
                              }}
                              keyboardType="numeric"
                            />
                          </View>
                        </>
                      )}
                    </>
                  )}
                  {currentStep === 2 && (
                    <>
                      <Text style={theme.title}>Set Recurrence and Due Time</Text>
                      <Text>Recurrence:</Text>
                      <Picker
                        selectedValue={recurrence}
                        onValueChange={(itemValue) => {
                          setRecurrence(itemValue);
                          setHasChanges(true);
                        }}
                      >
                        <Picker.Item label="None" value="none" />
                        <Picker.Item label="Daily" value="daily" />
                        <Picker.Item label="Weekly" value="weekly" />
                        <Picker.Item label="Monthly" value="monthly" />
                      </Picker>
                      {recurrence === 'weekly' && (
                        <View style={styles.row}>
                          <CustomWeekPicker
                            selectedDays={selectedDays}
                            onDaysChange={(days) => {
                              setSelectedDays(days);
                              setHasChanges(true);
                            }}
                            style={styles.halfWidth}
                          />
                          <TouchableOpacity
                            style={styles.halfWidth}
                            onPress={() => setShowTimePicker(true)}
                          >
                            <Text style={theme.input}>
                              {dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      {recurrence !== 'weekly' && (
                        <TouchableOpacity
                          style={styles.fullWidth}
                          onPress={() => setShowTimePicker(true)}
                        >
                          <Text style={theme.input}>
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
                      <Button title="Create Task" onPress={handleCreateTask} />
                      <Button title="Cancel" onPress={() => {
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
                      }} />
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

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#007BFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  taskMode: {
    backgroundColor: '#E0F7FA', // Light cyan for tasks
  },
  badHabitMode: {
    backgroundColor: '#FFEBEE', // Light pink for bad habits
  },
  infoBox: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  infoTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  halfWidth: {
    width: '48%',
  },
  fullWidth: {
    width: '100%',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    paddingBottom: 90, // Extend the bottom to encapsulate the description box
    maxHeight: '97%', // Ensure the modal doesn't exceed the screen height
    zIndex: 1000, // Ensure the modal is above other elements
  },
  picker: {
    flex: 1,
  },
  numberInput: {
    width: '30%',
    marginLeft: 10,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  }
});