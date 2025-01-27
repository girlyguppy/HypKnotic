import { StyleSheet } from 'react-native';

const commonStyles = {
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  entryContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 10,
  },
  item: {
    color: 'inherit', // Ensure text color inherits from parent
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tabButton: {
    padding: 10,
    borderRadius: 5, // Changed from 20 to 5 for more rectangular appearance
    backgroundColor: '#DDDDDD',
  },
  activeTabButton: {
    backgroundColor: '#007BFF',
  },
  tabButtonText: {
    color: '#FFFFFF',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
};

export const lavenderTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#DEC6FF', // Pale Lavender
  },
  title: {
    ...commonStyles.title,
    color: '#4B0082', // Indigo
  },
  input: {
    ...commonStyles.input,
    backgroundColor: '#E6E6FA', // Lavender
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#D8BFD8', // Thistle
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#4B0082', // Indigo
  },
  entryContainer: {
    ...commonStyles.entryContainer,
    backgroundColor: '#DEC6FF', // Pale Lavender
  },
  header: {
    backgroundColor: '#DEC6FF', // Pale Lavender
    textColor: '#4B0082', // Indigo
    iconColor: '#4B0082', // Indigo
  },
  drawer: {
    backgroundColor: '#DEC6FF', // Pale Lavender
    textColor: '#4B0082', // Indigo
  },
  tabButton: {
    ...commonStyles.tabButton,
    backgroundColor: '#D8BFD8', // Thistle
  },
  activeTabButton: {
    backgroundColor: '#C71585', // Medium Violet Red
  },
  tabButtonText: {
    color: '#4B0082', // Indigo
  },
  addButton: {
    ...commonStyles.addButton,
    backgroundColor: '#D8BFD8', // Thistle
  },
  addButtonText: {
    ...commonStyles.addButtonText,
    color: '#4B0082', // Indigo
  },
});

export const darkTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#333', // Dark Charcoal
  },
  title: {
    ...commonStyles.title,
    color: '#fff', // White
  },
  input: {
    ...commonStyles.input,
    backgroundColor: '#555', // Dark Gray
    color: '#fff', // White
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#444', // Charcoal
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#fff', // White
  },
  entryContainer: {
    ...commonStyles.entryContainer,
    backgroundColor: '#444', // Charcoal
  },
  header: {
    backgroundColor: '#444', // Charcoal
    textColor: '#fff', // White
    iconColor: '#fff', // White
  },
  drawer: {
    backgroundColor: '#333', // Dark Charcoal
    textColor: '#fff', // White
  },
  tabButton: {
    ...commonStyles.tabButton,
    backgroundColor: '#444', // Charcoal
  },
  activeTabButton: {
    backgroundColor: '#555', // Dark Gray
  },
  tabButtonText: {
    color: '#fff', // White
  },
  addButton: {
    ...commonStyles.addButton,
    backgroundColor: '#444', // Charcoal
  },
  addButtonText: {
    ...commonStyles.addButtonText,
    color: '#fff', // White
  },
});

export const LatexTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#000000', // Black
  },
  title: {
    ...commonStyles.title,
    color: '#FFFFFF', // White
  },
  input: {
    ...commonStyles.input,
    backgroundColor: '#1C1C1C', // Very Dark Gray
    color: '#FFFFFF', // White
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#1C1C1C', // Very Dark Gray
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#FFFFFF', // White
  },
  entryContainer: {
    ...commonStyles.entryContainer,
    backgroundColor: '#1C1C1C', // Very Dark Gray
  },
  header: {
    backgroundColor: '#000000', // Black
    textColor: '#FFFFFF', // White
    iconColor: '#FFFFFF', // White
  },
  drawer: {
    backgroundColor: '#000000', // Black
    textColor: '#FFFFFF', // White
  },
  tabButton: {
    ...commonStyles.tabButton,
    backgroundColor: '#1C1C1C', // Very Dark Gray
  },
  activeTabButton: {
    backgroundColor: '#333333', // Dark Charcoal
  },
  tabButtonText: {
    color: '#FFFFFF', // White
  },
  addButton: {
    ...commonStyles.addButton,
    backgroundColor: '#1C1C1C', // Very Dark Gray
  },
  addButtonText: {
    ...commonStyles.addButtonText,
    color: '#FFFFFF', // White
  },
});

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
  input: {
    ...commonStyles.input,
    backgroundColor: '#B0E0E6', // Powder Blue
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#87CEFA', // Light Sky Blue
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#00008B', // Dark Blue
  },
  entryContainer: {
    ...commonStyles.entryContainer,
    backgroundColor: '#ADD8E6', // Light Blue
  },
  header: {
    backgroundColor: '#ADD8E6', // Light Blue
    textColor: '#00008B', // Dark Blue
    iconColor: '#00008B', // Dark Blue
  },
  drawer: {
    backgroundColor: '#ADD8E6', // Light Blue
    textColor: '#00008B', // Dark Blue
  },
  tabButton: {
    ...commonStyles.tabButton,
    backgroundColor: '#87CEFA', // Light Sky Blue
  },
  activeTabButton: {
    backgroundColor: '#4682B4', // Steel Blue
  },
  tabButtonText: {
    color: '#00008B', // Dark Blue
  },
  addButton: {
    ...commonStyles.addButton,
    backgroundColor: '#87CEFA', // Light Sky Blue
  },
  addButtonText: {
    ...commonStyles.addButtonText,
    color: '#00008B', // Dark Blue
  },
});

