import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAtom } from 'jotai';
import ColorPickerWheel from 'react-native-color-picker-wheel';
import { themeAtom } from '../atoms/themeAtom';
import { lavenderTheme, darkTheme, LatexTheme, babyBlueTheme, vampireTheme, fairyTheme, barbieTheme, forestTheme, generateCustomTheme } from '../styles/Themes';

export default function ThemesScreen() {
  const [theme, setTheme] = useAtom(themeAtom);
  const [customColor, setCustomColor] = useState('#FFFFFF');

  return (
    <View style={theme.container}>
      <Text style={theme.title}>Select Theme</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: lavenderTheme.button.backgroundColor }]} onPress={() => setTheme(lavenderTheme)}>
          <Text style={[styles.buttonText, { color: lavenderTheme.buttonText.color }]}>Lavender</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: darkTheme.button.backgroundColor }]} onPress={() => setTheme(darkTheme)}>
          <Text style={[styles.buttonText, { color: darkTheme.buttonText.color }]}>Dark</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: LatexTheme.button.backgroundColor }]} onPress={() => setTheme(LatexTheme)}>
          <Text style={[styles.buttonText, { color: LatexTheme.buttonText.color }]}>Latex</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: babyBlueTheme.button.backgroundColor }]} onPress={() => setTheme(babyBlueTheme)}>
          <Text style={[styles.buttonText, { color: babyBlueTheme.buttonText.color }]}>Baby Blue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: vampireTheme.button.backgroundColor }]} onPress={() => setTheme(vampireTheme)}>
          <Text style={[styles.buttonText, { color: vampireTheme.buttonText.color }]}>Vampire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: fairyTheme.button.backgroundColor }]} onPress={() => setTheme(fairyTheme)}>
          <Text style={[styles.buttonText, { color: fairyTheme.buttonText.color }]}>Fairy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: barbieTheme.button.backgroundColor }]} onPress={() => setTheme(barbieTheme)}>
          <Text style={[styles.buttonText, { color: barbieTheme.buttonText.color }]}>Barbie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: forestTheme.button.backgroundColor }]} onPress={() => setTheme(forestTheme)}>
          <Text style={[styles.buttonText, { color: forestTheme.buttonText.color }]}>Forest</Text>
        </TouchableOpacity>
      </View>
      <Text style={theme.title}>Custom Color Theme</Text>
      <ColorPickerWheel
        initialColor={customColor}
        onColorChangeComplete={(color) => {
          setCustomColor(color);
          setTheme(generateCustomTheme(color));
        }}
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  button: {
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '40%',
  },
  buttonText: {
    fontSize: 16,
  },
});