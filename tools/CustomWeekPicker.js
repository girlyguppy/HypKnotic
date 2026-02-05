import React, { useState, useMemo } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CustomWeekPicker = ({ selectedDays, onDaysChange }) => {
  const [theme] = useAtom(themeAtom);
  const [show, setShow] = useState(false);
  const [tempSelectedDays, setTempSelectedDays] = useState([...selectedDays]);

  const dynamicStyles = useMemo(() => ({
    selectButton: {
      backgroundColor: theme.colors?.primary || '#9B59B6',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: 'center',
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
      minWidth: 300,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 16,
      color: theme.colors?.text || '#1A1A1A',
    },
    weekContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
      marginBottom: 16,
    },
    day: {
      padding: 10,
      fontSize: 14,
      color: theme.colors?.text || '#1A1A1A',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
      backgroundColor: theme.colors?.surface || '#FFFFFF',
    },
    selectedDay: {
      padding: 10,
      fontSize: 14,
      color: theme.colors?.textOnPrimary || '#FFFFFF',
      backgroundColor: theme.colors?.primary || '#9B59B6',
      borderRadius: 8,
      overflow: 'hidden',
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
      <TouchableOpacity style={dynamicStyles.selectButton} onPress={() => setShow(true)}>
        <Text style={dynamicStyles.selectButtonText}>Select Days</Text>
      </TouchableOpacity>
      <Modal transparent={true} visible={show} animationType="slide">
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.container}>
            <Text style={dynamicStyles.title}>Select Days</Text>
            <View style={dynamicStyles.weekContainer}>
              {daysOfWeek.map((day, index) => (
                <TouchableOpacity key={index} onPress={() => toggleDay(day)}>
                  <Text style={tempSelectedDays.includes(day) ? dynamicStyles.selectedDay : dynamicStyles.day}>
                    {day}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
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

export default CustomWeekPicker;
