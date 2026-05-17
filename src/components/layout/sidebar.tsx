"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  PenLine,
  FileText,
  BarChart3,
  AlertTriangle,
  Trophy,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/exam", label: "备考中心", icon: BookOpen },
  {
    href: "/exam/xingce",
    label: "行测",
    icon: PenLine,
  },
  {
    href: "/exam/shenlun",
    label: "申论",
    icon: FileText,
  },
  {
    href: "/papers",
    label: "历年真题",
    icon: FileText,
  },
  {
    href: "/stats",
    label: "学习数据",
    icon: BarChart3,
  },
  {
    href: "/wrong-notebook",
    label: "错题本",
    icon: AlertTriangle,
  },
  {
    href: "/achievements",
    label: "成就",
    icon: Trophy,
  },
  {
    href: "/settings",
    label: "设置",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex w-56 flex-col border-r border-border bg-card">
      <div className="flex h-14 items-center border-b border-border px-5">
        <Link href="/" className="text-xl font-extrabold text-primary">
          JSExam
        </Link>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
