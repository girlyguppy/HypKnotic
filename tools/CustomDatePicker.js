import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CustomDatePicker = ({ date, onDateChange }) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);

  const handleConfirm = () => {
    onDateChange(selectedDate);
    setShow(false);
  };

  return (
    <View>
      <Button title="Select Due Date" onPress={() => setShow(true)} />
      <Modal transparent={true} visible={show} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.title}>Select Date</Text>
            <Calendar
              onDayPress={(day) => {
                const newDate = new Date(day.dateString);
                setSelectedDate(newDate);
              }}
              markedDates={{
                [selectedDate.toISOString().split('T')[0]]: { selected: true },
              }}
            />
            <Button title="Confirm" onPress={handleConfirm} />
            <Button title="Cancel" onPress={() => setShow(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  datePickerContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default CustomDatePicker;