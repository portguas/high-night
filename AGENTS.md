# 项目协作约定（AGENTS）

## 回答
- 所有回答使用中文

## 项目类型
- Vue 3 + uni-app 小程序项目
- UI 组件与库优先使用 uni-app 官方提供的组件与能力
- 使用dart-sass

## 开发与运行
- 安装依赖：`pnpm install` 或 `npm install`
- 本地启动：`pnpm dev` 或 `npm run dev`
- 构建发布：`pnpm build` 或 `npm run build`

## 代码约定
- 遵循现有代码结构与风格，尽量少改动无关文件
- 新增功能优先复用现有组件与公共方法
- 组件与页面保持轻量，避免在页面中堆积复杂逻辑
- 使用 Vue 3 `<script setup>` 语法组织页面与组件逻辑

## UI 约定
- 优先使用 `uni-` 组件（如 `uni-button`、`uni-list`、`uni-popup`）
- 若需第三方库，请先确认与 uni-app 兼容并说明原因

## 变更与沟通
- 修改前先确认需求与范围，避免大规模重构
- 关键改动请附简要说明与测试建议
