import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useRewardsPunishments } from '../data/RewardsPunishmentsContext';
import { useTheme } from '../App';

export default function RewardsTab() {
  const { rewards, addReward } = useRewardsPunishments();
  const theme = useTheme();
  const [rewardName, setRewardName] = useState('');
  const [rewardDescription, setRewardDescription] = useState('');
  const [rewardPoints, setRewardPoints] = useState(0);
  const [showAddReward, setShowAddReward] = useState(false);
  const [totalPoints, setTotalPoints] = useState(0);

  const handleAddReward = () => {
    if (rewardName && rewardDescription && rewardPoints > 0) {
      const newReward = { name: rewardName, description: rewardDescription, points: rewardPoints };
      addReward(newReward);
      setRewardName('');
      setRewardDescription('');
      setRewardPoints(0);
      setShowAddReward(false);
    }
  };

  const handlePurchaseReward = (reward) => {
    if (totalPoints >= reward.points) {
      setTotalPoints(totalPoints - reward.points);
      // Logic to remove reward from list or mark as purchased
    } else {
      alert('Not enough points to purchase this reward.');
    }
  };

  const handlePointChange = (amount) => {
    setTotalPoints(totalPoints + amount);
  };

  return (
    <ScrollView contentContainerStyle={theme.container}>
      <Text style={theme.title}>Rewards</Text>
      <Text>Total Points: {totalPoints}</Text>

      {!showAddReward && (
        <TouchableOpacity style={theme.button} onPress={() => setShowAddReward(true)}>
          <Text style={theme.buttonText}>+ Add Reward</Text>
        </TouchableOpacity>
      )}

      {showAddReward && (
        <View style={theme.form}>
          <TextInput
            style={theme.input}
            placeholder="Reward Name"
            value={rewardName}
            onChangeText={setRewardName}
          />
          <TextInput
            style={theme.input}
            placeholder="Description"
            value={rewardDescription}
            onChangeText={setRewardDescription}
          />
          <TextInput
            style={theme.input}
            placeholder="Point Cost"
            keyboardType="numeric"
            value={String(rewardPoints)}
            onChangeText={(text) => setRewardPoints(Number(text))}
          />
          <TouchableOpacity style={theme.button} onPress={handleAddReward}>
            <Text style={theme.buttonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      )}

      {rewards.length > 0 ? (
        rewards.map((reward, index) => (
          <View key={index} style={theme.rewardContainer}>
            <Text style={theme.rewardName}>{reward.name}</Text>
            <Text>{reward.description}</Text>
            <Text>{reward.points} Points</Text>
            <TouchableOpacity
              style={theme.purchaseButton}
              onPress={() => handlePurchaseReward(reward)}
            >
              <Text style={theme.buttonText}>Purchase</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text>No rewards available</Text>
      )}

      <View style={theme.manualPoints}>
        <TouchableOpacity style={theme.button} onPress={() => handlePointChange(1)}>
          <Text style={theme.buttonText}>+1 Point</Text>
        </TouchableOpacity>
        <TouchableOpacity style={theme.button} onPress={() => handlePointChange(-1)}>
          <Text style={theme.buttonText}>-1 Point</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}