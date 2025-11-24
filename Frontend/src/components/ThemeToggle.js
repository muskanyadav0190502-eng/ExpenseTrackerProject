import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { theme, colorScheme, toggleTheme, changeColorScheme } = useTheme();

  const colorSchemes = [
    { id: 'default', name: 'Purple', color: '#758cf1ff' },
    { id: 'blue', name: 'Blue', color: '#99bef9ff' },
    { id: 'green', name: 'Green', color: '#B9E884' },
    { id: 'orange', name: 'Orange', color: '#ec9557ff' },
    { id: 'pink', name: 'Pink', color: '#f1aed0ff' }
  ];

  return (
    <div className="theme-toggle-container">
      <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
      
      <div className="color-scheme-selector">
        <label>Choose color that best matches your mood:</label>
        <div className="color-options">
          {colorSchemes.map((scheme) => (
            <button
              key={scheme.id}
              className={`color-option ${colorScheme === scheme.id ? 'active' : ''}`}
              style={{ backgroundColor: scheme.color }}
              onClick={() => changeColorScheme(scheme.id)}
              title={scheme.name}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeToggle;
