# 项目协作约定（AGENTS）

## 回答
- 所有回答使用中文
- 改动原则: 遵循“最小改动”原则，严禁为了个人喜好进行无意义的重构；新增功能优先复用 hooks 和 components。

## 项目类型
- Vue 3 + uni-app 小程序项目
- UI 组件与库优先使用 uni-app 官方提供的组件与能力
- 使用dart-sass

## 布局
- 原则: 所有页面和组件布局必须优先使用 Flex 布局，禁止使用 float。

- 容器控制: 习惯性使用 display: flex;，并通过 justify-content 和 align-items 处理对齐。

- 自适应: 移动端适配优先使用 rpx，需固定尺寸或字体时使用 px。

## SCSS 实践
- 嵌套层级: 避免超过 3 层嵌套，防止样式权重过高。
- 变量复用: 颜色、圆角、间距等需引用项目定义的全局变量（如 uni.scss）。
- BEM 命名: 推荐使用简化的 BEM (例如 .user-card__avatar--active)。

## 开发与运行
- 安装依赖：`pnpm install` 或 `npm install`
- 本地启动：`pnpm dev` 或 `npm run dev`
- 构建发布：`pnpm build` 或 `npm run build`

## 代码约定
- 遵循现有代码结构与风格，尽量少改动无关文件
- 新增功能优先复用现有组件与公共方法
- 组件与页面保持轻量，避免在页面中堆积复杂逻辑
- 使用 Vue 3 `<script setup>` 语法组织页面与组件逻辑
- 响应式声明: 优先使用 ref 定义基本类型，reactive 定义复杂的对象集合。
- API 调用: 优先使用 uni.xxx 异步 API，并配合 async/await 处理异步逻辑。

## UI 约定
- 优先使用 `uni-` 组件（如 `uni-button`、`uni-list`、`uni-popup`）
- 若需第三方库，请先确认与 uni-app 兼容并说明原因
- 生命周期: 页面级逻辑优先使用 onLoad / onShow，组件级逻辑使用 onMounted。
- 底部适配: 针对全面屏，需在页面底部处理 safe-area-inset-bottom 安全区域。

## 变更与沟通
- 修改前先确认需求与范围，避免大规模重构
- 关键改动请附简要说明与测试建议
