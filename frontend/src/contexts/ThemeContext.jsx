import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        return saved ? saved === 'dark' : false;
    });

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        document.body.className = isDark ? 'dark-theme' : 'light-theme';
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(!isDark);
    };

    const theme = {
        isDark,
        toggleTheme,
        colors: {
            background: isDark ? '#1a1a1a' : '#ffffff',
            surface: isDark ? '#2d2d2d' : '#f9f9f9',
            text: isDark ? '#ffffff' : '#333333',
            textSecondary: isDark ? '#cccccc' : '#666666',
            border: isDark ? '#404040' : '#dddddd',
            primary: isDark ? '#4a9eff' : '#007bff',
            success: isDark ? '#28a745' : '#28a745',
            danger: isDark ? '#dc3545' : '#dc3545',
            warning: isDark ? '#ffc107' : '#ffc107'
        }
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};
