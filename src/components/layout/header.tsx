"use client";

import Link from "next/link";
import { useSettingsStore, fontSizeScale } from "@/stores/settings-store";
import { Moon, Sun, Monitor, Search, Menu } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FontSizeSelector } from "./font-size-selector";

export function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <button
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent md:hidden"
          aria-label="打开菜单"
        >
          <Menu size={20} />
        </button>
        <Link
          href="/"
          className="text-lg font-extrabold text-primary hidden sm:block"
        >
          JSExam
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-muted-foreground hover:text-foreground hidden md:inline"
        >
          首页
        </Link>
        <Link
          href="/exam"
          className="text-sm font-medium text-muted-foreground hover:text-foreground hidden md:inline"
        >
          备考
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/search"
          className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
          aria-label="搜索"
        >
          <Search size={18} />
        </Link>

        {mounted && (
          <button
            onClick={cycleTheme}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
            aria-label="切换主题"
          >
            {theme === "dark" ? (
              <Moon size={18} />
            ) : theme === "light" ? (
              <Sun size={18} />
            ) : (
              <Monitor size={18} />
            )}
          </button>
        )}

        <FontSizeSelector />
      </div>
    </header>
  );
}
