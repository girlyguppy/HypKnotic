/**
 * HypKnotic Theme System
 * 
 * A modular, semantic theming system that provides:
 * - Consistent color naming (primary, secondary, background, surface, text, etc.)
 * - Automatic contrast calculation for text on different backgrounds
 * - Semantic color purposes (success, warning, danger, info)
 * - Easy theme creation with minimal configuration
 */

// Utility function to determine if a color is dark
const isColorDark = (hexColor) => {
  if (!hexColor || typeof hexColor !== 'string') return false;
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
};

// Get contrasting text color for any background
const getContrastText = (backgroundColor, lightText = '#FFFFFF', darkText = '#1A1A1A') => {
  return isColorDark(backgroundColor) ? lightText : darkText;
};

// Lighten or darken a color
const adjustColor = (hex, amount) => {
  if (!hex) return '#808080';
  const clamp = (val) => Math.min(255, Math.max(0, val));
  const color = hex.replace('#', '');
  const r = clamp(parseInt(color.substring(0, 2), 16) + amount);
  const g = clamp(parseInt(color.substring(2, 4), 16) + amount);
  const b = clamp(parseInt(color.substring(4, 6), 16) + amount);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

/**
 * Create a complete theme from minimal color inputs
 * @param {object} config - Theme configuration
 * @param {string} config.name - Theme name
 * @param {string} config.primary - Primary accent color
 * @param {string} config.background - Main background color
 * @param {string} config.surface - Surface/card background color (optional, derived from background)
 * @param {string} config.success - Success color (optional, defaults to green)
 * @param {string} config.warning - Warning color (optional, defaults to yellow/orange)
 * @param {string} config.danger - Danger/error color (optional, defaults to red)
 * @param {string} config.info - Info color (optional, defaults to blue)
 */
export const createSemanticTheme = (config) => {
  const {
    name,
    primary,
    background,
    surface = isColorDark(background) ? adjustColor(background, 20) : adjustColor(background, -15),
    success = '#28A745',
    warning = '#FFC107',
    danger = '#DC3545',
    info = '#17A2B8',
  } = config;

  // Determine if this is a dark theme
  const isDark = isColorDark(background);
  
  // Text colors based on background
  const textPrimary = getContrastText(background);
  const textSecondary = isDark ? '#AAAAAA' : '#666666';
  const textMuted = isDark ? '#777777' : '#999999';
  
  // Text on primary (accent) color
  const textOnPrimary = getContrastText(primary);
  
  // Text on surface
  const textOnSurface = getContrastText(surface);
  
  // Border color
  const border = isDark ? '#444444' : '#DDDDDD';
  const borderFocused = primary;
  
  // Input backgrounds
  const inputBackground = isDark ? adjustColor(surface, 10) : '#FFFFFF';
  const inputText = getContrastText(inputBackground);
  
  // Create button variant colors
  const primaryHover = adjustColor(primary, isDark ? 20 : -20);
  const surfaceHover = adjustColor(surface, isDark ? 15 : -10);
  
  // Drawer/Sidebar
  const drawer = isDark ? adjustColor(background, -10) : adjustColor(background, -5);
  const drawerText = getContrastText(drawer);
  
  // Tab bar
  const tabBar = surface;
  const tabBarActive = primary;
  const tabBarInactive = textMuted;

  return {
    name,
    isDark,
    
    // Core colors
    colors: {
      primary,
      primaryHover,
      background,
      surface,
      surfaceHover,
      
      // Semantic colors
      success,
      successText: getContrastText(success),
      warning,
      warningText: getContrastText(warning),
      danger,
      dangerText: getContrastText(danger),
      info,
      infoText: getContrastText(info),
      
      // Text colors
      text: textPrimary,
      textSecondary,
      textMuted,
      textOnPrimary,
      textOnSurface,
      
      // Borders
      border,
      borderFocused,
      
      // Inputs
      inputBackground,
      inputText,
      inputPlaceholder: textMuted,
      inputBorder: border,
      
      // Navigation
      drawer,
      drawerText,
      tabBar,
      tabBarActive,
      tabBarInactive,
      
      // For backwards compatibility with existing components
      textColor: textPrimary,
      placeholderTextColor: textMuted,
      borderColor: border,
    },
    
    // Pre-built style objects for common components
    styles: {
      // Container styles
      container: {
        flex: 1,
        backgroundColor: background,
        padding: 16,
      },
      
      // Surface/card styles
      surface: {
        backgroundColor: surface,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
      },
      
      // Text styles
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: textPrimary,
        marginBottom: 16,
      },
      
      subtitle: {
        fontSize: 18,
        fontWeight: '600',
        color: textPrimary,
        marginBottom: 12,
      },
      
      text: {
        fontSize: 14,
        color: textPrimary,
      },
      
      textSecondary: {
        fontSize: 14,
        color: textSecondary,
      },
      
      textMuted: {
        fontSize: 12,
        color: textMuted,
      },
      
      // Button styles
      button: {
        backgroundColor: primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      },
      
      buttonText: {
        color: textOnPrimary,
        fontSize: 16,
        fontWeight: '600',
      },
      
      buttonSecondary: {
        backgroundColor: surface,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: border,
      },
      
      buttonSecondaryText: {
        color: textOnSurface,
        fontSize: 16,
        fontWeight: '600',
      },
      
      buttonSuccess: {
        backgroundColor: success,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      },
      
      buttonDanger: {
        backgroundColor: danger,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
      },
      
      // Input styles
      input: {
        backgroundColor: inputBackground,
        borderWidth: 1,
        borderColor: border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: inputText,
        marginVertical: 8,
      },
      
      // List item styles
      listItem: {
        backgroundColor: surface,
        padding: 16,
        borderRadius: 8,
        marginVertical: 4,
        flexDirection: 'row',
        alignItems: 'center',
      },
      
      // Card styles
      card: {
        backgroundColor: surface,
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        shadowColor: isDark ? '#000000' : '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: isDark ? 0.3 : 0.1,
        shadowRadius: 4,
        elevation: 3,
      },
      
      // Modal styles
      modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
      },
      
      modalContent: {
        backgroundColor: surface,
        borderRadius: 16,
        padding: 24,
        width: '90%',
        maxWidth: 400,
      },
      
      // Divider
      divider: {
        height: 1,
        backgroundColor: border,
        marginVertical: 12,
      },
      
      // Row layout
      row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      
      // Badge
      badge: {
        backgroundColor: primary,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        minWidth: 24,
        alignItems: 'center',
      },
      
      badgeText: {
        color: textOnPrimary,
        fontSize: 12,
        fontWeight: 'bold',
      },
    },
    
    // Backwards compatibility - flat color properties
    punishmentBackground: surface,
    incrementButtonBackground: success,
    incrementButtonTextColor: getContrastText(success),
    decrementButtonBackground: warning,
    decrementButtonTextColor: getContrastText(warning),
    completeButtonBackground: info,
    completeButtonTextColor: getContrastText(info),
    deleteButtonBackground: danger,
    deleteButtonTextColor: getContrastText(danger),
    confirmButtonBackground: success,
    confirmButtonTextColor: getContrastText(success),
    cancelButtonBackground: textMuted,
    cancelButtonTextColor: '#FFFFFF',
    formBackground: surface,
    modalOverlayBackground: 'rgba(0, 0, 0, 0.5)',
    inputBackground,
    inputBorderColor: border,
  };
};

