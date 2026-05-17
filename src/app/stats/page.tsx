"use client";

import { useEffect, useState } from "react";
import { CalendarHeatmap } from "@/components/stats/calendar-heatmap";
import { ModuleRadar } from "@/components/stats/module-radar";
import { StudyTimeChart } from "@/components/stats/study-time-chart";
import { WeakPointList } from "@/components/stats/weak-point-list";
import { Flame, Target, Clock, Zap } from "lucide-react";

interface Summary {
  streak: number;
  totalQuestions: number;
  totalMinutes: number;
  accuracy: number;
}

export default function StatsPage() {
  const [heatmap, setHeatmap] = useState<any[]>([]);
  const [mastery, setMastery] = useState<any[]>([]);
  const [timeData, setTimeData] = useState<any[]>([]);
  const [summary, setSummary] = useState<Summary>({
    streak: 0,
    totalQuestions: 0,
    totalMinutes: 0,
    accuracy: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [hm, m, t] = await Promise.all([
        fetch("/api/stats/heatmap").then((r) => r.json()),
        fetch("/api/stats/mastery").then((r) => r.json()),
        fetch("/api/stats/time").then((r) => r.json()),
      ]);

      setHeatmap(hm.data || []);
      setMastery(m || []);
      setTimeData(t || []);

      const totalQ = (m || []).reduce(
        (s: number, d: any) => s + (d.total || 0),
        0
      );
      const totalC = (m || []).reduce(
        (s: number, d: any) => s + (d.correct || 0),
        0
      );
      const totalM = (t || []).reduce(
        (s: number, d: any) => s + (d.minutes || 0),
        0
      );

      setSummary({
        streak: 0,
        totalQuestions: totalQ,
        totalMinutes: totalM,
        accuracy: totalQ > 0 ? Math.round((totalC / totalQ) * 100) : 0,
      });

      setLoading(false);
    })();
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
        学习数据
      </h1>
      <p className="mt-1 text-muted-foreground">
        数据驱动的备考追踪
      </p>

      {/* Summary cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <Flame size={20} className="text-amber-500" />
          <p className="mt-2 text-2xl font-extrabold">{summary.streak}</p>
          <p className="text-xs text-muted-foreground">连续学习天数</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <Target size={20} className="text-primary" />
          <p className="mt-2 text-2xl font-extrabold">
            {summary.totalQuestions}
          </p>
          <p className="text-xs text-muted-foreground">累计刷题数</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <Clock size={20} className="text-teal-500" />
          <p className="mt-2 text-2xl font-extrabold">
            {Math.round(summary.totalMinutes / 60)}h
          </p>
          <p className="text-xs text-muted-foreground">学习时长</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <Zap size={20} className="text-green-500" />
          <p className="mt-2 text-2xl font-extrabold">
            {summary.accuracy}%
          </p>
          <p className="text-xs text-muted-foreground">总体正确率</p>
        </div>
      </div>

      {/* Heatmap */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">学习热力图</h2>
        <div className="mt-3 rounded-xl border border-border bg-card p-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              加载中...
            </p>
          ) : (
            <CalendarHeatmap data={heatmap} />
          )}
        </div>
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-lg font-semibold">模块掌握度</h2>
          <div className="mt-3 rounded-xl border border-border bg-card p-4">
            <ModuleRadar data={mastery} />
          </div>
        </div>
        <div>
          <h2 className="text-lg font-semibold">薄弱环节</h2>
          <div className="mt-3 rounded-xl border border-border bg-card p-4">
            <WeakPointList data={mastery} />
          </div>
        </div>
      </div>

      {/* Study time */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">学习时长</h2>
        <div className="mt-3 rounded-xl border border-border bg-card p-4">
          <StudyTimeChart data={timeData} />
        </div>
      </div>
    </div>
  );
}
