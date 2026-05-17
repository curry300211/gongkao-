"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function VideoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  const [form, setForm] = useState({
    title: "",
    url: "",
    cloudType: "",
    cloudUrl: "",
    cloudPassword: "",
    instructor: "",
    description: "",
    section: searchParams.get("section") || "xingce",
    categoryId: searchParams.get("categoryId") || "",
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  const xingceCategories = categories.filter((c) =>
    c.name.startsWith("行测-")
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        categoryId: form.categoryId ? parseInt(form.categoryId) : null,
      }),
    });
    setLoading(false);
    if (form.section === "shenlun") {
      router.push("/exam/shenlun");
    } else {
      router.push(
        `/exam/xingce/${form.categoryId || 1}`
      );
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-6 md:py-10">
      <h1 className="text-2xl font-extrabold tracking-tight">添加视频</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="text-sm font-semibold">视频标题 *</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="例如：图形推理-位置规律"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold">分区</label>
            <select
              value={form.section}
              onChange={(e) =>
                setForm({ ...form, section: e.target.value, categoryId: "" })
              }
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="xingce">行测</option>
              <option value="shenlun">申论</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold">
              {form.section === "xingce" ? "分类" : "分类（可选）"}
            </label>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: e.target.value })
              }
              className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="">
                {form.section === "shenlun" ? "不限" : "请选择"}
              </option>
              {xingceCategories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name.replace("行测-", "")}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold">讲师 *</label>
          <input
            required
            value={form.instructor}
            onChange={(e) => setForm({ ...form, instructor: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="例如：花生十三"
          />
        </div>

        <div>
          <label className="text-sm font-semibold">视频直链</label>
          <input
            value={form.url}
            onChange={(e) => setForm({ ...form, url: e.target.value })}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
            placeholder="B站 / YouTube / 本地链接"
          />
        </div>

        <fieldset className="rounded-lg border border-border p-4">
          <legend className="text-sm font-semibold px-1">网盘链接（可选）</legend>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">网盘类型</label>
              <select
                value={form.cloudType}
                onChange={(e) => setForm({ ...form, cloudType: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="">不使用网盘</option>
                <option value="baidu">百度网盘</option>
                <option value="aliyun">阿里云盘</option>
                <option value="quark">夸克网盘</option>
                <option value="123pan">123 云盘</option>
                <option value="other">其他网盘</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">网盘分享链接</label>
              <input
                value={form.cloudUrl}
                onChange={(e) => setForm({ ...form, cloudUrl: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="https://pan.baidu.com/s/..."
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">提取码</label>
              <input
                value={form.cloudPassword}
                onChange={(e) => setForm({ ...form, cloudPassword: e.target.value })}
                className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
                placeholder="如：abcd"
              />
            </div>
          </div>
        </fieldset>

        <div>
          <label className="text-sm font-semibold">简介</label>
          <textarea
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            rows={3}
            className="mt-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary resize-none"
            placeholder="视频内容简介..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {loading ? "保存中..." : "保存视频"}
        </button>
      </form>
    </div>
  );
}

export default function VideoNewPage() {
  return (
    <Suspense fallback={<div className="p-10">加载中...</div>}>
      <VideoForm />
    </Suspense>
  );
}