// Pre-built themes
export const themes = {
  lavender: createSemanticTheme({
    name: 'Lavender',
    primary: '#9B59B6',
    background: '#F3E8FF',
    surface: '#FFFFFF',
  }),
  
  dark: createSemanticTheme({
    name: 'Dark',
    primary: '#BB86FC',
    background: '#121212',
    surface: '#1E1E1E',
  }),
  
  latex: createSemanticTheme({
    name: 'Latex',
    primary: '#E91E63',
    background: '#000000',
    surface: '#1A1A1A',
  }),
  
  babyBlue: createSemanticTheme({
    name: 'Baby Blue',
    primary: '#2196F3',
    background: '#E3F2FD',
    surface: '#FFFFFF',
  }),
  
  vampire: createSemanticTheme({
    name: 'Vampire',
    primary: '#B71C1C',
    background: '#1A0A0A',
    surface: '#2D1515',
  }),
  
  fairy: createSemanticTheme({
    name: 'Fairy',
    primary: '#E91E63',
    background: '#FFF0F5',
    surface: '#FFFFFF',
  }),
  
  barbie: createSemanticTheme({
    name: 'Barbie',
    primary: '#FF69B4',
    background: '#FFE4EC',
    surface: '#FFFFFF',
  }),
  
  forest: createSemanticTheme({
    name: 'Forest',
    primary: '#4CAF50',
    background: '#1B2819',
    surface: '#263324',
  }),
  
  ocean: createSemanticTheme({
    name: 'Ocean',
    primary: '#00BCD4',
    background: '#E0F7FA',
    surface: '#FFFFFF',
  }),
  
  sunset: createSemanticTheme({
    name: 'Sunset',
    primary: '#FF5722',
    background: '#FFF3E0',
    surface: '#FFFFFF',
  }),
};

// Helper to create a custom theme from user color
export const createCustomTheme = (primaryColor, isDarkMode = false) => {
  return createSemanticTheme({
    name: 'Custom',
    primary: primaryColor,
    background: isDarkMode ? '#121212' : '#F5F5F5',
    surface: isDarkMode ? '#1E1E1E' : '#FFFFFF',
  });
};

export default themes;
