import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../App';

export default function ProfileScreen() {
  const theme = useTheme();

  return (
    <View style={theme.container}>
      <Text style={theme.title}>Profile</Text>
      {/* Add Profile content here */}
    </View>
  );
}