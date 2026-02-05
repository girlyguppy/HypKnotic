import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomDatePicker from '../tools/CustomDatePicker';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function JournalsTab() {
  const [theme] = useAtom(themeAtom);
  const [entries, setEntries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date(new Date().setHours(23, 45, 0, 0)));
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  // Dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    container: {
      flex: 1,
      backgroundColor: theme.colors?.background || theme.container?.backgroundColor || '#F3E8FF',
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors?.text || '#1A1A1A',
      marginBottom: 16,
    },
    addButton: {
      backgroundColor: theme.colors?.primary || '#9B59B6',
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16,
    },
    addButtonText: {
      color: theme.colors?.textOnPrimary || '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    entryCard: {
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
    },
    entryTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors?.text || '#1A1A1A',
      marginBottom: 4,
    },
    entryContent: {
      fontSize: 14,
      color: theme.colors?.textSecondary || '#666666',
      marginBottom: 8,
    },
    entryMeta: {
      fontSize: 12,
      color: theme.colors?.textMuted || '#888888',
      marginBottom: 8,
    },
    input: {
      backgroundColor: theme.colors?.inputBackground || '#FFFFFF',
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.colors?.inputText || '#1A1A1A',
      marginVertical: 8,
    },
    responseSection: {
      marginTop: 12,
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: theme.colors?.border || '#DDDDDD',
    },
    responseLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: theme.colors?.textMuted || '#888888',
      marginBottom: 4,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContainer: {
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      padding: 24,
      borderRadius: 16,
      width: '90%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: theme.colors?.text || '#1A1A1A',
      marginBottom: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.colors?.text || '#1A1A1A',
      marginTop: 8,
    },
    timeButton: {
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
      borderRadius: 8,
      padding: 12,
      marginVertical: 8,
      alignItems: 'center',
    },
    timeButtonText: {
      fontSize: 16,
      color: theme.colors?.text || '#1A1A1A',
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
    emptyText: {
      textAlign: 'center',
      color: theme.colors?.textMuted || '#888888',
      fontSize: 16,
      marginTop: 40,
    },
  }), [theme]);

  const handleCreateEntry = () => {
    if (!entryTitle.trim()) return;
    const newEntry = {
      title: entryTitle,
      content: entryContent,
      dueDate,
      dueTime,
      subResponse: '',
      domComment: '',
    };
    setEntries([...entries, newEntry]);
    resetModalFields();
  };

  const resetModalFields = () => {
    setEntryTitle('');
    setEntryContent('');
    setDueDate(new Date());
    setDueTime(new Date(new Date().setHours(23, 45, 0, 0)));
    setIsModalVisible(false);
    setIsTimePickerVisible(false);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dueDate;
    setDueDate(currentDate);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || dueTime;
    setIsTimePickerVisible(false);
    setDueTime(currentTime);
  };

  const handleSubResponseChange = (index, text) => {
    const updatedEntries = [...entries];
    updatedEntries[index].subResponse = text;
    setEntries(updatedEntries);
  };

  const handleDomCommentChange = (index, text) => {
    const updatedEntries = [...entries];
    updatedEntries[index].domComment = text;
    setEntries(updatedEntries);
  };

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Journals</Text>
      
      <TouchableOpacity 
        style={dynamicStyles.addButton} 
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={dynamicStyles.addButtonText}>+ Add Entry</Text>
      </TouchableOpacity>

      <FlatList
        data={entries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={dynamicStyles.entryCard}>
            <Text style={dynamicStyles.entryTitle}>{item.title}</Text>
            {item.content ? <Text style={dynamicStyles.entryContent}>{item.content}</Text> : null}
            <Text style={dynamicStyles.entryMeta}>
              Due: {item.dueDate.toLocaleDateString()} {item.dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <View style={dynamicStyles.responseSection}>
              <Text style={dynamicStyles.responseLabel}>Sub Response:</Text>
              <TextInput
                style={dynamicStyles.input}
                placeholder="Write your response..."
                placeholderTextColor={theme.colors?.textMuted || '#888'}
                value={item.subResponse}
                onChangeText={(text) => handleSubResponseChange(index, text)}
                multiline
              />
              <Text style={dynamicStyles.responseLabel}>Dom Comment:</Text>
              <TextInput
                style={dynamicStyles.input}
                placeholder="Add a comment..."
                placeholderTextColor={theme.colors?.textMuted || '#888'}
                value={item.domComment}
                onChangeText={(text) => handleDomCommentChange(index, text)}
                multiline
              />
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={dynamicStyles.emptyText}>No journal entries yet. Tap the button above to add one.</Text>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
          <View style={dynamicStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={dynamicStyles.modalContainer}>
                <Text style={dynamicStyles.modalTitle}>Create Entry</Text>
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="Entry Title"
                  placeholderTextColor={theme.colors?.textMuted || '#888'}
                  value={entryTitle}
                  onChangeText={setEntryTitle}
                />
                <TextInput
                  style={[dynamicStyles.input, { minHeight: 80, textAlignVertical: 'top' }]}
                  placeholder="Entry Content (optional)"
                  placeholderTextColor={theme.colors?.textMuted || '#888'}
                  value={entryContent}
                  onChangeText={setEntryContent}
                  multiline
                />
                <Text style={dynamicStyles.label}>Due Date:</Text>
                <CustomDatePicker date={dueDate} onDateChange={handleDateChange} />
                <Text style={dynamicStyles.label}>Due Time:</Text>
                <TouchableOpacity
                  style={dynamicStyles.timeButton}
                  onPress={() => setIsTimePickerVisible(true)}
                >
                  <Text style={dynamicStyles.timeButtonText}>
                    {dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Text>
                </TouchableOpacity>
                {isTimePickerVisible && (
                  <DateTimePicker
                    value={dueTime}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                  />
                )}
                <TouchableOpacity 
                  style={[dynamicStyles.actionButton, !entryTitle.trim() && { opacity: 0.5 }]}
                  onPress={handleCreateEntry}
                  disabled={!entryTitle.trim()}
                >
                  <Text style={dynamicStyles.actionButtonText}>Create Entry</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={dynamicStyles.cancelButton}
                  onPress={resetModalFields}
                >
                  <Text style={dynamicStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
