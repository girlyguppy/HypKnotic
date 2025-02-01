import { StyleSheet } from 'react-native';
import commonStyles from './CommonStyles';

// Lavender Theme
export const lavenderTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#E6E6FA', // Lavender
  },
  title: {
    ...commonStyles.title,
    color: '#4B0082', // Indigo Text
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#D8BFD8', // Thistle
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#4B0082',
  },
  drawer: {
    backgroundColor: '#E6E6FA',
    textColor: '#4B0082',
  },
  activeTabButton: {
    backgroundColor: '#D8BFD8',
  },
  tabButton: {
    backgroundColor: '#E6E6FA',
  },
  // Punishment-related properties
  punishmentBackground: '#F3E5F5',
  incrementButtonBackground: '#32CD32',
  incrementButtonTextColor: '#4B0082',
  decrementButtonBackground: '#FFD700',
  decrementButtonTextColor: '#4B0082',
  completeButtonBackground: '#00CED1',
  completeButtonTextColor: '#4B0082',
  deleteButtonBackground: '#FF4500',
  deleteButtonTextColor: '#FFFFFF',
  placeholderTextColor: '#4B0082',
});

// Dark Theme
export const darkTheme = StyleSheet.create({
	...commonStyles,
	container: {
	  ...commonStyles.container,
	  backgroundColor: '#2C2C2C', // Dark Gray
	},
	title: {
	  ...commonStyles.title,
	  color: '#FFFFFF', // White Text
	},
	button: {
	  ...commonStyles.button,
	  backgroundColor: '#3C3C3C', // Darker Gray
	},
	buttonText: {
	  ...commonStyles.buttonText,
	  color: '#FFFFFF',
	},
	drawer: {
	  backgroundColor: '#2C2C2C',
	  textColor: '#FFFFFF',
	},
	activeTabButton: {
	  backgroundColor: '#3C3C3C',
	},
	tabButton: {
	  backgroundColor: '#2C2C2C',
	},
	// Punishment-related properties
	punishmentBackground: '#3C3C3C',
	incrementButtonBackground: '#28a745',
	incrementButtonTextColor: '#FFFFFF',
	decrementButtonBackground: '#ffc107',
	decrementButtonTextColor: '#FFFFFF',
	completeButtonBackground: '#17a2b8',
	completeButtonTextColor: '#FFFFFF',
	deleteButtonBackground: '#dc3545',
	deleteButtonTextColor: '#FFFFFF',
	placeholderTextColor: '#FFFFFF',
  });

// Latex Theme
export const LatexTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#000000', // AMOLED Black
  },
  title: {
    ...commonStyles.title,
    color: '#FFFFFF', // White Text
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#1C1C1C', // Dark Gray
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#FFFFFF',
  },
  drawer: {
    backgroundColor: '#000000',
    textColor: '#FFFFFF',
  },
  activeTabButton: {
    backgroundColor: '#1C1C1C',
  },
  tabButton: {
    backgroundColor: '#000000',
  },
  // Punishment-related properties
  punishmentBackground: '#2C2C2C',
  incrementButtonBackground: '#28a745',
  incrementButtonTextColor: '#FFFFFF',
  decrementButtonBackground: '#ffc107',
  decrementButtonTextColor: '#FFFFFF',
  completeButtonBackground: '#17a2b8',
  completeButtonTextColor: '#FFFFFF',
  deleteButtonBackground: '#dc3545',
  deleteButtonTextColor: '#FFFFFF',
  placeholderTextColor: '#FFFFFF',
});

// Baby Blue Theme
export const babyBlueTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#ADD8E6', // Light Blue
  },
  title: {
    ...commonStyles.title,
    color: '#00008B', // Dark Blue
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#B0E0E6', // Powder Blue
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#00008B',
  },
  drawer: {
    backgroundColor: '#ADD8E6',
    textColor: '#00008B',
  },
  activeTabButton: {
    backgroundColor: '#B0E0E6',
  },
  tabButton: {
    backgroundColor: '#ADD8E6',
  },
  // Punishment-related properties
  punishmentBackground: '#E0FFFF',
  incrementButtonBackground: '#32CD32',
  incrementButtonTextColor: '#00008B',
  decrementButtonBackground: '#FFD700',
  decrementButtonTextColor: '#00008B',
  completeButtonBackground: '#00CED1',
  completeButtonTextColor: '#00008B',
  deleteButtonBackground: '#FF4500',
  deleteButtonTextColor: '#FFFFFF',
  placeholderTextColor: '#00008B',
});

// Vampire Theme
export const vampireTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#2B2B2B', // Darker background
  },
  title: {
    ...commonStyles.title,
    color: '#B22222', // FireBrick
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#4B0082', // Indigo
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#B22222',
  },
  drawer: {
    backgroundColor: '#2B2B2B',
    textColor: '#B22222',
  },
  activeTabButton: {
    backgroundColor: '#4B0082',
  },
  tabButton: {
    backgroundColor: '#2B2B2B',
  },
  // Punishment-related properties
  punishmentBackground: '#3A3A3A',
  incrementButtonBackground: '#228B22',
  incrementButtonTextColor: '#B22222',
  decrementButtonBackground: '#DAA520',
  decrementButtonTextColor: '#B22222',
  completeButtonBackground: '#1E90FF',
  completeButtonTextColor: '#B22222',
  deleteButtonBackground: '#8B0000',
  deleteButtonTextColor: '#FFFFFF',
  placeholderTextColor: '#B22222',
});

