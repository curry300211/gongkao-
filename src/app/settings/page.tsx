"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useSettingsStore } from "@/stores/settings-store";
import { Moon, Sun, Monitor } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const fontSize = useSettingsStore((s) => s.fontSize);
  const setFontSize = useSettingsStore((s) => s.setFontSize);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
        设置
      </h1>

      {/* Theme */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          主题
        </h2>
        <div className="mt-3 flex gap-2">
          {[
            { key: "light", label: "浅色", icon: Sun },
            { key: "dark", label: "深色", icon: Moon },
            { key: "system", label: "跟随系统", icon: Monitor },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                theme === key
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      </section>

      {/* Font Size */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          字体大小
        </h2>
        <div className="mt-3 flex gap-2">
          {(["small", "medium", "large", "xlarge"] as const).map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                fontSize === size
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-card text-muted-foreground hover:bg-accent"
              }`}
            >
              {{ small: "小", medium: "中", large: "大", xlarge: "特大" }[size]}
            </button>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="mt-10 border-t border-border pt-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          关于
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          JSExam — 江苏省公务员考试备考平台 v0.1.0
        </p>
      </section>
    </div>
  );
}
