"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type FontSize = "small" | "medium" | "large" | "xlarge";

const fontSizeScale: Record<FontSize, string> = {
  small: "14px",
  medium: "16px",
  large: "18px",
  xlarge: "20px",
};

interface SettingsStore {
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontSizePx: () => string;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      fontSize: "medium",
      setFontSize: (fontSize) => set({ fontSize }),
      fontSizePx: () => fontSizeScale[get().fontSize],
    }),
    { name: "jsk-settings" }
  )
);

export { fontSizeScale };
