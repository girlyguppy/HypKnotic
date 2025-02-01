import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, Platform, TouchableWithoutFeedback } from 'react-native';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function PunishmentsTab() {
  const [theme] = useAtom(themeAtom);
  const { punishments, addPunishment, removePunishment, updatePunishmentCount } = useRewardsPunishments();
  const [punishmentName, setPunishmentName] = useState('');
  const [punishmentDescription, setPunishmentDescription] = useState('');
  const [showAddPunishment, setShowAddPunishment] = useState(false);

  const dynamicStyles = useMemo(() => StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: theme.container.backgroundColor,
    },
    addButton: {
      backgroundColor: theme.button.backgroundColor,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    addButtonText: {
      color: theme.buttonText.color,
      fontSize: 18,
      fontWeight: 'bold',
    },
    punishmentContainer: {
      backgroundColor: theme.punishmentBackground,
      padding: 20,
      borderRadius: 10,
      marginVertical: 10,
      borderWidth: 1,
      borderColor: theme.borderColor || '#000',
    },
    punishmentName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.title.color,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 10,
    },
    incrementButton: {
      backgroundColor: theme.incrementButtonBackground,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginRight: 5,
    },
    incrementButtonText: {
      color: theme.incrementButtonTextColor,
      fontSize: 16,
    },
    decrementButton: {
      backgroundColor: theme.decrementButtonBackground,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginLeft: 5,
    },
    decrementButtonText: {
      color: theme.decrementButtonTextColor,
      fontSize: 16,
    },
    completeButton: {
      backgroundColor: theme.completeButtonBackground,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    completeButtonText: {
      color: theme.completeButtonTextColor,
      fontSize: 16,
    },
    deleteButton: {
      backgroundColor: theme.deleteButtonBackground,
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      marginLeft: 5,
    },
    deleteButtonText: {
      color: theme.deleteButtonTextColor,
      fontSize: 16,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.modalOverlayBackground || 'rgba(0, 0, 0, 0.5)',
    },
    form: {
      backgroundColor: theme.formBackground || '#FFF',
      padding: 20,
      borderRadius: 10,
      marginVertical: 10,
    },
    input: {
      backgroundColor: theme.inputBackground || '#FFF',
      padding: 10,
      borderRadius: 5,
      marginVertical: 5,
      borderWidth: 1,
      borderColor: theme.inputBorderColor || '#000',
      color: theme.textColor,
    },
    confirmButton: {
      backgroundColor: theme.confirmButtonBackground,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 5,
    },
    confirmButtonText: {
      color: theme.confirmButtonTextColor,
      fontSize: 18,
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: theme.cancelButtonBackground,
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 5,
    },
    cancelButtonText: {
      color: theme.cancelButtonTextColor,
      fontSize: 18,
      fontWeight: 'bold',
    },
  }), [theme]);

  const handleAddPunishment = () => {
    if (punishmentName) {
      const newPunishment = {
        name: punishmentName,
        description: punishmentDescription,
        count: 0,
      };
      addPunishment(newPunishment);
      setPunishmentName('');
      setPunishmentDescription('');
      setShowAddPunishment(false);
    } else {
      Alert.alert('Error', 'Please fill out the punishment name.');
    }
  };

  const handleIncrementCount = (punishment) => {
    updatePunishmentCount(punishment.name, punishment.count + 1);
  };

  const handleDecrementCount = (punishment) => {
    if (punishment.count > 0) {
      updatePunishmentCount(punishment.name, punishment.count - 1);
    }
  };

  const handleCompletePunishment = (punishment) => {
    if (punishment.count > 0) {
      updatePunishmentCount(punishment.name, punishment.count - 1);
    }
  };

  const handleDeletePunishment = (punishment) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this punishment? You will need to remake it if deleted.")) {
        removePunishment(punishment.name);
      }
    } else {
      Alert.alert(
        "Delete Punishment",
        "Are you sure you want to delete this punishment? You will need to remake it if deleted.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: () => removePunishment(punishment.name),
            style: "destructive"
          }
        ]
      );
    }
  };

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.punishmentName}>Punishments</Text>

      <TouchableOpacity style={dynamicStyles.addButton} onPress={() => setShowAddPunishment(true)}>
        <Text style={dynamicStyles.addButtonText}>+ Add Punishment</Text>
      </TouchableOpacity>

      <FlatList
        data={punishments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={dynamicStyles.punishmentContainer}>
            <Text style={dynamicStyles.punishmentName}>{item.name}</Text>
            {item.description ? <Text style={{ color: theme.textColor }}>{item.description}</Text> : null}
            <Text style={{ color: theme.textColor }}>Count: {item.count}</Text>
            <View style={dynamicStyles.row}>
              <TouchableOpacity style={dynamicStyles.incrementButton} onPress={() => handleIncrementCount(item)}>
                <Text style={dynamicStyles.incrementButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.decrementButton} onPress={() => handleDecrementCount(item)}>
                <Text style={dynamicStyles.decrementButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity style={dynamicStyles.deleteButton} onPress={() => handleDeletePunishment(item)}>
                <Text style={dynamicStyles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
            {item.count > 0 && (
              <TouchableOpacity style={dynamicStyles.completeButton} onPress={() => handleCompletePunishment(item)}>
                <Text style={dynamicStyles.completeButtonText}>Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <Modal visible={showAddPunishment} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setShowAddPunishment(false)}>
          <View style={dynamicStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={dynamicStyles.form}>
                <TextInput
                  style={[dynamicStyles.input, { minWidth: '80%' }]}
                  placeholder="Punishment Name"
                  placeholderTextColor={theme.placeholderTextColor}
                  value={punishmentName}
                  onChangeText={setPunishmentName}
                />
                <TextInput
                  style={[dynamicStyles.input, { minWidth: '80%' }]}
                  placeholder="Punishment Description"
                  placeholderTextColor={theme.placeholderTextColor}
                  value={punishmentDescription}
                  onChangeText={setPunishmentDescription}
                  multiline
                />
                <TouchableOpacity style={dynamicStyles.confirmButton} onPress={handleAddPunishment}>
                  <Text style={dynamicStyles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={dynamicStyles.cancelButton} onPress={() => setShowAddPunishment(false)}>
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
