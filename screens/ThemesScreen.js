import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAtom } from 'jotai';
import { themeAtom } from '../atoms/themeAtom';
import { themes, createCustomTheme } from '../styles/ThemeSystem';

// Static theme list to avoid recreating on each render
const themeList = Object.entries(themes);
const themeNames = themeList.map(([_, t]) => t.name);

// Simple color palette for custom theme - avoids problematic ColorPickerWheel
const colorPalette = [
  '#9B59B6', '#E91E63', '#F44336', '#FF5722', '#FF9800',
  '#FFC107', '#FFEB3B', '#8BC34A', '#4CAF50', '#009688',
  '#00BCD4', '#03A9F4', '#2196F3', '#3F51B5', '#673AB7',
];

export default function ThemesScreen() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [customColor, setCustomColor] = useState('#9B59B6');
  const [customDarkMode, setCustomDarkMode] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  
  // Derive isCustomMode from whether current theme matches any preset
  const isCustomMode = useMemo(() => {
    return !themeNames.includes(theme.name);
  }, [theme.name]);

  const handleSelectTheme = (themeOption) => {
    setShowCustomPicker(false);
    setTheme(themeOption);
  };

  const handleActivateCustom = () => {
    setShowCustomPicker(true);
    setTheme(createCustomTheme(customColor, customDarkMode));
  };

  const handleCustomColorSelect = (color) => {
    setCustomColor(color);
    setTheme(createCustomTheme(color, customDarkMode));
  };

  const handleDarkModeToggle = (value) => {
    setCustomDarkMode(value);
    if (showCustomPicker || isCustomMode) {
      setTheme(createCustomTheme(customColor, value));
    }
  };

  // Helper for theme button border styling
  const getThemeBorderStyle = (themeOption) => ({
    borderWidth: theme.name === themeOption.name ? 3 : 0,
    borderColor: theme.colors?.text || '#000',
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors?.background || theme.container?.backgroundColor || '#F3E8FF' }]}>
      <Text style={[styles.title, { color: theme.colors?.text || theme.title?.color || '#1A1A1A' }]}>Select Theme</Text>
      
      <View style={styles.buttonContainer}>
        {themeList.map(([key, themeOption]) => (
          <TouchableOpacity 
            key={key}
            style={[
              styles.themeButton, 
              { backgroundColor: themeOption.colors.primary },
              getThemeBorderStyle(themeOption),
            ]} 
            onPress={() => handleSelectTheme(themeOption)}
          >
            <View style={styles.themeButtonContent}>
              <Ionicons 
                name={themeOption.icon || 'color-palette'} 
                size={20} 
                color={themeOption.colors.textOnPrimary} 
                style={styles.themeIcon}
              />
              <Text style={[styles.buttonText, { color: themeOption.colors.textOnPrimary }]}>
                {themeOption.name}
              </Text>
            </View>
            {themeOption.isDark && (
              <Text style={[styles.darkLabel, { color: themeOption.colors.textOnPrimary }]}>🌙</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.section, { 
        backgroundColor: theme.colors?.surface || theme.entryContainer?.backgroundColor || '#FFF',
        borderWidth: (isCustomMode || showCustomPicker) ? 3 : 0,
        borderColor: theme.colors?.primary || '#9B59B6',
      }]}>
        <TouchableOpacity onPress={handleActivateCustom}>
          <Text style={[styles.sectionTitle, { color: theme.colors?.text || theme.title?.color || '#1A1A1A' }]}>
            Custom Theme {(isCustomMode || showCustomPicker) ? '✓' : '(tap to expand)'}
          </Text>
        </TouchableOpacity>
        
        {(showCustomPicker || isCustomMode) && (
          <>
            <View style={styles.darkModeRow}>
              <Text style={{ color: theme.colors?.text || theme.title?.color || '#1A1A1A' }}>Dark Mode</Text>
              <Switch 
                value={customDarkMode} 
                onValueChange={handleDarkModeToggle}
              />
            </View>
            
            <Text style={[styles.colorLabel, { color: theme.colors?.text || '#1A1A1A' }]}>Select Color:</Text>
            <View style={styles.colorPaletteContainer}>
              {colorPalette.map((color) => (
                <TouchableOpacity
                  key={color}
                  style={[
                    styles.colorSwatch,
                    { backgroundColor: color },
                    customColor === color && styles.selectedSwatch,
                  ]}
                  onPress={() => handleCustomColorSelect(color)}
                />
              ))}
            </View>
          </>
        )}
      </View>

      <View style={styles.previewSection}>
        <Text style={[styles.sectionTitle, { color: theme.colors?.text || theme.title?.color || '#1A1A1A' }]}>
          Preview
        </Text>
        <View style={[styles.previewCard, { backgroundColor: theme.colors?.surface || theme.entryContainer?.backgroundColor || '#FFF' }]}>
          <Text style={{ color: theme.colors?.text || theme.title?.color, marginBottom: 8 }}>Text on surface</Text>
          <TouchableOpacity style={[styles.previewButton, { backgroundColor: theme.colors?.primary || theme.button?.backgroundColor }]}>
            <Text style={{ color: theme.colors?.textOnPrimary || theme.buttonText?.color }}>Primary Button</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.previewButton, { backgroundColor: theme.colors?.success || theme.incrementButtonBackground }]}>
            <Text style={{ color: theme.colors?.successText || '#FFFFFF' }}>Success Button</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.previewButton, { backgroundColor: theme.colors?.danger || theme.deleteButtonBackground }]}>
            <Text style={{ color: theme.colors?.dangerText || '#FFFFFF' }}>Danger Button</Text>
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
  themeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeIcon: {
    marginRight: 8,
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
  colorLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  colorPaletteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  colorSwatch: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 6,
  },
  selectedSwatch: {
    borderWidth: 3,
    borderColor: '#000',
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