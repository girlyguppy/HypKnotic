import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';
import { useTheme } from '../App';

export default function PunishmentsTab() {
  const { punishments, addPunishment, updatePunishmentCount } = useRewardsPunishments();
  const theme = useTheme();
  const [punishmentName, setPunishmentName] = useState('');
  const [punishmentDescription, setPunishmentDescription] = useState('');
  const [showAddPunishment, setShowAddPunishment] = useState(false);
  const [selectedPunishment, setSelectedPunishment] = useState(null);

  const handleAddPunishment = () => {
    if (punishmentName && punishmentDescription) {
      const newPunishment = {
        name: punishmentName,
        description: punishmentDescription,
        count: 0,
      };
      addPunishment(newPunishment);
      setPunishmentName('');
      setPunishmentDescription('');
      setShowAddPunishment(false);
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
            <Text style={theme.item}>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>Count: {item.count}</Text>
            <View style={styles.buttonContainer}>
              <Button title="+" onPress={() => handleIncrementCount(item)} />
              <Button title="-" onPress={() => handleDecrementCount(item)} />
            </View>
            {item.count > 0 && (
              <Button title="Complete" onPress={() => handleCompletePunishment(item)} />
            )}
          </View>
        )}
      />

      <Modal visible={showAddPunishment} animationType="slide" transparent={true}>
        <View style={theme.modalOverlay}>
          <View style={theme.modalContainer}>
            <Text style={theme.title}>Add Punishment</Text>
            <TextInput
              style={theme.input}
              placeholder="Punishment Name"
              value={punishmentName}
              onChangeText={setPunishmentName}
            />
            <TextInput
              style={theme.input}
              placeholder="Punishment Description"
              value={punishmentDescription}
              onChangeText={setPunishmentDescription}
            />
            <TouchableOpacity style={theme.button} onPress={handleAddPunishment}>
              <Text style={theme.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={theme.button} onPress={() => setShowAddPunishment(false)}>
              <Text style={theme.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: '#007BFF',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  punishmentContainer: {
    backgroundColor: '#f9f9f9',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});