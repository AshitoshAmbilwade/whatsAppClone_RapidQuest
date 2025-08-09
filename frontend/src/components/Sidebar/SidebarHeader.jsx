import { useTheme } from "../../context/ThemeContext";

export default function SidebarHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex justify-between items-center p-3 bg-gray-200 dark:bg-gray-800">
      <h1 className="text-lg font-bold dark:text-white">Chats</h1>
      <button
        onClick={toggleTheme}
        className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-600 text-black dark:text-white"
      >
        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
}
