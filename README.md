# SiteForge Next.js 模板

这是 SiteForge 的 JSON 驱动静态网站渲染引擎。

## 架构

- 从 Supabase 的 `page_sections` 表拉取页面 JSON
- 使用组件映射器将 JSON 渲染为 React 组件
- 支持 ISR 增量更新

## 部署

通过 Vercel API 部署，环境变量：
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_PROJECT_ID`
