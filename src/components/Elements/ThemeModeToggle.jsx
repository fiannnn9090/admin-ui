import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import { useColorMode } from "../../context/colorModeContext.jsx";

function ThemeModeToggle({ className = "" }) {
  const { isDarkMode, toggleMode } = useColorMode();

  return (
    <button
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      className={`inline-flex cursor-pointer items-center gap-2 rounded border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:scale-105 ${className}`}
      onClick={toggleMode}
      type="button"
    >
      {isDarkMode ? (
        <LightModeOutlinedIcon fontSize="small" />
      ) : (
        <DarkModeOutlinedIcon fontSize="small" />
      )}
      {isDarkMode ? "Light mode" : "Dark mode"}
    </button>
  );
}

export default ThemeModeToggle;
