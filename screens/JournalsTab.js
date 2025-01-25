import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Modal } from 'react-native';
import { useTheme } from '../App';
import CustomDatePicker from '../tools/CustomDatePicker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function JournalsTab() {
  const theme = useTheme();
  const [entries, setEntries] = useState([]);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [dueTime, setDueTime] = useState(new Date());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [subResponse, setSubResponse] = useState('');
  const [domComment, setDomComment] = useState('');

  const handleCreateEntry = () => {
    if (entryTitle && entryContent) {
      const newEntry = {
        title: entryTitle,
        content: entryContent,
        dueDate,
        dueTime,
        subResponse: '',
        domComment: '',
      };
      setEntries([...entries, newEntry]);
      setEntryTitle('');
      setEntryContent('');
      setDueDate(new Date());
      setDueTime(new Date());
      setIsModalVisible(false);
    }
  };

  const resetModalFields = () => {
    setEntryTitle('');
    setEntryContent('');
    setDueDate(new Date());
    setDueTime(new Date());
    setIsModalVisible(false);
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

  const handleSubResponseChange = (index, response) => {
    const updatedEntries = [...entries];
    updatedEntries[index].subResponse = response;
    setEntries(updatedEntries);
  };

  const handleDomCommentChange = (index, comment) => {
    const updatedEntries = [...entries];
    updatedEntries[index].domComment = comment;
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
            <Text>Due: {item.dueDate.toLocaleDateString()} {item.dueTime.toLocaleTimeString()}</Text>
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
            <Button title="Set Due Time" onPress={() => setIsTimePickerVisible(true)} />
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