"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";

interface RadarData {
  category: string;
  accuracy: number;
}

export function ModuleRadar({ data }: { data: RadarData[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground text-sm">
        尚无数据，开始刷题后会显示模块掌握度
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data}>
        <PolarGrid stroke="var(--border)" />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={[0, 100]}
          tick={{ fontSize: 9, fill: "var(--muted-foreground)" }}
        />
        <Radar
          name="正确率"
          dataKey="accuracy"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.2}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
