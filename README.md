# high-night

Vue 3 + uni-app 小程序项目。

## 环境要求
- Node.js（建议 LTS 版本）
- npm 或 pnpm

## 安装依赖
```bash
npm install
# 或
pnpm install
```

## 本地开发
```bash
# H5
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin
```

## 构建发布
```bash
# H5
npm run build:h5

# 微信小程序
npm run build:mp-weixin
```

## 其他脚本
```bash
npm run type-check
```

## 约定
- UI 组件与库优先使用 uni-app 官方组件与能力
- 遵循现有目录与代码风格，避免无关改动

## 目录结构
- `src/` 业务源码