export const vampireTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#8B0000', // Dark Red
  },
  title: {
    ...commonStyles.title,
    color: '#FFFFFF', // White
  },
  input: {
    ...commonStyles.input,
    backgroundColor: '#B22222', // Firebrick
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#DC143C', // Crimson
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#FFFFFF', // White
  },
  entryContainer: {
    ...commonStyles.entryContainer,
    backgroundColor: '#8B0000', // Dark Red
  },
  header: {
    backgroundColor: '#8B0000', // Dark Red
    textColor: '#FFFFFF', // White
    iconColor: '#FFFFFF', // White
  },
  drawer: {
    backgroundColor: '#8B0000', // Dark Red
    textColor: '#FFFFFF', // White
  },
  tabButton: {
    ...commonStyles.tabButton,
    backgroundColor: '#DC143C', // Crimson
  },
  activeTabButton: {
    backgroundColor: '#B22222', // Firebrick
  },
  tabButtonText: {
    color: '#FFFFFF', // White
  },
  addButton: {
    ...commonStyles.addButton,
    backgroundColor: '#DC143C', // Crimson
  },
  addButtonText: {
    ...commonStyles.addButtonText,
    color: '#FFFFFF', // White
  },
});

export const fairyTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#FFB6C1', // Light Pink
  },
  title: {
    ...commonStyles.title,
    color: '#FFFFFF', // White
  },
  input: {
    ...commonStyles.input,
    backgroundColor: '#FFC0CB', // Pink
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#FF69B4', // Hot Pink
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#FFFFFF', // White
  },
  entryContainer: {
    ...commonStyles.entryContainer,
    backgroundColor: '#FFB6C1', // Light Pink
  },
  header: {
    backgroundColor: '#FFB6C1', // Light Pink
    textColor: '#FFFFFF', // White
    iconColor: '#FFFFFF', // White
  },
  drawer: {
    backgroundColor: '#FFB6C1', // Light Pink
    textColor: '#FFFFFF', // White
  },
  tabButton: {
    ...commonStyles.tabButton,
    backgroundColor: '#FF69B4', // Hot Pink
  },
  activeTabButton: {
    backgroundColor: '#FF1493', // Deep Pink
  },
  tabButtonText: {
    color: '#FFFFFF', // White
  },
  addButton: {
    ...commonStyles.addButton,
    backgroundColor: '#FF69B4', // Hot Pink
  },
  addButtonText: {
    ...commonStyles.addButtonText,
    color: '#FFFFFF', // White
  },
});

export const barbieTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#FF69B4', // Hot Pink
  },
  title: {
    ...commonStyles.title,
    color: '#FFFFFF', // White
  },
  input: {
    ...commonStyles.input,
    backgroundColor: '#FFB6C1', // Light Pink
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#FF1493', // Deep Pink
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#FFFFFF', // White
  },
  entryContainer: {
    ...commonStyles.entryContainer,
    backgroundColor: '#FF69B4', // Hot Pink
  },
  header: {
    backgroundColor: '#FF69B4', // Hot Pink
    textColor: '#FFFFFF', // White
    iconColor: '#FFFFFF', // White
  },
  drawer: {
    backgroundColor: '#FF69B4', // Hot Pink
    textColor: '#FFFFFF', // White
  },
  tabButton: {
    ...commonStyles.tabButton,
    backgroundColor: '#FF1493', // Deep Pink
  },
  activeTabButton: {
    backgroundColor: '#FF69B4', // Hot Pink
  },
  tabButtonText: {
    color: '#FFFFFF', // White
  },
  addButton: {
    ...commonStyles.addButton,
    backgroundColor: '#FF69B4', // Hot Pink
  },
  addButtonText: {
    ...commonStyles.addButtonText,
    color: '#FFFFFF', // White
  },
});

export const forestTheme = StyleSheet.create({
  ...commonStyles,
  container: {
    ...commonStyles.container,
    backgroundColor: '#C8E6C9', // Pastel Green
  },
  title: {
    ...commonStyles.title,
    color: '#2E7D32', // Forest Green
  },
  input: {
    ...commonStyles.input,
    backgroundColor: '#A5D6A7', // Light Green
  },
  button: {
    ...commonStyles.button,
    backgroundColor: '#81C784', // Medium Green
  },
  buttonText: {
    ...commonStyles.buttonText,
    color: '#2E7D32', // Forest Green
  },
  entryContainer: {
    ...commonStyles.entryContainer,
    backgroundColor: '#C8E6C9', // Pastel Green
  },
  header: {
    backgroundColor: '#C8E6C9', // Pastel Green
    textColor: '#2E7D32', // Forest Green
    iconColor: '#2E7D32', // Forest Green
  },
  drawer: {
    backgroundColor: '#C8E6C9', // Pastel Green
    textColor: '#2E7D32', // Forest Green
  },
  tabButton: {
    ...commonStyles.tabButton,
    backgroundColor: '#81C784', // Medium Green
  },
  activeTabButton: {
    backgroundColor: '#66BB6A', // Light Green
  },
  tabButtonText: {
    color: '#2E7D32', // Forest Green
  },
  addButton: {
    ...commonStyles.addButton,
    backgroundColor: '#81C784', // Medium Green
  },
  addButtonText: {
    ...commonStyles.addButtonText,
    color: '#2E7D32', // Forest Green
  },
});

export const generateCustomTheme = (color) => {
  const isDark = (color) => {
    const c = color.substring(1); // strip #
    const rgb = parseInt(c, 16); // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff; // extract red
    const g = (rgb >> 8) & 0xff; // extract green
    const b = (rgb >> 0) & 0xff; // extract blue
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
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
  });
};