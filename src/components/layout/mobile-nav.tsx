"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, BarChart3, AlertTriangle, User } from "lucide-react";

const mobileItems = [
  { href: "/", label: "首页", icon: Home },
  { href: "/exam", label: "备考", icon: BookOpen },
  { href: "/stats", label: "数据", icon: BarChart3 },
  { href: "/wrong-notebook", label: "错题", icon: AlertTriangle },
  { href: "/settings", label: "我的", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-14 items-center justify-around border-t border-border bg-card md:hidden">
      {mobileItems.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          (item.href !== "/" && pathname.startsWith(item.href));

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 text-xs font-medium transition-colors ${
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
