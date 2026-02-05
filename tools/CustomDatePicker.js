import React, { useState, useMemo } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

const CustomDatePicker = ({ date, onDateChange }) => {
  const [theme] = useAtom(themeAtom);
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);

  const dynamicStyles = useMemo(() => ({
    selectButton: {
      backgroundColor: theme.colors?.primary || '#9B59B6',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 8,
    },
    selectButtonText: {
      color: theme.colors?.textOnPrimary || '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    container: {
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      padding: 20,
      borderRadius: 16,
      alignItems: 'center',
      minWidth: 320,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.colors?.text || '#1A1A1A',
    },
    confirmButton: {
      backgroundColor: theme.colors?.primary || '#9B59B6',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 4,
      width: '100%',
    },
    confirmButtonText: {
      color: theme.colors?.textOnPrimary || '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    cancelButton: {
      backgroundColor: theme.colors?.danger || '#DC3545',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 4,
      width: '100%',
    },
    cancelButtonText: {
      color: theme.colors?.dangerText || '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
  }), [theme]);

  // Calendar theme
  const calendarTheme = useMemo(() => ({
    backgroundColor: theme.colors?.surface || '#FFFFFF',
    calendarBackground: theme.colors?.surface || '#FFFFFF',
    textSectionTitleColor: theme.colors?.text || '#1A1A1A',
    selectedDayBackgroundColor: theme.colors?.primary || '#9B59B6',
    selectedDayTextColor: theme.colors?.textOnPrimary || '#FFFFFF',
    todayTextColor: theme.colors?.primary || '#9B59B6',
    dayTextColor: theme.colors?.text || '#1A1A1A',
    textDisabledColor: theme.colors?.textMuted || '#888888',
    arrowColor: theme.colors?.primary || '#9B59B6',
    monthTextColor: theme.colors?.text || '#1A1A1A',
    textMonthFontWeight: 'bold',
  }), [theme]);

  const handleConfirm = () => {
    onDateChange(null, selectedDate);
    setShow(false);
  };

  return (
    <View>
      <TouchableOpacity style={dynamicStyles.selectButton} onPress={() => setShow(true)}>
        <Text style={dynamicStyles.selectButtonText}>
          {selectedDate.toLocaleDateString()}
        </Text>
      </TouchableOpacity>
      <Modal transparent={true} visible={show} animationType="slide">
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.container}>
            <Text style={dynamicStyles.title}>Select Date</Text>
            <Calendar
              theme={calendarTheme}
              onDayPress={(day) => {
                const newDate = new Date(day.dateString);
                setSelectedDate(newDate);
              }}
              markedDates={{
                [selectedDate.toISOString().split('T')[0]]: { selected: true },
              }}
            />
            <TouchableOpacity style={dynamicStyles.confirmButton} onPress={handleConfirm}>
              <Text style={dynamicStyles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={dynamicStyles.cancelButton} onPress={() => setShow(false)}>
              <Text style={dynamicStyles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CustomDatePicker;
