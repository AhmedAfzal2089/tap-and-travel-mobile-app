import { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";

const lightTheme = {
  colors: {
    primary: "#292966",
    secondary: "#5c5c99",
    tertiary: "#a3a3cc",
    basic: "#ccccff",
    green: "#00FF00",
  },
  spacing: {
    small: 8,
    medium: 16,
    large: 24,
  },
  typography: {
    header: { fontSize: 24, fontWeight: "bold" },
    body: { fontSize: 16, fontWeight: "normal" },
  },
};

const darkTheme = {
  colors: {
    primary: "#292966",
    secondary: "#5c5c99",
    tertiary: "#a3a3cc",
    basic: "#ccccff",
    green: "#00FF00",
  },
  spacing: lightTheme.spacing,
  typography: lightTheme.typography,
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(darkTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook to use the theme
export const useTheme = () => useContext(ThemeContext);
