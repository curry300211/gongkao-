"use client";

import { useSettingsStore } from "@/stores/settings-store";
import { Type } from "lucide-react";
import { useEffect, useState } from "react";

const sizes = ["small", "medium", "large", "xlarge"] as const;
const labels: Record<string, string> = {
  small: "小",
  medium: "中",
  large: "大",
  xlarge: "特大",
};

export function FontSizeSelector() {
  const fontSize = useSettingsStore((s) => s.fontSize);
  const setFontSize = useSettingsStore((s) => s.setFontSize);
  const [open, setOpen] = useState(false);

  const cycle = () => {
    const idx = sizes.indexOf(fontSize);
    const next = sizes[(idx + 1) % sizes.length];
    setFontSize(next);
  };

  useEffect(() => {
    document.documentElement.style.fontSize =
      {
        small: "14px",
        medium: "16px",
        large: "18px",
        xlarge: "20px",
      }[fontSize] || "16px";
  }, [fontSize]);

  return (
    <button
      onClick={cycle}
      className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
      aria-label={`字体大小: ${labels[fontSize]}`}
      title={`字体: ${labels[fontSize]}`}
    >
      <Type size={18} />
    </button>
  );
}
