import Link from "next/link";

export default function KnowledgePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
        知识库
      </h1>
      <p className="mt-2 text-muted-foreground">
        学习笔记 · 文章收藏 · 备考资料
      </p>

      <div className="mt-8 rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
        <p className="text-lg">知识库内容即将迁移</p>
        <p className="mt-2 text-sm">
          原有 SQLite 数据库内容将迁移至 PostgreSQL
        </p>
      </div>
    </div>
  );
}
