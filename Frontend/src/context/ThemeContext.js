import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [colorScheme, setColorScheme] = useState('default');

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedColorScheme = localStorage.getItem('colorScheme') || 'default';
    setTheme(savedTheme);
    setColorScheme(savedColorScheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.setAttribute('data-color-scheme', savedColorScheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const changeColorScheme = (scheme) => {
    setColorScheme(scheme);
    localStorage.setItem('colorScheme', scheme);
    document.documentElement.setAttribute('data-color-scheme', scheme);
  };

  const value = {
    theme,
    colorScheme,
    toggleTheme,
    changeColorScheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
