import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';

export default function SettingsScreen({ isDeveloperMode, setIsDeveloperMode }) {
  const [theme] = useAtom(themeAtom);

  return (
    <View style={theme.container}>
      <Text style={theme.title}>Settings</Text>
      
      <View style={styles.setting}>
        <Text style={styles.settingText}>Developer Mode</Text>
        <Switch
          value={isDeveloperMode}
          onValueChange={setIsDeveloperMode}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 5,
  },
  settingText: {
    fontSize: 16,
  },
});