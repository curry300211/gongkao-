"use client";

interface HeatmapData {
  date: string;
  totalSec: number;
}

function getColor(seconds: number): string {
  if (seconds === 0) return "bg-muted";
  if (seconds < 600) return "bg-green-200 dark:bg-green-900";
  if (seconds < 1800) return "bg-green-400 dark:bg-green-700";
  if (seconds < 3600) return "bg-green-500 dark:bg-green-600";
  return "bg-green-600 dark:bg-green-500";
}

export function CalendarHeatmap({ data }: { data: HeatmapData[] }) {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 13 * 7);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const labelRows = 7;
  const columns = 14;
  const weekLabels = ["日", "一", "二", "三", "四", "五", "六"];

  // Build lookup
  const lookup = new Map<string, number>();
  for (const d of data) lookup.set(d.date, d.totalSec);

  const cells: { date: string; seconds: number }[] = [];
  const d = new Date(startDate);
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < labelRows; row++) {
      const dateStr = d.toISOString().slice(0, 10);
      cells.push({
        date: dateStr,
        seconds: lookup.get(dateStr) || 0,
      });
      d.setDate(d.getDate() + 1);
    }
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-0.5">
        <div className="grid grid-rows-7 gap-1 pr-2 pt-1">
          {weekLabels.map((l, i) => (
            <span
              key={i}
              className="text-[10px] leading-3 text-muted-foreground"
            >
              {l}
            </span>
          ))}
        </div>
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gridTemplateRows: `repeat(${labelRows}, 1fr)`,
            gridAutoFlow: "column",
          }}
        >
          {cells.map((cell, i) => (
            <div
              key={i}
              title={`${cell.date}: ${Math.round(cell.seconds / 60)}分钟`}
              className={`h-3 w-3 rounded-sm ${getColor(cell.seconds)}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">
        少
        <span className="h-3 w-3 rounded-sm bg-muted" />
        <span className="h-3 w-3 rounded-sm bg-green-200 dark:bg-green-900" />
        <span className="h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700" />
        <span className="h-3 w-3 rounded-sm bg-green-500 dark:bg-green-600" />
        <span className="h-3 w-3 rounded-sm bg-green-600 dark:bg-green-500" />
        多
      </div>
    </div>
  );
}
