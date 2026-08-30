"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type ThemeType = "cyberpunk" | "bloomberg" | "light"

interface ThemeContextType {
  theme: ThemeType
  setTheme: (theme: ThemeType) => void
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "cyberpunk",
  setTheme: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>("cyberpunk")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("stock_agent_theme") as ThemeType
      if (savedTheme && (savedTheme === "cyberpunk" || savedTheme === "bloomberg" || savedTheme === "light")) {
        setThemeState(savedTheme)
        document.documentElement.setAttribute("data-theme", savedTheme)
      } else {
        document.documentElement.setAttribute("data-theme", "cyberpunk")
      }
    } catch {
      document.documentElement.setAttribute("data-theme", "cyberpunk")
    }
    setMounted(true)
  }, [])

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme)
    try {
      localStorage.setItem("stock_agent_theme", newTheme)
    } catch {}
    document.documentElement.setAttribute("data-theme", newTheme)
  }

  const toggleTheme = () => {
    const themeCycle: Record<ThemeType, ThemeType> = {
      cyberpunk: "bloomberg",
      bloomberg: "light",
      light: "cyberpunk",
    }
    setTheme(themeCycle[theme])
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
