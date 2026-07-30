/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

const COLOR_MODE_KEY = "finebank_color_mode";

export const ColorModeContext = createContext(null);

export function ColorModeContextProvider({ children }) {
  const [mode, setModeState] = useState(() => {
    const storedMode = localStorage.getItem(COLOR_MODE_KEY);
    return storedMode === "dark" ? "dark" : "light";
  });

  const value = useMemo(
    () => ({
      isDarkMode: mode === "dark",
      mode,
      modeClassName: mode === "dark" ? "mode-dark" : "mode-light",
      setMode(nextMode) {
        const normalizedMode = nextMode === "dark" ? "dark" : "light";
        localStorage.setItem(COLOR_MODE_KEY, normalizedMode);
        setModeState(normalizedMode);
      },
      toggleMode() {
        setModeState((currentMode) => {
          const nextMode = currentMode === "dark" ? "light" : "dark";
          localStorage.setItem(COLOR_MODE_KEY, nextMode);
          return nextMode;
        });
      },
    }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
}

export function useColorMode() {
  const colorModeContext = useContext(ColorModeContext);

  if (!colorModeContext) {
    throw new Error("useColorMode must be used within ColorModeContextProvider.");
  }

  return colorModeContext;
}
