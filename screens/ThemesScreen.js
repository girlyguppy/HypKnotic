import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../App';
import ColorPickerWheel from 'react-native-color-picker-wheel';
import { lavenderTheme, darkTheme, LatexTheme, babyBlueTheme, vampireTheme, fairyTheme, barbieTheme, forestTheme, generateCustomTheme } from '../styles/Themes';

export default function ThemesScreen({ toggleTheme }) {
  const theme = useTheme();
  const [customColor, setCustomColor] = useState('#FFFFFF');

  return (
    <View style={theme.container}>
      <Text style={theme.title}>Select Theme</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: lavenderTheme.button.backgroundColor }]} onPress={() => toggleTheme(lavenderTheme)}>
          <Text style={[styles.buttonText, { color: lavenderTheme.buttonText.color }]}>Lavender</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: darkTheme.button.backgroundColor }]} onPress={() => toggleTheme(darkTheme)}>
          <Text style={[styles.buttonText, { color: darkTheme.buttonText.color }]}>Dark</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: LatexTheme.button.backgroundColor }]} onPress={() => toggleTheme(LatexTheme)}>
          <Text style={[styles.buttonText, { color: LatexTheme.buttonText.color }]}>Latex</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: babyBlueTheme.button.backgroundColor }]} onPress={() => toggleTheme(babyBlueTheme)}>
          <Text style={[styles.buttonText, { color: babyBlueTheme.buttonText.color }]}>Baby Blue</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: vampireTheme.button.backgroundColor }]} onPress={() => toggleTheme(vampireTheme)}>
          <Text style={[styles.buttonText, { color: vampireTheme.buttonText.color }]}>Vampire</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: fairyTheme.button.backgroundColor }]} onPress={() => toggleTheme(fairyTheme)}>
          <Text style={[styles.buttonText, { color: fairyTheme.buttonText.color }]}>Fairy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: barbieTheme.button.backgroundColor }]} onPress={() => toggleTheme(barbieTheme)}>
          <Text style={[styles.buttonText, { color: barbieTheme.buttonText.color }]}>Barbie</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: forestTheme.button.backgroundColor }]} onPress={() => toggleTheme(forestTheme)}>
          <Text style={[styles.buttonText, { color: forestTheme.buttonText.color }]}>Forest</Text>
        </TouchableOpacity>
      </View>
      <Text style={theme.title}>Custom Color Theme</Text>
      <ColorPickerWheel
        initialColor={customColor}
        onColorChangeComplete={(color) => {
          setCustomColor(color);
          toggleTheme(generateCustomTheme(color));
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