interface Window {
  theme: {
    setTheme: (theme: "auto" | "dark" | "light") => void;
    getTheme: () => "auto" | "dark" | "light";
    getSystemTheme: () => "dark" | "light";
    getDefaultTheme: () => "auto" | "dark" | "light";
  };
}
