import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../App';

export default function NotificationsScreen() {
  const theme = useTheme();

  return (
    <View style={theme.container}>
      <Text style={theme.title}>Notifications</Text>
      {/* Add Notifications content here */}
    </View>
  );
}