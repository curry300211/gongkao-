export const dynamic = "force-dynamic";

import Link from "next/link";
import {
  BookOpen,
  PenLine,
  FileText,
  BarChart3,
  TrendingUp,
  CalendarDays,
} from "lucide-react";
import { db } from "@/lib/db";

export default async function Home() {
  const [categoryCount, videoCount, paperCount, xingceVideos, shenlunVideos] =
    await Promise.all([
      db.category.count(),
      db.video.count(),
      db.paper.count(),
      db.video.count({ where: { section: "xingce" } }),
      db.video.count({ where: { section: "shenlun" } }),
    ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
        江苏省考备考平台
      </h1>
      <p className="mt-2 text-muted-foreground">
        系统化备考，科学刷题，高效提分
      </p>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <Link
          href="/exam/xingce"
          className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <PenLine size={22} />
          </div>
          <div>
            <h3 className="font-semibold">行测</h3>
            <p className="text-sm text-muted-foreground">
              10 个模块 · {xingceVideos} 个视频
            </p>
          </div>
        </Link>

        <Link
          href="/exam/shenlun"
          className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-teal-500/50 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
            <FileText size={22} />
          </div>
          <div>
            <h3 className="font-semibold">申论</h3>
            <p className="text-sm text-muted-foreground">
              {shenlunVideos} 个视频
            </p>
          </div>
        </Link>

        <Link
          href="/papers"
          className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-amber-500/50 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <BookOpen size={22} />
          </div>
          <div>
            <h3 className="font-semibold">历年真题</h3>
            <p className="text-sm text-muted-foreground">
              {paperCount} 套试卷
            </p>
          </div>
        </Link>

        <Link
          href="/stats"
          className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <BarChart3 size={22} />
          </div>
          <div>
            <h3 className="font-semibold">学习数据</h3>
            <p className="text-sm text-muted-foreground">
              进度追踪 · 数据分析
            </p>
          </div>
        </Link>

        <Link
          href="/wrong-notebook"
          className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-red-500/50 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <TrendingUp size={22} />
          </div>
          <div>
            <h3 className="font-semibold">错题本</h3>
            <p className="text-sm text-muted-foreground">
              错题收录 · 重点复习
            </p>
          </div>
        </Link>

        <Link
          href="/daily"
          className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-green-500/50 hover:shadow-md"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <CalendarDays size={22} />
          </div>
          <div>
            <h3 className="font-semibold">每日一题</h3>
            <p className="text-sm text-muted-foreground">
              坚持打卡 · 积少成多
            </p>
          </div>
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="text-lg font-semibold">今日学习</h2>
        <div className="mt-4 rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
          <p>开始你的第一场练习吧</p>
          <Link
            href="/quiz"
            className="mt-3 inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            开始刷题
          </Link>
        </div>
      </div>
    </div>
  );
}
