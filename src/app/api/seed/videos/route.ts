import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// Category ID mapping:
// 7=政治理论 8=常识判断 9=言语理解 10=数字推理
// 11=数学运算 12=类比推理 13=图形推理 14=逻辑判断
// 15=定义判断 16=资料分析

const SEED_VIDEOS = [
  // ---- 言语理解 (9) ----
  {
    title: "言语理解与表达-片段阅读精讲",
    url: "https://www.bilibili.com/video/BV1example1",
    instructor: "花生十三",
    description: "片段阅读核心技巧：主旨题、意图题、细节题解题方法",
    section: "xingce" as const,
    categoryId: 9,
    sortOrder: 1,
  },
  {
    title: "言语理解-选词填空专项突破",
    url: "https://www.bilibili.com/video/BV1example2",
    instructor: "粉笔公考",
    description: "语境分析+词语辨析，提升选词填空正确率",
    section: "xingce" as const,
    categoryId: 9,
    sortOrder: 2,
  },
  // ---- 数字推理 (10) ----
  {
    title: "数字推理-基础数列与特征数列",
    url: "https://www.bilibili.com/video/BV1example3",
    instructor: "刘文超",
    description: "等差数列、等比数列、幂次数列、递推数列全解析",
    section: "xingce" as const,
    categoryId: 10,
    sortOrder: 1,
  },
  // ---- 数学运算 (11) ----
  {
    title: "数学运算-行程问题与工程问题",
    url: "https://www.bilibili.com/video/BV1example4",
    instructor: "花生十三",
    description: "比例法、赋值法在行程和工程问题中的应用",
    section: "xingce" as const,
    categoryId: 11,
    sortOrder: 1,
  },
  {
    title: "数学运算-排列组合与概率",
    url: "https://www.bilibili.com/video/BV1example5",
    instructor: "齐麟",
    description: "捆绑法、插空法、隔板法经典题型精讲",
    section: "xingce" as const,
    categoryId: 11,
    sortOrder: 2,
  },
  // ---- 类比推理 (12) ----
  {
    title: "类比推理-常见逻辑关系梳理",
    url: "https://www.bilibili.com/video/BV1example6",
    instructor: "聂佳",
    description: "全同、包含、交叉、并列、对应、因果等关系辨析",
    section: "xingce" as const,
    categoryId: 12,
    sortOrder: 1,
  },
  // ---- 图形推理 (13) ----
  {
    title: "图形推理-位置规律与样式规律",
    url: "https://www.bilibili.com/video/BV1example7",
    instructor: "龙龙",
    description: "平移、旋转、翻转、对称、叠加等核心考点",
    section: "xingce" as const,
    categoryId: 13,
    sortOrder: 1,
  },
  {
    title: "图形推理-数量规律与空间重构",
    url: "https://www.bilibili.com/video/BV1example8",
    instructor: "粉笔公考",
    description: "点、线、面、角的数量规律及六面体展开图",
    section: "xingce" as const,
    categoryId: 13,
    sortOrder: 2,
  },
  // ---- 逻辑判断 (14) ----
  {
    title: "逻辑判断-翻译推理与真假推理",
    url: "https://www.bilibili.com/video/BV1example9",
    instructor: "聂佳",
    description: "前推后、后推前、且/或关系，矛盾关系的运用",
    section: "xingce" as const,
    categoryId: 14,
    sortOrder: 1,
  },
  {
    title: "逻辑判断-加强削弱题型",
    url: "https://www.bilibili.com/video/BV1example10",
    instructor: "花生十三",
    description: "搭桥、补充论据、因果倒置等加强削弱方法",
    section: "xingce" as const,
    categoryId: 14,
    sortOrder: 2,
  },
  // ---- 定义判断 (15) ----
  {
    title: "定义判断-关键词提取法",
    url: "https://www.bilibili.com/video/BV1example11",
    instructor: "粉笔公考",
    description: "主体、客体、条件、结果等关键要素快速定位",
    section: "xingce" as const,
    categoryId: 15,
    sortOrder: 1,
  },
  // ---- 资料分析 (16) ----
  {
    title: "资料分析-速算技巧大全",
    url: "https://www.bilibili.com/video/BV1example12",
    instructor: "花生十三",
    description: "截位直除、特征数字法、差分法、十字交叉法",
    section: "xingce" as const,
    categoryId: 16,
    sortOrder: 1,
  },
  {
    title: "资料分析-增长率与比重问题",
    url: "https://www.bilibili.com/video/BV1example13",
    instructor: "刘文超",
    description: "同比环比、基期现期、比重变化与平均数增长",
    section: "xingce" as const,
    categoryId: 16,
    sortOrder: 2,
  },
  // ---- 政治理论 (7) ----
  {
    title: "政治理论-时政热点梳理",
    url: "https://www.bilibili.com/video/BV1example14",
    instructor: "粉笔公考",
    description: "最新时政热点、重要会议精神、政策文件解读",
    section: "xingce" as const,
    categoryId: 7,
    sortOrder: 1,
  },
  // ---- 常识判断 (8) ----
  {
    title: "常识判断-科技与人文常识",
    url: "https://www.bilibili.com/video/BV1example15",
    instructor: "粉笔公考",
    description: "物理化学基础、生物常识、文学历史高频考点",
    section: "xingce" as const,
    categoryId: 8,
    sortOrder: 1,
  },
  // ---- 申论 ----
  {
    title: "申论-概括题高分技巧",
    url: "https://www.bilibili.com/video/BV1shenlun1",
    instructor: "张小龙",
    description: "材料阅读方法、要点提取、归纳概括的三步法",
    section: "shenlun" as const,
    categoryId: null,
    sortOrder: 1,
  },
  {
    title: "申论-对策题解题思路",
    url: "https://www.bilibili.com/video/BV1shenlun2",
    instructor: "张小龙",
    description: "问题分析→原因追溯→对策提出的逻辑框架",
    section: "shenlun" as const,
    categoryId: null,
    sortOrder: 2,
  },
  {
    title: "申论-大作文写作模板",
    url: "https://www.bilibili.com/video/BV1shenlun3",
    instructor: "粉笔公考",
    description: "五段三分式结构、开头结尾技巧、分论点展开方法",
    section: "shenlun" as const,
    categoryId: null,
    sortOrder: 3,
  },
  {
    title: "申论-公文写作格式规范",
    url: "https://www.bilibili.com/video/BV1shenlun4",
    instructor: "花生十三",
    description: "通知、报告、倡议书、讲话稿等常见公文格式",
    section: "shenlun" as const,
    categoryId: null,
    sortOrder: 4,
  },
];

export async function POST() {
  // Clear existing videos first
  await db.video.deleteMany();

  let count = 0;
  for (const v of SEED_VIDEOS) {
    await db.video.create({ data: v });
    count++;
  }

  return NextResponse.json({
    ok: true,
    added: count,
    message: `已添加 ${count} 个视频，涵盖行测10个模块 + 申论，包含花生十三、刘文超、聂佳、张小龙、粉笔公考、龙龙、齐麟等讲师`,
  });
}
