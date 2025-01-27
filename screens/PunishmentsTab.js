import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet, Alert, Platform, TouchableWithoutFeedback } from 'react-native';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';
import { useTheme } from '../App';

export default function PunishmentsTab() {
  const { punishments, addPunishment, removePunishment, updatePunishmentCount } = useRewardsPunishments();
  const theme = useTheme();
  const [punishmentName, setPunishmentName] = useState('');
  const [punishmentDescription, setPunishmentDescription] = useState('');
  const [showAddPunishment, setShowAddPunishment] = useState(false);

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
            onPress: () => {
              removePunishment(punishment.name);
            },
            style: "destructive"
          }
        ]
      );
    }
  };

  return (
    <View style={theme.container}>
      <Text style={theme.title}>Punishments</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowAddPunishment(true)}>
        <Text style={styles.addButtonText}>+ Add Punishment</Text>
      </TouchableOpacity>

      <FlatList
        data={punishments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.punishmentContainer}>
            <Text style={styles.punishmentName}>{item.name}</Text>
            {item.description ? <Text>{item.description}</Text> : null}
            <Text>Count: {item.count}</Text>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.incrementButton}
                onPress={() => handleIncrementCount(item)}
              >
                <Text style={styles.incrementButtonText}>+</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.decrementButton}
                onPress={() => handleDecrementCount(item)}
              >
                <Text style={styles.decrementButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeletePunishment(item)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
            {item.count > 0 && (
              <TouchableOpacity
                style={styles.completeButton}
                onPress={() => handleCompletePunishment(item)}
              >
                <Text style={styles.completeButtonText}>Complete</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <Modal visible={showAddPunishment} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={() => setShowAddPunishment(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.form}>
                <TextInput
                  style={[styles.input, { minWidth: '80%' }]}
                  placeholder="Punishment Name"
                  value={punishmentName}
                  onChangeText={setPunishmentName}
                />
                <TextInput
                  style={[styles.input, { minWidth: '80%' }]}
                  placeholder="Punishment Description"
                  value={punishmentDescription}
                  onChangeText={setPunishmentDescription}
                  multiline
                />
                <TouchableOpacity style={styles.confirmButton} onPress={handleAddPunishment}>
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setShowAddPunishment(false)}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  punishmentContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  punishmentName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  incrementButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 5,
  },
  incrementButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  decrementButton: {
    backgroundColor: '#FFC107',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 5,
  },
  decrementButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  completeButton: {
    backgroundColor: '#17A2B8',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#DC3545',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 5,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  form: {
    backgroundColor: '#F0F0F0',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  confirmButton: {
    backgroundColor: '#28A745',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#DC3545',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
