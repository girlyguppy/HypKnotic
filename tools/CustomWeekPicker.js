import React, { useState } from 'react';
import { View, Text, Button, Modal, StyleSheet, TouchableOpacity } from 'react-native';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CustomWeekPicker = ({ selectedDays, onDaysChange }) => {
  const [show, setShow] = useState(false);
  const [tempSelectedDays, setTempSelectedDays] = useState([...selectedDays]);

  const toggleDay = (day) => {
    if (tempSelectedDays.includes(day)) {
      setTempSelectedDays(tempSelectedDays.filter(d => d !== day));
    } else {
      setTempSelectedDays([...tempSelectedDays, day]);
    }
  };

  const handleConfirm = () => {
    onDaysChange(tempSelectedDays);
    setShow(false);
  };

  return (
    <View>
      <Button title="Select Days" onPress={() => setShow(true)} />
      <Modal transparent={true} visible={show} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.title}>Select Days</Text>
            <View style={styles.weekContainer}>
              {daysOfWeek.map((day, index) => (
                <TouchableOpacity key={index} onPress={() => toggleDay(day)}>
                  <Text style={tempSelectedDays.includes(day) ? styles.selectedDay : styles.day}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  day: {
    padding: 10,
    fontSize: 18,
  },
  selectedDay: {
    padding: 10,
    fontSize: 18,
    backgroundColor: 'lightblue',
  },
});

export default CustomWeekPicker;