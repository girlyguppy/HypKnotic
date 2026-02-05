import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { useAtom } from 'jotai';
import ColorPickerWheel from 'react-native-color-picker-wheel';
import { themeAtom } from '../atoms/themeAtom';
import { themes, createCustomTheme } from '../styles/ThemeSystem';

export default function ThemesScreen() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [customColor, setCustomColor] = useState('#9B59B6');
  const [customDarkMode, setCustomDarkMode] = useState(false);

  const themeList = Object.entries(themes);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors?.background || '#F3E8FF' }]}>
      <Text style={[styles.title, { color: theme.colors?.text || '#1A1A1A' }]}>Select Theme</Text>
      
      <View style={styles.buttonContainer}>
        {themeList.map(([key, themeOption]) => (
          <TouchableOpacity 
            key={key}
            style={[
              styles.themeButton, 
              { 
                backgroundColor: themeOption.colors.primary,
                borderWidth: theme.name === themeOption.name ? 3 : 0,
                borderColor: theme.colors?.text || '#000',
              }
            ]} 
            onPress={() => setTheme(themeOption)}
          >
            <Text style={[styles.buttonText, { color: themeOption.colors.textOnPrimary }]}>
              {themeOption.name}
            </Text>
            {themeOption.isDark && (
              <Text style={[styles.darkLabel, { color: themeOption.colors.textOnPrimary }]}>🌙</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.section, { backgroundColor: theme.colors?.surface || '#FFF' }]}>
        <Text style={[styles.sectionTitle, { color: theme.colors?.text || '#1A1A1A' }]}>
          Custom Theme
        </Text>
        
        <View style={styles.darkModeRow}>
          <Text style={{ color: theme.colors?.text || '#1A1A1A' }}>Dark Mode</Text>
          <Switch 
            value={customDarkMode} 
            onValueChange={(value) => {
              setCustomDarkMode(value);
              setTheme(createCustomTheme(customColor, value));
            }}
          />
        </View>
        
        <ColorPickerWheel
          initialColor={customColor}
          onColorChangeComplete={(color) => {
            setCustomColor(color);
            setTheme(createCustomTheme(color, customDarkMode));
          }}
          style={styles.colorPicker}
        />
      </View>

      <View style={styles.previewSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors?.text || '#1A1A1A' }]}>
          Preview
        </Text>
        <View style={[styles.previewCard, { backgroundColor: theme.colors?.surface || '#FFF' }]}>
          <Text style={{ color: theme.colors?.text, marginBottom: 8 }}>Text on surface</Text>
          <TouchableOpacity style={[styles.previewButton, { backgroundColor: theme.colors?.primary }]}>
            <Text style={{ color: theme.colors?.textOnPrimary }}>Primary Button</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.previewButton, { backgroundColor: theme.colors?.success }]}>
            <Text style={{ color: theme.colors?.successText }}>Success Button</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.previewButton, { backgroundColor: theme.colors?.danger }]}>
            <Text style={{ color: theme.colors?.dangerText }}>Danger Button</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 50 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  themeButton: {
    padding: 12,
    margin: 4,
    borderRadius: 8,
    alignItems: 'center',
    width: '47%',
    minHeight: 50,
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  darkLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  darkModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  colorPicker: {
    height: 200,
  },
  previewSection: {
    marginTop: 8,
  },
  previewCard: {
    borderRadius: 12,
    padding: 16,
  },
  previewButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
});