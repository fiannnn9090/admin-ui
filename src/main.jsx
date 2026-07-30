import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";
import { ColorModeContextProvider } from "./context/colorModeContext.jsx";
import { ThemeContextProvider } from "./context/themeContext.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ColorModeContextProvider>
        <ThemeContextProvider>
          <App />
        </ThemeContextProvider>
      </ColorModeContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
);
