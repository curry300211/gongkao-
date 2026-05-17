export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/db";

export default async function XingcePage() {
  const categories = await db.category.findMany({
    where: { name: { startsWith: "行测-" } },
    orderBy: { id: "asc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
        行测
      </h1>
      <p className="mt-2 text-muted-foreground">
        行政职业能力测验 · {categories.length} 个模块
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/exam/xingce/${cat.id}`}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <h3 className="font-semibold text-sm">
              {cat.name.replace("行测-", "")}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {cat.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
