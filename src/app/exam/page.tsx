import Link from "next/link";
import { PenLine, FileText, BookOpen } from "lucide-react";

export default function ExamPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
        备考中心
      </h1>
      <p className="mt-2 text-muted-foreground">
        行测 · 申论 · 历年真题
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Link
          href="/exam/xingce"
          className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
            <PenLine size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">行测</h3>
            <p className="text-sm text-muted-foreground">
              10 个模块分类，视频课程与刷题练习
            </p>
          </div>
        </Link>

        <Link
          href="/exam/shenlun"
          className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-teal-500/50 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400">
            <FileText size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">申论</h3>
            <p className="text-sm text-muted-foreground">
              视频课程、写作素材与范文
            </p>
          </div>
        </Link>

        <Link
          href="/papers"
          className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-6 transition-all hover:border-amber-500/50 hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <BookOpen size={24} />
          </div>
          <div>
            <h3 className="text-lg font-semibold">历年真题</h3>
            <p className="text-sm text-muted-foreground">
              历年真题试卷，模拟真实考试
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}
