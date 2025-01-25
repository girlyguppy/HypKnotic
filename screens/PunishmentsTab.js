import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';
import { useTheme } from '../App';

export default function PunishmentsTab() {
  const { punishments, addPunishment } = useRewardsPunishments();
  const theme = useTheme();
  const [punishmentName, setPunishmentName] = useState('');
  const [punishmentDescription, setPunishmentDescription] = useState('');
  const [showAddPunishment, setShowAddPunishment] = useState(false);

  const handleAddPunishment = () => {
    if (punishmentName && punishmentDescription) {
      const newPunishment = {
        name: punishmentName,
        description: punishmentDescription,
      };
      addPunishment(newPunishment);
      setPunishmentName('');
      setPunishmentDescription('');
      setShowAddPunishment(false);
    }
  };

  return (
    <View style={theme.container}>
      <Text style={theme.title}>Punishments</Text>

      {!showAddPunishment && (
        <TouchableOpacity style={theme.button} onPress={() => setShowAddPunishment(true)}>
          <Text style={theme.buttonText}>+ Add Punishment</Text>
        </TouchableOpacity>
      )}

      {showAddPunishment && (
        <View style={theme.form}>
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
      )}

      <FlatList
        data={punishments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={theme.punishmentContainer}>
            <Text style={theme.item}>{item.name}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
    </View>
  );
}