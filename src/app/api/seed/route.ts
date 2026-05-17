import { NextResponse } from "next/server";
import { db } from "@/lib/db";

const categories = [
  { name: "AI 学习笔记", slug: "ai-notes", description: "人工智能、机器学习、深度学习的学习记录" },
  { name: "阅读 & 观影", slug: "reading", description: "读书笔记、电影观后感" },
  { name: "文章收藏", slug: "articles", description: "优质文章链接与摘要" },
  { name: "思考 & 随笔", slug: "thoughts", description: "个人思考、项目复盘、生活随笔" },
  { name: "江苏省考", slug: "js-exam", description: "江苏省公务员考试备考资料与笔记" },
  { name: "未分类", slug: "uncategorized", description: "暂未归类的知识条目" },
  { name: "行测-政治理论", slug: "xingce-politics", description: "党的创新理论及党和国家方针政策" },
  { name: "行测-常识判断", slug: "xingce-common-knowledge", description: "自然科学、社会科学应知应会知识" },
  { name: "行测-言语理解", slug: "xingce-verbal", description: "片段阅读、文章阅读、选词填空" },
  { name: "行测-数字推理", slug: "xingce-number-reasoning", description: "数字序列规律推理" },
  { name: "行测-数学运算", slug: "xingce-math", description: "数据关系的分析、推理、运算" },
  { name: "行测-类比推理", slug: "xingce-analogy", description: "语词概念的类比推理" },
  { name: "行测-图形推理", slug: "xingce-figure-reasoning", description: "图形规律与空间推理" },
  { name: "行测-逻辑判断", slug: "xingce-logic", description: "逻辑推理与论证分析" },
  { name: "行测-定义判断", slug: "xingce-definition", description: "概念定义的理解与判断" },
  { name: "行测-资料分析", slug: "xingce-data-analysis", description: "文字、图表资料的综合分析" },
];

const achievements = [
  { key: "streak_3", name: "初露锋芒", description: "连续学习 3 天", icon: "🔥", condition: '{"type":"streak","target":3}' },
  { key: "streak_7", name: "坚持不懈", description: "连续学习 7 天", icon: "🔥", condition: '{"type":"streak","target":7}' },
  { key: "streak_30", name: "学霸养成", description: "连续学习 30 天", icon: "💪", condition: '{"type":"streak","target":30}' },
  { key: "questions_100", name: "百题斩", description: "累计刷题 100 道", icon: "⚔️", condition: '{"type":"total_questions","target":100}' },
  { key: "questions_500", name: "题海勇士", description: "累计刷题 500 道", icon: "🛡️", condition: '{"type":"total_questions","target":500}' },
  { key: "questions_1000", name: "千题霸主", description: "累计刷题 1000 道", icon: "👑", condition: '{"type":"total_questions","target":1000}' },
  { key: "perfect_score", name: "满分达成", description: "单次练习正确率 100%", icon: "⭐", condition: '{"type":"perfect_score","target":1}' },
  { key: "accuracy_80", name: "稳定发挥", description: "累计正确率达到 80%", icon: "🎯", condition: '{"type":"accuracy","target":80}' },
];

async function seedCategories() {
  let count = 0;
  for (const cat of categories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
    count++;
  }
  return count;
}

async function seedAchievements() {
  let count = 0;
  for (const a of achievements) {
    await db.achievement.upsert({
      where: { key: a.key },
      update: a,
      create: a,
    });
    count++;
  }
  return count;
}

export async function POST() {
  try {
    const cats = await seedCategories();
    const achis = await seedAchievements();
    return NextResponse.json({
      ok: true,
      categories: cats,
      achievements: achis,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
