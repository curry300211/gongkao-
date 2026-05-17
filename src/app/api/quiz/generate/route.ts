import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

const SAMPLE_QUESTIONS = [
  {
    stem: "根据《宪法》规定，我国的国家性质是？",
    options: JSON.stringify([
      { label: "A", text: "社会主义社会" },
      { label: "B", text: "人民民主专政的社会主义国家" },
      { label: "C", text: "人民代表大会制度" },
      { label: "D", text: "民主共和国" },
    ]),
    answer: "B",
    explanation: "《宪法》第一条规定：中华人民共和国是工人阶级领导的、以工农联盟为基础的人民民主专政的社会主义国家。",
    difficulty: "easy" as const,
    questionType: "common_knowledge" as const,
    categoryId: 8,
    points: 1,
  },
  {
    stem: "下列哪项不属于行政行为的特征？",
    options: JSON.stringify([
      { label: "A", text: "从属法律性" },
      { label: "B", text: "裁量性" },
      { label: "C", text: "双方意志性" },
      { label: "D", text: "强制性" },
    ]),
    answer: "C",
    explanation: "行政行为具有单方意志性，而非双方意志性。行政主体实施行政行为，只要在法定权限范围内，无需征得相对方同意。",
    difficulty: "medium" as const,
    questionType: "common_knowledge" as const,
    categoryId: 8,
    points: 1,
  },
  {
    stem: "某商品原价为 200 元，先涨价 20%，再打八折出售，最终售价是多少？",
    options: JSON.stringify([
      { label: "A", text: "188 元" },
      { label: "B", text: "192 元" },
      { label: "C", text: "196 元" },
      { label: "D", text: "200 元" },
    ]),
    answer: "B",
    explanation: "原价200元，涨价20%后为240元，打八折即240×0.8=192元。",
    difficulty: "easy" as const,
    questionType: "quantitative" as const,
    categoryId: 11,
    points: 1,
  },
  {
    stem: "3, 7, 16, 35, 74, (?)",
    options: JSON.stringify([
      { label: "A", text: "135" },
      { label: "B", text: "149" },
      { label: "C", text: "153" },
      { label: "D", text: "161" },
    ]),
    answer: "C",
    explanation: "规律：×2+1, ×2+2, ×2+3, ×2+4, ×2+5。74×2+5=153。",
    difficulty: "medium" as const,
    questionType: "quantitative" as const,
    categoryId: 10,
    points: 1,
  },
  {
    stem: "书籍 : 知识",
    options: JSON.stringify([
      { label: "A", text: "阳光 : 黑暗" },
      { label: "B", text: "食物 : 营养" },
      { label: "C", text: "钢笔 : 墨水" },
      { label: "D", text: "电脑 : 键盘" },
    ]),
    answer: "B",
    explanation: "书籍是知识的载体/来源，食物是营养的载体/来源。二者均为\"载体-承载物\"的关系。",
    difficulty: "easy" as const,
    questionType: "judgment" as const,
    categoryId: 12,
    points: 1,
  },
  {
    stem: "阅读以下文字，回答问题：传统的纸质书阅读与电子书阅读相比，纸质书更有利于深度阅读。研究表明，人们在阅读纸质书时，大脑的认知参与度更高，记忆效果更好。这主要归因于纸质书的物理特性——翻页动作提供了空间线索，帮助大脑建立知识框架。\n\n这段文字主要想说明什么？",
    options: JSON.stringify([
      { label: "A", text: "电子书将逐渐取代纸质书" },
      { label: "B", text: "纸质书阅读更有利于知识记忆" },
      { label: "C", text: "翻页动作是阅读理解的关键" },
      { label: "D", text: "深度阅读需要较高的认知参与度" },
    ]),
    answer: "B",
    explanation: "文段首句即提出观点：纸质书更有利于深度阅读。后续用研究数据支撑这一观点。A选项未提及；C和D是细节，不是主旨。",
    difficulty: "medium" as const,
    questionType: "verbal" as const,
    categoryId: 9,
    points: 1,
  },
  {
    stem: "根据材料分析题：2024年江苏省某市推行了\"一网通办\"政务服务改革。据统计，改革后群众办事平均时间缩短了60%，满意度提升了25个百分点。但同时也出现了部分老年人因不熟悉智能手机操作而无法享受线上服务的问题。\n\n请概括\"一网通办\"改革带来的影响。",
    options: JSON.stringify([
      { label: "A", text: "改革完全成功，没有缺点" },
      { label: "B", text: "办事效率大幅提升，但存在老年人使用障碍" },
      { label: "C", text: "改革只对年轻人有利" },
      { label: "D", text: "应该取消线上服务" },
    ]),
    answer: "B",
    explanation: "材料明确提到两方面：一是正面的效率提升和满意度提高，二是负面问题即老年人存在使用障碍。B选项全面概括了这两方面。",
    difficulty: "medium" as const,
    questionType: "shenlun_summary" as const,
    categoryId: 16,
    points: 2,
  },
  {
    stem: "根据下表回答问题：\n\n2020—2024年江苏省GDP数据\n| 年份 | GDP(万亿元) | 增长率 |\n|------|-------------|--------|\n| 2020 | 10.27 | 3.7% |\n| 2021 | 11.64 | 8.6% |\n| 2022 | 12.29 | 2.8% |\n| 2023 | 12.82 | 5.8% |\n| 2024 | 13.70 | 6.1% |\n\n2024年比2020年GDP增长了多少万亿元？",
    options: JSON.stringify([
      { label: "A", text: "3.43 万亿元" },
      { label: "B", text: "3.06 万亿元" },
      { label: "C", text: "2.43 万亿元" },
      { label: "D", text: "1.43 万亿元" },
    ]),
    answer: "A",
    explanation: "13.70 - 10.27 = 3.43 万亿元。直接从表格中取2024年和2020年的数据相减即可。",
    difficulty: "easy" as const,
    questionType: "data_analysis" as const,
    categoryId: 16,
    points: 1,
  },
];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { categoryIds, count = 10, mode = "question_by_question" } = body;

  // Try DB first, use sample data if empty
  let dbQuestions = await db.question.findMany({
    where: categoryIds ? { categoryId: { in: categoryIds } } : {},
    take: count,
    orderBy: { createdAt: "desc" },
  });

  // If no questions in DB, seed with samples
  if (dbQuestions.length === 0) {
    for (const q of SAMPLE_QUESTIONS) {
      await db.question.create({ data: q });
    }
    dbQuestions = await db.question.findMany({ take: count });
  }

  const now = new Date();
  const timeLimitSec =
    mode === "mock_exam" ? 7200 : mode === "paper_gen" ? 3600 : null;

  const session = await db.testSession.create({
    data: {
      userId: "default",
      mode: mode as "question_by_question" | "paper_gen" | "mock_exam",
      totalQuestions: dbQuestions.length,
      totalScore: dbQuestions.reduce((s, q) => s + q.points, 0),
      timeLimitSec,
      questions: {
        create: dbQuestions.map((q, i) => ({
          questionId: q.id,
          sortOrder: i,
        })),
      },
    },
  });

  const questions = dbQuestions.map((q) => ({
    questionId: q.id,
    stem: q.stem,
    options: JSON.parse(q.options),
    answer: q.answer,
    explanation: q.explanation,
    points: q.points,
  }));

  return NextResponse.json({
    sessionId: session.id,
    questions,
    totalQuestions: questions.length,
    totalScore: session.totalScore,
    timeLimitSec,
  });
}
