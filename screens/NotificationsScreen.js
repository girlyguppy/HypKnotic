import React from 'react';
import { View, Text } from 'react-native';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function NotificationsScreen() {
  const [theme] = useAtom(themeAtom);

  return (
    <View style={theme.container}>
      <Text style={theme.title}>Notifications</Text>
      {/* Add Notifications content here */}
    </View>
  );
}