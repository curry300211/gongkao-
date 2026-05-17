import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  const [categoryCount, entryCount, videoCount, paperCount, xingceVideos, shenlunVideos] =
    await Promise.all([
      db.category.count(),
      db.entry.count(),
      db.video.count(),
      db.paper.count(),
      db.video.count({ where: { section: "xingce" } }),
      db.video.count({ where: { section: "shenlun" } }),
    ]);

  return NextResponse.json({
    categoryCount,
    entryCount,
    videoCount,
    paperCount,
    xingceVideoCount: xingceVideos,
    shenlunVideoCount: shenlunVideos,
  });
}
