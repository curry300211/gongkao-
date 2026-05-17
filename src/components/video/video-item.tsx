import Link from "next/link";
import { Play, Cloud, ExternalLink } from "lucide-react";

const CLOUD_LABELS: Record<string, { label: string; color: string }> = {
  baidu: { label: "百度网盘", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  aliyun: { label: "阿里云盘", color: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  quark: { label: "夸克网盘", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  "123pan": { label: "123云盘", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  other: { label: "网盘", color: "bg-muted text-muted-foreground" },
};

interface VideoItemProps {
  id: number;
  title: string;
  url?: string;
  description?: string | null;
  cloudType?: string;
  cloudUrl?: string;
  cloudPassword?: string;
}

export function VideoItem({
  id,
  title,
  url,
  description,
  cloudType,
  cloudUrl,
  cloudPassword,
}: VideoItemProps) {
  const cloud = cloudType ? CLOUD_LABELS[cloudType] : null;
  const hasDirectLink = url && url.trim();

  return (
    <div className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-accent">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
        <Play size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">{title}</span>
          {cloud && (
            <span
              className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${cloud.color}`}
            >
              <Cloud size={10} />
              {cloud.label}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {description}
          </p>
        )}
        <div className="mt-1 flex items-center gap-3 text-xs">
          {hasDirectLink && (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <ExternalLink size={10} /> 直链观看
            </a>
          )}
          {cloud && cloudUrl && (
            <a
              href={cloudUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
            >
              <Cloud size={10} /> 打开网盘
              {cloudPassword && (
                <span className="text-muted-foreground">
                  提取码: {cloudPassword}
                </span>
              )}
            </a>
          )}
        </div>
      </div>
      <Link
        href={`/videos/${id}/edit`}
        className="shrink-0 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-primary"
      >
        编辑
      </Link>
    </div>
  );
}
