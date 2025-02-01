import React, { useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, TextInput, Modal, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomDatePicker from '../tools/CustomDatePicker';
// Remove the custom useTheme import and use Jotai instead
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function JournalsTab() {
  const [theme] = useAtom(themeAtom);
  const [entries, setEntries] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date(new Date().setHours(23, 45, 0, 0))); // Default to 11:45 PM
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const handleCreateEntry = () => {
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
    setDueTime(new Date(new Date().setHours(23, 45, 0, 0))); // Reset to 11:45 PM
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
    <View style={theme.container}>
      <Text style={theme.title}>Journals</Text>
      <TouchableOpacity style={theme.button} onPress={() => setIsModalVisible(true)}>
        <Text style={theme.buttonText}>+ Add Entry</Text>
      </TouchableOpacity>

      <FlatList
        data={entries}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={theme.entryContainer}>
            <Text style={theme.item}>{item.title}</Text>
            <Text>{item.content}</Text>
            <Text>Due: {item.dueDate.toLocaleDateString()} {item.dueTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            <TextInput
              style={theme.input}
              placeholder="Sub Response"
              value={item.subResponse}
              onChangeText={(text) => handleSubResponseChange(index, text)}
            />
            <TextInput
              style={theme.input}
              placeholder="Dom Comment"
              value={item.domComment}
              onChangeText={(text) => handleDomCommentChange(index, text)}
            />
          </View>
        )}
      />

      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={theme.modalOverlay}>
          <View style={theme.modalContainer}>
            <Text style={theme.title}>Create Entry</Text>
            <TextInput
              style={theme.input}
              placeholder="Entry Title"
              value={entryTitle}
              onChangeText={setEntryTitle}
            />
            <TextInput
              style={theme.input}
              placeholder="Entry Content"
              value={entryContent}
              onChangeText={setEntryContent}
            />
            <CustomDatePicker date={dueDate} onDateChange={handleDateChange} />
            <TouchableOpacity
              style={theme.button}
              onPress={() => setIsTimePickerVisible(true)}
            >
              <Text style={theme.buttonText}>
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
            <Button title="Create Entry" onPress={handleCreateEntry} />
            <Button title="Cancel" onPress={resetModalFields} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add your styles here if needed
});