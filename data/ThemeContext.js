import { createContext, useContext, useState } from 'react';
import { lavenderTheme } from '../styles/Themes';

export const ThemeContext = createContext({
  theme: lavenderTheme,
  setTheme: (theme) => {}
});

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(lavenderTheme);

  const value = {
    theme: currentTheme,
    setTheme: (newTheme) => setCurrentTheme(newTheme)
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};