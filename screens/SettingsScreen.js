import React from 'react';
import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function SettingsScreen({ isDeveloperMode, setIsDeveloperMode }) {
  const [theme] = useAtom(themeAtom);

  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: theme.colors?.background || '#F3E8FF',
      padding: 16,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors?.text || '#1A1A1A',
      marginBottom: 20,
    },
    settingCard: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: theme.colors?.surface || '#FFFFFF',
      borderRadius: 12,
      marginVertical: 8,
    },
    settingText: {
      fontSize: 16,
      color: theme.colors?.text || '#1A1A1A',
    },
    settingDescription: {
      fontSize: 12,
      color: theme.colors?.textSecondary || '#666666',
      marginTop: 4,
    },
  };

  return (
    <ScrollView style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Settings</Text>
      
      <View style={dynamicStyles.settingCard}>
        <View style={{ flex: 1 }}>
          <Text style={dynamicStyles.settingText}>Developer Mode</Text>
          <Text style={dynamicStyles.settingDescription}>
            Show developer tools for testing and debugging
          </Text>
        </View>
        <Switch
          value={isDeveloperMode}
          onValueChange={setIsDeveloperMode}
          trackColor={{ 
            false: theme.colors?.border || '#DDDDDD', 
            true: theme.colors?.primary || '#9B59B6' 
          }}
          thumbColor={isDeveloperMode ? '#FFFFFF' : '#F4F4F4'}
        />
      </View>
    </ScrollView>
  );
}