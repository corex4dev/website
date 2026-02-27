interface Window {
  __ENZUZO_STARTED__?: boolean;
  __enzuzoApi?: {
    prefCenter: { show: () => void };
  };
  theme: {
    setTheme: (theme: "auto" | "dark" | "light") => void;
    getTheme: () => "auto" | "dark" | "light";
    getSystemTheme: () => "dark" | "light";
    getDefaultTheme: () => "auto" | "dark" | "light";
  };
}
