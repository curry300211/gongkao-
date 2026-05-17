"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

export default function VideoEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    url: "",
    instructor: "",
    description: "",
    section: "xingce",
    categoryId: "",
  });

  useEffect(() => {
    fetch(`/api/videos?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        const v = Array.isArray(data) ? data[0] : data;
        if (v) {
          setForm({
            title: v.title,
            url: v.url || "",
            instructor: v.instructor,
            description: v.description || "",
            section: v.section,
            categoryId: v.categoryId ? String(v.categoryId) : "",
          });
        }
        setLoading(false);
      });
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/videos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      }),
    });
    setSaving(false);
    router.back();
  };

  const handleDelete = async () => {
    if (!confirm("确定删除此视频？")) return;
    await fetch(`/api/videos/${id}`, { method: "DELETE" });
    router.push("/exam");
  };

  if (loading)
    return <div className="p-10 text-center text-muted-foreground">加载中...</div>;

  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight">编辑视频</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-semibold">标题 *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">讲师 *</label>
          <input
            required
            value={form.instructor}
            onChange={(e) => setForm({ ...form, instructor: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">视频链接</label>
          <input
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="text-sm font-semibold">简介</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary resize-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {saving ? "保存中..." : "保存修改"}
        </button>
      </form>

      <button
        onClick={handleDelete}
        className="mt-2 w-full rounded-xl border border-red-200 bg-red-50 py-2 text-sm font-medium text-destructive hover:bg-red-100 dark:bg-red-950/10 dark:hover:bg-red-950/30"
      >
        删除视频
      </button>
    </div>
  );
}
