import React, { createContext, useState, useEffect, useContext } from 'react';


export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem('theme');
        // Check for system preference if no saved theme
        if (!saved) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return saved === 'dark';
    });

    useEffect(() => {
        localStorage.setItem('theme', isDark ? 'dark' : 'light');

        // Toggle the 'dark' class on the HTML element
        if (isDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [isDark]);

    return (
        <ThemeContext.Provider value={{ isDark, setIsDark }}>
            {children}
        </ThemeContext.Provider>
    );
};