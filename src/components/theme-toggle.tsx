"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (showMenu) {
      const timer = setTimeout(() => setShowMenu(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showMenu]);

  if (!mounted) {
    return (
      <button
        className="w-9 h-9 rounded-lg bg-card/50 border border-border flex items-center justify-center"
        aria-label="Toggle theme"
      >
        <div className="w-4 h-4" />
      </button>
    );
  }

  const nextTheme = theme === "dark" ? "light" : theme === "light" ? "system" : "dark";
  const CurrentIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  const cycleTheme = () => {
    setTheme(nextTheme);
  };

  return (
    <div className="relative">
      <button
        onClick={cycleTheme}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowMenu(!showMenu);
        }}
        className="relative w-9 h-9 rounded-lg border border-border flex items-center justify-center transition-all duration-300 overflow-hidden hover:scale-110 active:scale-95 cursor-pointer
          bg-gradient-to-br from-green-500/10 to-lime-500/10 hover:from-green-500/20 hover:to-lime-500/20 dark:from-green-500/15 dark:to-lime-500/15 dark:hover:from-green-500/25 dark:hover:to-lime-500/25"
        aria-label={`Current theme: ${theme}. Click to switch to ${nextTheme}.`}
      >
        <Sun
          className={`absolute w-4 h-4 text-amber-500 transition-all duration-300 ${
            theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
          }`}
        />
        <Moon
          className={`absolute w-4 h-4 text-blue-400 transition-all duration-300 ${
            theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`}
        />
        <Monitor
          className={`absolute w-4 h-4 text-green-500 transition-all duration-300 ${
            theme === "system" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
          }`}
        />
      </button>

      {/* Quick theme picker on right-click */}
      {showMenu && (
        <div className="absolute right-0 top-full mt-2 p-1.5 rounded-xl glass z-50 min-w-[120px] animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
          {[
            { value: "light", icon: Sun, label: "Light", color: "text-amber-500" },
            { value: "dark", icon: Moon, label: "Dark", color: "text-blue-400" },
            { value: "system", icon: Monitor, label: "System", color: "text-green-500" },
          ].map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setTheme(t.value);
                setShowMenu(false);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                theme === t.value
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <t.icon className={`w-3.5 h-3.5 ${theme === t.value ? t.color : ""}`} />
              <span>{t.label}</span>
              {theme === t.value && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
