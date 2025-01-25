import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '../App';

export default function SettingsScreen() {
  const theme = useTheme();

  return (
    <View style={theme.container}>
      <Text style={theme.title}>Settings</Text>
      {/* Add Settings content here */}
    </View>
  );
}