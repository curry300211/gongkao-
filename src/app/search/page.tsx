export default function SearchPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
        搜索
      </h1>
      <p className="mt-2 text-muted-foreground">
        搜索知识库、题目和视频
      </p>

      <div className="mt-6">
        <input
          type="text"
          placeholder="输入关键词搜索..."
          className="w-full rounded-lg border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary"
        />
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
        <p>输入关键词开始搜索</p>
      </div>
    </div>
  );
}
