import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Modal, TouchableWithoutFeedback, Platform } from 'react-native';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';
import { useHistory, HistoryType } from '../data/HistoryContext';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function RewardsTab() {
  const { rewards, addReward, removeReward, updateRewardCount, totalPoints, addPoints, subtractPoints } = useRewardsPunishments();
  const { addHistoryEntry } = useHistory();
  const [theme] = useAtom(themeAtom);
  const [rewardName, setRewardName] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [rewardPoints, setRewardPoints] = useState('0');
  const [showAddReward, setShowAddReward] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Create dynamic styles based on theme
  const dynamicStyles = useMemo(() => ({
    scrollView: {
      flex: 1,
      backgroundColor: theme.colors?.background || '#F3E8FF',
    },
    container: {
      flexGrow: 1,
      backgroundColor: theme.colors?.background || '#F3E8FF',
      padding: 16,
      paddingBottom: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors?.text || '#1A1A1A',
      marginBottom: 8,
    },
    totalPoints: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors?.primary || '#9B59B6',
      marginBottom: 16,
    },
    addButton: {
      backgroundColor: theme.colors?.primary || '#9B59B6',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 10,
    },
    addButtonText: {
      color: theme.colors?.textOnPrimary || '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    form: {
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      padding: 20,
      borderRadius: 12,
      minWidth: '85%',
      maxWidth: 400,
    },
    input: {
      backgroundColor: theme.colors?.inputBackground || '#FFFFFF',
      padding: 12,
      borderRadius: 8,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
      color: theme.colors?.inputText || '#1A1A1A',
      fontSize: 16,
    },
    confirmButton: {
      backgroundColor: theme.colors?.success || '#28A745',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 5,
    },
    confirmButtonText: {
      color: theme.colors?.successText || '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    cancelButton: {
      backgroundColor: theme.colors?.danger || '#DC3545',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginVertical: 5,
    },
    cancelButtonText: {
      color: theme.colors?.dangerText || '#FFFFFF',
      fontSize: 18,
      fontWeight: 'bold',
    },
    rewardCard: {
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      padding: 16,
      borderRadius: 12,
      marginVertical: 8,
      borderWidth: 1,
      borderColor: theme.colors?.border || '#DDDDDD',
    },
    rewardName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors?.text || '#1A1A1A',
    },
    rewardDescription: {
      fontSize: 14,
      color: theme.colors?.textSecondary || '#666666',
      marginTop: 4,
    },
    rewardPoints: {
      fontSize: 16,
      color: theme.colors?.primary || '#9B59B6',
      fontWeight: '600',
      marginTop: 8,
    },
    rewardQuantity: {
      fontSize: 14,
      color: theme.colors?.textSecondary || '#666666',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 12,
    },
    purchaseButton: {
      backgroundColor: theme.colors?.primary || '#9B59B6',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      flex: 1,
      marginRight: 4,
    },
    purchaseButtonText: {
      color: theme.colors?.textOnPrimary || '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    useButton: {
      backgroundColor: theme.colors?.info || '#17A2B8',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      flex: 1,
      marginHorizontal: 4,
    },
    useButtonText: {
      color: theme.colors?.infoText || '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    deleteButton: {
      backgroundColor: theme.colors?.danger || '#DC3545',
      padding: 10,
      borderRadius: 8,
      alignItems: 'center',
      flex: 1,
      marginLeft: 4,
    },
    deleteButtonText: {
      color: theme.colors?.dangerText || '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },
    noRewardsText: {
      color: theme.colors?.textMuted || '#999999',
      textAlign: 'center',
      marginVertical: 20,
      fontStyle: 'italic',
    },
    manualPoints: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
      gap: 16,
    },
    pointButton: {
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: theme.colors?.primary || '#9B59B6',
      minWidth: 100,
      alignItems: 'center',
    },
    pointButtonText: {
      color: theme.colors?.primary || '#9B59B6',
      fontSize: 16,
      fontWeight: '600',
    },
  }), [theme]);

  const handleAddReward = () => {
    const pointsValue = parseInt(rewardPoints, 10) || 0;
    if (rewardName && pointsValue >= 0) {
      const newReward = { name: rewardName, description: rewardDescription, points: pointsValue, quantity: 0 };
      addReward(newReward);
      addHistoryEntry(HistoryType.REWARD_CREATED, { name: rewardName, points: pointsValue });
      setRewardName('');
      setRewardDescription('');
      setRewardPoints('0');
      setShowAddReward(false);
      setHasChanges(false);
    } else {
      if (Platform.OS === 'web') {
        window.alert('Please fill out the reward name and ensure points are zero or greater.');
      } else {
        Alert.alert('Error', 'Please fill out the reward name and ensure points are zero or greater.');
      }
    }
  };

  const handlePurchaseReward = (reward) => {
    if (totalPoints >= reward.points) {
      subtractPoints(reward.points);
      updateRewardCount(reward.name, reward.quantity + 1);
      addHistoryEntry(HistoryType.REWARD_PURCHASED, { name: reward.name, points: -reward.points });
    } else {
      if (Platform.OS === 'web') {
        window.alert('Not enough points to purchase this reward.');
      } else {
        Alert.alert('Error', 'Not enough points to purchase this reward.');
      }
    }
  };

  const handleUseReward = (reward) => {
    // Check if user can use the reward
    const canUse = reward.points === 0 || reward.quantity > 0;
    
    if (!canUse) {
      if (Platform.OS === 'web') {
        window.alert('You do not have any of this reward to use. Purchase it first!');
      } else {
        Alert.alert('Error', 'You do not have any of this reward to use. Purchase it first!');
      }
      return;
    }

    // Handle confirmation based on platform
    if (Platform.OS === 'web') {
      if (window.confirm(`Use "${reward.name}"? This will mark the reward as used.`)) {
        if (reward.points > 0) {
          updateRewardCount(reward.name, reward.quantity - 1);
        }
        addHistoryEntry(HistoryType.REWARD_USED, { name: reward.name });
      }
    } else {
      Alert.alert(
        "Use Reward",
        `Are you sure you want to use "${reward.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Use",
            onPress: () => {
              if (reward.points > 0) {
                updateRewardCount(reward.name, reward.quantity - 1);
              }
              addHistoryEntry(HistoryType.REWARD_USED, { name: reward.name });
            },
            style: "destructive"
          }
        ]
      );
    }
  };

  const handleDeleteReward = (reward) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to delete this reward? You will need to remake it if deleted.")) {
        removeReward(reward.name);
        addHistoryEntry(HistoryType.REWARD_DELETED, { name: reward.name });
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
              addHistoryEntry(HistoryType.REWARD_DELETED, { name: reward.name });
            },
            style: "destructive"
          }
        ]
      );
    }
  };

  const handlePointChange = (amount) => {
    if (amount > 0) {
      addPoints(amount);
      addHistoryEntry(HistoryType.POINTS_ADDED, { points: amount });
    } else {
      subtractPoints(Math.abs(amount));
      addHistoryEntry(HistoryType.POINTS_SUBTRACTED, { points: amount });
    }
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
    <ScrollView style={dynamicStyles.scrollView} contentContainerStyle={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Rewards</Text>
      <Text style={dynamicStyles.totalPoints}>Total Points: {totalPoints}</Text>

      {!showAddReward && (
        <TouchableOpacity style={dynamicStyles.addButton} onPress={() => setShowAddReward(true)}>
          <Text style={dynamicStyles.addButtonText}>+ Add Reward</Text>
        </TouchableOpacity>
      )}

      <Modal visible={showAddReward} animationType="slide" transparent={true}>
        <TouchableWithoutFeedback onPress={handleCancelAddReward}>
          <View style={dynamicStyles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={dynamicStyles.form}>
                <Text style={[dynamicStyles.title, { fontSize: 20, marginBottom: 16 }]}>New Reward</Text>
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="Reward Name"
                  placeholderTextColor={theme.colors?.inputPlaceholder || '#999'}
                  value={rewardName}
                  onChangeText={(text) => { setRewardName(text); setHasChanges(true); }}
                />
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="Description (optional)"
                  placeholderTextColor={theme.colors?.inputPlaceholder || '#999'}
                  value={rewardDescription}
                  onChangeText={(text) => { setRewardDescription(text); setHasChanges(true); }}
                />
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="Point Cost"
                  placeholderTextColor={theme.colors?.inputPlaceholder || '#999'}
                  keyboardType="numeric"
                  value={rewardPoints}
                  onChangeText={(text) => { 
                    const numericText = text.replace(/[^0-9]/g, '');
                    setRewardPoints(numericText || '0'); // Default to '0' if empty
                    setHasChanges(true); 
                  }}
                />
                <TouchableOpacity style={dynamicStyles.confirmButton} onPress={handleAddReward}>
                  <Text style={dynamicStyles.confirmButtonText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity style={dynamicStyles.cancelButton} onPress={handleCancelAddReward}>
                  <Text style={dynamicStyles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {rewards.length > 0 ? (
        rewards.map((reward, index) => (
          <View key={index} style={dynamicStyles.rewardCard}>
            <Text style={dynamicStyles.rewardName}>{reward.name}</Text>
            {reward.description ? <Text style={dynamicStyles.rewardDescription}>{reward.description}</Text> : null}
            <Text style={dynamicStyles.rewardPoints}>{reward.points} Points</Text>
            {reward.points > 0 && <Text style={dynamicStyles.rewardQuantity}>Owned: {reward.quantity}</Text>}
            <View style={dynamicStyles.row}>
              {reward.points > 0 ? (
                <TouchableOpacity
                  style={dynamicStyles.purchaseButton}
                  onPress={() => handlePurchaseReward(reward)}
                >
                  <Text style={dynamicStyles.purchaseButtonText}>Purchase</Text>
                </TouchableOpacity>
              ) : null}
              <TouchableOpacity
                style={dynamicStyles.useButton}
                onPress={() => handleUseReward(reward)}
              >
                <Text style={dynamicStyles.useButtonText}>Use</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={dynamicStyles.deleteButton}
                onPress={() => handleDeleteReward(reward)}
              >
                <Text style={dynamicStyles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text style={dynamicStyles.noRewardsText}>No rewards available</Text>
      )}

      <View style={dynamicStyles.manualPoints}>
        <TouchableOpacity style={dynamicStyles.pointButton} onPress={() => handlePointChange(1)}>
          <Text style={dynamicStyles.pointButtonText}>+1 Point</Text>
        </TouchableOpacity>
        <TouchableOpacity style={dynamicStyles.pointButton} onPress={() => handlePointChange(-1)}>
          <Text style={dynamicStyles.pointButtonText}>-1 Point</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}