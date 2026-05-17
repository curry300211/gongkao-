import Link from "next/link";
import { Video } from "lucide-react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { VideoItem } from "@/components/video/video-item";

export const dynamic = "force-dynamic";

export default async function XingceCategoryPage({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const cat = await db.category.findUnique({
    where: { id: parseInt(categoryId) },
  });
  if (!cat) notFound();

  const videos = await db.video.findMany({
    where: { categoryId: cat.id, section: "xingce" },
    orderBy: [{ instructor: "asc" }, { sortOrder: "asc" }],
  });

  // Group by instructor
  const grouped: Record<string, typeof videos> = {};
  for (const v of videos) {
    const key = v.instructor || "未注明讲师";
    (grouped[key] ??= []).push(v);
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <Link
        href="/exam/xingce"
        className="text-sm text-muted-foreground hover:text-primary"
      >
        ← 行测
      </Link>
      <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
        {cat.name.replace("行测-", "")}
      </h1>
      <p className="mt-1 text-muted-foreground">{cat.description}</p>

      <div className="mt-2 flex items-center gap-3">
        <Link
          href={`/videos/new?section=xingce&categoryId=${cat.id}`}
          className="rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          + 添加视频
        </Link>
        <Link
          href={`/quiz?categoryId=${cat.id}`}
          className="rounded-full border border-border bg-card px-4 py-1.5 text-sm font-medium hover:bg-accent"
        >
          刷此模块题目
        </Link>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="mt-10 rounded-xl border border-border bg-card py-16 text-center">
          <Video size={32} className="mx-auto text-muted-foreground/50" />
          <p className="mt-3 text-muted-foreground">暂无视频</p>
          <p className="mt-1 text-sm text-muted-foreground">
            点击上方按钮添加讲师视频
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-8">
          {Object.entries(grouped).map(([instructor, vids]) => (
            <div key={instructor}>
              <h2 className="text-lg font-bold text-primary pb-2 border-b-2 border-primary/30 mb-3">
                {instructor}
              </h2>
              <div className="space-y-1">
                {vids.map((v) => (
                  <VideoItem
                    key={v.id}
                    id={v.id}
                    title={v.title}
                    url={v.url}
                    description={v.description}
                    cloudType={v.cloudType}
                    cloudUrl={v.cloudUrl}
                    cloudPassword={v.cloudPassword}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
