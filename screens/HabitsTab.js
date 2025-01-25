import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CustomWeekPicker from '../tools/CustomWeekPicker';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';
import { useTheme } from '../App';

export default function HabitsTab() {
  const { rewards, punishments } = useRewardsPunishments();
  const theme = useTheme();
  const [tasks, setTasks] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [rewardPoints, setRewardPoints] = useState(0);
  const [punishmentPoints, setPunishmentPoints] = useState(0);
  const [selectedRewards, setSelectedRewards] = useState([]);
  const [selectedPunishments, setSelectedPunishments] = useState([]);
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [recurrence, setRecurrence] = useState('none'); // Options: 'none', 'daily', 'weekly', 'monthly'
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    if (rewards.length === 0 || punishments.length === 0) {
      setSelectedRewards([{ name: 'test reward', quantity: 1 }]);
      setSelectedPunishments([{ name: 'test punishment', quantity: 1 }]);
      setTaskName('Test Task');
      setTaskDescription('This is a test task with a reward and punishment.');
    }
  }, [rewards, punishments]);

  const handleCreateTask = () => {
    const newTask = {
      name: taskName,
      description: taskDescription,
      rewards: selectedRewards,
      punishments: selectedPunishments,
      rewardPoints,
      punishmentPoints,
      dueDate,
      recurrence,
      selectedDays,
      isCompleted: false,
    };

    setTasks([...tasks, newTask]);
    resetModalFields();
  };

  const resetModalFields = () => {
    setTaskName('');
    setTaskDescription('');
    setRewardPoints(0);
    setPunishmentPoints(0);
    setSelectedRewards([]);
    setSelectedPunishments([]);
    setDueDate(new Date());
    setRecurrence('none');
    setSelectedDays([]);
    setIsModalVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setShowDatePicker(false);
    setDueDate(currentDate);
  };

  const handleRecurrenceChange = (type) => setRecurrence(type);

  const handleCompleteTask = (task) => {
    const updatedTasks = tasks.map((t) => {
      if (t.name === task.name) {
        return { ...t, isCompleted: true };
      }
      return t;
    });

    setTasks(updatedTasks);
    // Logic for applying rewards/punishments here
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

  return (
    <View style={theme.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ Add Task</Text>
      </TouchableOpacity>

      <FlatList
        data={tasks}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={theme.taskContainer}>
            <Text style={theme.item}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Due: {item.dueDate.toLocaleString()}</Text>
            <Text>Recurrence: {item.recurrence}</Text>
            <Text>Days: {item.selectedDays.join(', ')}</Text>
            <Text>Rewards: {item.rewards.map(r => `${r.name} (x${r.quantity})`).join(', ')}</Text>
            <Text>Punishments: {item.punishments.map(p => `${p.name} (x${p.quantity})`).join(', ')}</Text>
            <Button
              title={item.isCompleted ? "Completed" : "Complete Task"}
              onPress={() => handleCompleteTask(item)}
            />
          </View>
        )}
      />

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={theme.modalOverlay}>
          <View style={theme.modalContainer}>
            <Text style={theme.title}>Create Task</Text>
            <TextInput
              style={theme.input}
              placeholder="Task Name"
              value={taskName}
              onChangeText={setTaskName}
            />
            <TextInput
              style={theme.input}
              placeholder="Task Description"
              value={taskDescription}
              onChangeText={setTaskDescription}
            />
            <Text>Rewards upon completion:</Text>
            <Picker
              selectedValue=""
              onValueChange={(itemValue) => handleRewardSelect(itemValue)}
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
                    onChangeText={(text) => handleQuantityChange('reward', reward.name, parseInt(text))}
                  />
                </View>
              ))}
            </View>
            <Text>Punishments on failure:</Text>
            <Picker
              selectedValue=""
              onValueChange={(itemValue) => handlePunishmentSelect(itemValue)}
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
                    onChangeText={(text) => handleQuantityChange('punishment', punishment.name, parseInt(text))}
                  />
                </View>
              ))}
            </View>

            <Text>Recurrence:</Text>
            <Picker
              selectedValue={recurrence}
              onValueChange={(itemValue) => setRecurrence(itemValue)}
            >
              <Picker.Item label="None" value="none" />
              <Picker.Item label="Daily" value="daily" />
              <Picker.Item label="Weekly" value="weekly" />
              <Picker.Item label="Monthly" value="monthly" />
            </Picker>
            {recurrence === 'weekly' && (
              <CustomWeekPicker
                selectedDays={selectedDays}
                onDaysChange={setSelectedDays}
              />
            )}
            <Button title="Create Task" onPress={handleCreateTask} />
            <Button title="Cancel" onPress={resetModalFields} />
          </View>
        </View>
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
});