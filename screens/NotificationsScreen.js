import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Switch, StyleSheet, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function NotificationsScreen() {
  const [theme] = useAtom(themeAtom);
  const [notifications, setNotifications] = useState({
    taskReminders: true,
    dailyDigest: false,
    rewardNotifications: true,
    punishmentReminders: true,
  });
  const [reminderTime, setReminderTime] = useState('09:00');
  const [customReminders, setCustomReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState('');

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const addCustomReminder = () => {
    if (newReminderText.trim()) {
      setCustomReminders([...customReminders, {
        id: Date.now(),
        text: newReminderText,
        enabled: true,
      }]);
      setNewReminderText('');
    }
  };

  const removeReminder = (id) => {
    setCustomReminders(customReminders.filter(r => r.id !== id));
  };

  const toggleCustomReminder = (id) => {
    setCustomReminders(customReminders.map(r => 
      r.id === id ? { ...r, enabled: !r.enabled } : r
    ));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.container?.backgroundColor || '#E6E6FA' }]}>
      <Text style={[styles.title, { color: theme.title?.color || '#4B0082' }]}>Notifications</Text>

      {/* Built-in Notification Settings */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor || '#4B0082' }]}>Notification Settings</Text>
        
        <View style={[styles.settingRow, { backgroundColor: theme.tabButton?.backgroundColor || '#F0F0F0' }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.textColor || '#000' }]}>Task Reminders</Text>
            <Text style={[styles.settingDescription, { color: theme.placeholderTextColor || '#666' }]}>
              Get reminded about upcoming task deadlines
            </Text>
          </View>
          <Switch
            value={notifications.taskReminders}
            onValueChange={() => toggleNotification('taskReminders')}
            trackColor={{ false: '#ccc', true: theme.activeTabButton?.backgroundColor || '#D8BFD8' }}
          />
        </View>

        <View style={[styles.settingRow, { backgroundColor: theme.tabButton?.backgroundColor || '#F0F0F0' }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.textColor || '#000' }]}>Daily Digest</Text>
            <Text style={[styles.settingDescription, { color: theme.placeholderTextColor || '#666' }]}>
              Receive a daily summary of your progress
            </Text>
          </View>
          <Switch
            value={notifications.dailyDigest}
            onValueChange={() => toggleNotification('dailyDigest')}
            trackColor={{ false: '#ccc', true: theme.activeTabButton?.backgroundColor || '#D8BFD8' }}
          />
        </View>

        <View style={[styles.settingRow, { backgroundColor: theme.tabButton?.backgroundColor || '#F0F0F0' }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.textColor || '#000' }]}>Reward Notifications</Text>
            <Text style={[styles.settingDescription, { color: theme.placeholderTextColor || '#666' }]}>
              Get notified when you earn rewards
            </Text>
          </View>
          <Switch
            value={notifications.rewardNotifications}
            onValueChange={() => toggleNotification('rewardNotifications')}
            trackColor={{ false: '#ccc', true: theme.activeTabButton?.backgroundColor || '#D8BFD8' }}
          />
        </View>

        <View style={[styles.settingRow, { backgroundColor: theme.tabButton?.backgroundColor || '#F0F0F0' }]}>
          <View style={styles.settingInfo}>
            <Text style={[styles.settingLabel, { color: theme.textColor || '#000' }]}>Punishment Reminders</Text>
            <Text style={[styles.settingDescription, { color: theme.placeholderTextColor || '#666' }]}>
              Get reminded about pending punishments
            </Text>
          </View>
          <Switch
            value={notifications.punishmentReminders}
            onValueChange={() => toggleNotification('punishmentReminders')}
            trackColor={{ false: '#ccc', true: theme.activeTabButton?.backgroundColor || '#D8BFD8' }}
          />
        </View>
      </View>

      {/* Default Reminder Time */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor || '#4B0082' }]}>Default Reminder Time</Text>
        <View style={[styles.timeContainer, { backgroundColor: theme.tabButton?.backgroundColor || '#F0F0F0' }]}>
          <TextInput
            style={[styles.timeInput, { 
              color: theme.textColor || '#000',
              borderColor: theme.borderColor || '#ccc'
            }]}
            value={reminderTime}
            onChangeText={setReminderTime}
            placeholder="HH:MM"
            placeholderTextColor={theme.placeholderTextColor || '#888'}
          />
          <Text style={[styles.timeHint, { color: theme.placeholderTextColor || '#666' }]}>
            24-hour format (e.g., 09:00, 14:30)
          </Text>
        </View>
      </View>

      {/* Custom Reminders */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.textColor || '#4B0082' }]}>Custom Reminders</Text>
        
        <View style={styles.addReminderRow}>
          <TextInput
            style={[styles.reminderInput, { 
              color: theme.textColor || '#000',
              borderColor: theme.borderColor || '#ccc',
              backgroundColor: theme.tabButton?.backgroundColor || '#FFF'
            }]}
            value={newReminderText}
            onChangeText={setNewReminderText}
            placeholder="Enter reminder text..."
            placeholderTextColor={theme.placeholderTextColor || '#888'}
          />
          <TouchableOpacity 
            style={[styles.addButton, { backgroundColor: theme.button?.backgroundColor || '#D8BFD8' }]}
            onPress={addCustomReminder}
          >
            <Text style={[styles.addButtonText, { color: theme.buttonText?.color || '#4B0082' }]}>Add</Text>
          </TouchableOpacity>
        </View>

        {customReminders.length === 0 ? (
          <Text style={[styles.emptyText, { color: theme.placeholderTextColor || '#888' }]}>
            No custom reminders yet
          </Text>
        ) : (
          customReminders.map((reminder) => (
            <View 
              key={reminder.id} 
              style={[styles.reminderRow, { backgroundColor: theme.tabButton?.backgroundColor || '#F0F0F0' }]}
            >
              <Switch
                value={reminder.enabled}
                onValueChange={() => toggleCustomReminder(reminder.id)}
                trackColor={{ false: '#ccc', true: theme.activeTabButton?.backgroundColor || '#D8BFD8' }}
              />
              <Text style={[styles.reminderText, { color: theme.textColor || '#000' }]}>
                {reminder.text}
              </Text>
              <TouchableOpacity onPress={() => removeReminder(reminder.id)}>
                <Text style={styles.deleteButton}>✕</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 3,
  },
  timeContainer: {
    padding: 15,
    borderRadius: 10,
  },
  timeInput: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  timeHint: {
    textAlign: 'center',
    fontSize: 12,
  },
  addReminderRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  reminderInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
  },
  addButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 10,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
  reminderText: {
    flex: 1,
    fontSize: 14,
  },
  deleteButton: {
    color: '#DC3545',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
  },
});