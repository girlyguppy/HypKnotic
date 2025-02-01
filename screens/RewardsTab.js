import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function RewardsTab() {
  const { rewards, addReward, removeReward, updateRewardCount } = useRewardsPunishments();
  const [theme] = useAtom(themeAtom);
  const [rewardName, setRewardName] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [rewardPoints, setRewardPoints] = useState(0);
  const [showAddReward, setShowAddReward] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);
  const [hasChanges, setHasChanges] = useState(false);

  const handleAddReward = () => {
    if (rewardName && rewardPoints >= 0) {
      const newReward = { name: rewardName, description: rewardDescription, points: rewardPoints, quantity: 0 };
      addReward(newReward);
      setRewardName('');
      setRewardDescription('');
      setRewardPoints(0);
      setShowAddReward(false);
      setHasChanges(false);
    } else {
      Alert.alert('Error', 'Please fill out the reward name and ensure points are zero or greater.');
    }
  };

  const handlePurchaseReward = (reward) => {
    if (totalPoints >= reward.points) {
      setTotalPoints(totalPoints - reward.points);
      updateRewardCount(reward.name, reward.quantity + 1);
    } else {
      if (Platform.OS === 'web') {
        window.alert('Not enough points to purchase this reward.');
      } else {
        Alert.alert('Error', 'Not enough points to purchase this reward.');
      }
    }
  };

  const handleUseReward = (reward) => {
    if (reward.points === 0 || reward.quantity > 0) {
      Alert.alert(
        "Use Reward",
        "Are you sure you want to use this reward?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Use",
            onPress: () => {
              if (reward.points > 0) {
                updateRewardCount(reward.name, reward.quantity - 1);
              }
            },
            style: "destructive"
          }
        ]
      );
    } else {
      if (Platform.OS === 'web') {
        window.alert('You do not have any of this reward to use.');
      } else {
        Alert.alert('Error', 'You do not have any of this reward to use.');
      }
    }
  };

  const handleDeleteReward = (reward) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this reward? You will need to remake it if deleted.")) {
        removeReward(reward.name);
      }
    } else {
      Alert.alert(
        "Delete Reward",
        "Are you sure you want to delete this reward? You will need to remake it if deleted.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: () => {
              removeReward(reward.name);
            },
            style: "destructive"
          }
        ]
      );
    }
  };

  const handlePointChange = (amount) => {
    setTotalPoints(totalPoints + amount);
  };

  const handleCancelAddReward = () => {
    if (hasChanges) {
      if (Platform.OS === 'web') {
        if (window.confirm("You have unsaved changes. Are you sure you want to discard them?")) {
          setShowAddReward(false);
          setHasChanges(false);
        }
      } else {
        Alert.alert(
          "Discard changes?",
          "You have unsaved changes. Are you sure you want to discard them?",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Discard", onPress: () => { setShowAddReward(false); setHasChanges(false); }, style: "destructive" }
          ]
        );
      }
    } else {
      setShowAddReward(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={theme.container}>
      <Text style={theme.title}>Rewards</Text>
      <Text style={styles.totalPoints}>Total Points: {totalPoints}</Text>

      {!showAddReward && (
        <TouchableOpacity style={styles.addButton} onPress={() => setShowAddReward(true)}>
          <Text style={styles.addButtonText}>+ Add Reward</Text>
        </TouchableOpacity>
      )}

      <Modal visible={showAddReward} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={handleCancelAddReward}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.form}>
                <TextInput
                  style={styles.input}
                  placeholder="Reward Name"
                  value={rewardName}
                  onChangeText={(text) => { setRewardName(text); setHasChanges(true); }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Description"
                  value={rewardDescription}
                  onChangeText={(text) => { setRewardDescription(text); setHasChanges(true); }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Point Cost"
                  keyboardType="numeric"
                  value={String(rewardPoints)}
                  onChangeText={(text) => { setRewardPoints(Number(text)); setHasChanges(true); }}
                />
                <TouchableOpacity style={styles.confirmButton} onPress={handleAddReward}>
                  <Text style={styles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancelAddReward}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {rewards.length > 0 ? (
        rewards.map((reward, index) => (
          <View key={index} style={styles.rewardContainer}>
            <Text style={styles.rewardName}>{reward.name}</Text>
            {reward.description ? <Text>{reward.description}</Text> : null}
            <Text>{reward.points} Points</Text>
            {reward.points > 0 && <Text>Quantity Owned: {reward.quantity}</Text>}
            <View style={styles.row}>
              {reward.points > 0 ? (
                <TouchableOpacity
                  style={styles.purchaseButton}
                  onPress={() => handlePurchaseReward(reward)}
                >
                  <Text style={styles.purchaseButtonText}>Purchase</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={styles.useButton}
                onPress={() => handleUseReward(reward)}
              >
                <Text style={styles.useButtonText}>Use</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteReward(reward)}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noRewardsText}>No rewards available</Text>
      )}

      <View style={styles.manualPoints}>
        <TouchableOpacity style={styles.pointButton} onPress={() => handlePointChange(1)}>
          <Text style={styles.pointButtonText}>+1 Point</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.pointButton} onPress={() => handlePointChange(-1)}>
          <Text style={styles.pointButtonText}>-1 Point</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  totalPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
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
  form: {
    backgroundColor: '#F0F0F0',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    minWidth: '80%', // Added to prevent the modal from getting too narrow
    alignSelf: 'center', // Ensures it stays centered horizontally
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
  rewardContainer: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  rewardName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  purchaseButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginRight: 5,
  },
  purchaseButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  useButton: {
    backgroundColor: '#28A745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginLeft: 5,
  },
  useButtonText: {
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
  noRewardsText: {
    fontSize: 16,
    color: '#888888',
    textAlign: 'center',
    marginVertical: 20,
  },
  manualPoints: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  pointButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});