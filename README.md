# JSExam — 江苏省考备考学习平台

江苏省公务员考试备考学习平台，支持行测/申论刷题、视频学习、错题本、数据分析。

## 技术栈

- **前端**: Next.js 16 + React 19 + Tailwind CSS 4 + shadcn/ui
- **数据库**: Prisma 6 + SQLite（开发）/ PostgreSQL（生产）
- **状态管理**: Zustand
- **图表**: Recharts

## 本地开发

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

浏览器打开 http://localhost:3000

## Docker 部署

```bash
docker compose up -d
```

首次部署后进入容器初始化：

```bash
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma db seed
```

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `DATABASE_URL` | 数据库连接 | `file:/data/prod.db` |
| `ADMIN_PASSWORD` | 管理密码 | `changeme` |

## 功能

- **刷题系统**: 三种模式（逐题/组卷/模考）、键盘快捷键、即时反馈
- **错题本**: 自动收录、重做消灭、筛选
- **数据分析**: 学习热力图、模块掌握度雷达图、时长统计、薄弱点分析
- **每日一题**: 每天随机推送
- **成就系统**: 8 个徽章自动解锁
- **暗色模式**: 支持浅色/深色/跟随系统
- **移动端适配**: 底部导航栏、响应式布局