// Fairy Theme
export const fairyTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#F8F8FF', // GhostWhite
  },
  title: {
    ...commonStyles.title,
    color: '#4B0082',
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#D8BFD8', // Thistle
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#4B0082',
  },
  drawer: {
    backgroundColor: '#F8F8FF',
    textColor: '#4B0082',
  },
  activeTabButton: {
    backgroundColor: '#D8BFD8',
  },
  tabButton: {
    backgroundColor: '#F8F8FF',
  },
  // Punishment-related properties
  punishmentBackground: '#F0E6F6',
  incrementButtonBackground: '#32CD32',
  incrementButtonTextColor: '#4B0082',
  decrementButtonBackground: '#FFD700',
  decrementButtonTextColor: '#4B0082',
  completeButtonBackground: '#00CED1',
  completeButtonTextColor: '#4B0082',
  deleteButtonBackground: '#FF4500',
  deleteButtonTextColor: '#FFFFFF',
  placeholderTextColor: '#4B0082',
});

// Barbie Theme
export const barbieTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#FF69B4', // Hot Pink
  },
  title: {
    ...commonStyles.title,
    color: '#FF1493', // Deep Pink
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#FFB6C1', // Light Pink
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#FF1493',
  },
  drawer: {
    backgroundColor: '#FF69B4',
    textColor: '#FF1493',
  },
  activeTabButton: {
    backgroundColor: '#FFB6C1',
  },
  tabButton: {
    backgroundColor: '#FF69B4',
  },
  // Punishment-related properties
  punishmentBackground: '#FFE4E1',
  incrementButtonBackground: '#32CD32',
  incrementButtonTextColor: '#FF1493',
  decrementButtonBackground: '#FFD700',
  decrementButtonTextColor: '#FF1493',
  completeButtonBackground: '#00CED1',
  completeButtonTextColor: '#FF1493',
  deleteButtonBackground: '#FF4500',
  deleteButtonTextColor: '#FFFFFF',
  placeholderTextColor: '#FF1493',
});

// Forest Theme
export const forestTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#228B22', // ForestGreen
  },
  title: {
    ...commonStyles.title,
    color: '#F0FFF0', // HoneyDew
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#32CD32', // LimeGreen
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#F0FFF0',
  },
  drawer: {
    backgroundColor: '#228B22',
    textColor: '#F0FFF0',
  },
  activeTabButton: {
    backgroundColor: '#32CD32',
  },
  tabButton: {
    backgroundColor: '#228B22',
  },
  // Punishment-related properties
  punishmentBackground: '#2E8B57',
  incrementButtonBackground: '#32CD32',
  incrementButtonTextColor: '#F0FFF0',
  decrementButtonBackground: '#FFD700',
  decrementButtonTextColor: '#F0FFF0',
  completeButtonBackground: '#00CED1',
  completeButtonTextColor: '#F0FFF0',
  deleteButtonBackground: '#FF4500',
  deleteButtonTextColor: '#FFFFFF',
  placeholderTextColor: '#F0FFF0',
});

export const generateCustomTheme = (color) => {
  const isDark = (color) => {
    const c = color.substring(1); // strip #
    const rgb = parseInt(c, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = rgb & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128;
  };

  const textColor = isDark(color) ? '#FFFFFF' : '#000000';
  const buttonColor = isDark(color) ? '#444444' : '#DDDDDD';

  return StyleSheet.create({
    ...commonStyles,
    container: {
      ...commonStyles.container,
      backgroundColor: color,
    },
    title: {
      ...commonStyles.title,
      color: textColor,
    },
    input: {
      ...commonStyles.input,
      backgroundColor: buttonColor,
      color: textColor,
    },
    button: {
      ...commonStyles.button,
      backgroundColor: buttonColor,
    },
    buttonText: {
      ...commonStyles.buttonText,
      color: textColor,
    },
    entryContainer: {
      ...commonStyles.entryContainer,
      backgroundColor: color,
    },
    header: {
      backgroundColor: color,
      textColor: textColor,
      iconColor: textColor,
    },
    drawer: {
      backgroundColor: color,
      textColor: textColor,
    },
    tabButton: {
      backgroundColor: buttonColor,
    },
    activeTabButton: {
      backgroundColor: buttonColor,
    },
    tabButtonText: {
      color: textColor,
    },
    // Punishment-related properties
    punishmentBackground: color,
    incrementButtonBackground: buttonColor,
    incrementButtonTextColor: textColor,
    decrementButtonBackground: buttonColor,
    decrementButtonTextColor: textColor,
    completeButtonBackground: buttonColor,
    completeButtonTextColor: textColor,
    deleteButtonBackground: buttonColor,
    deleteButtonTextColor: textColor,
    placeholderTextColor: textColor,
  });
};
