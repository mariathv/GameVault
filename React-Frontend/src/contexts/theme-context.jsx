import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Check for saved theme in localStorage
        const savedTheme = localStorage.getItem('theme');

        // Check for system preference if no saved theme
        if (!savedTheme) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        return savedTheme;
    });

    // Update theme class on document and save to localStorage
    useEffect(() => {
        const root = window.document.documentElement;

        // Remove previous theme class
        root.classList.remove('light', 'dark');

        // Add current theme class
        root.classList.add(theme);

        // Save to localStorage
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = () => {
            if (!localStorage.getItem('theme')) {
                setTheme(mediaQuery.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const value = {
        theme,
        setTheme: (newTheme) => {
            setTheme(newTheme);
        },
        toggleTheme: () => {
            setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
        }
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
