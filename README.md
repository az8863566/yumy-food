# 甄味 - FlavorGuide 美食指南

一个基于 React Native + Expo 的美食菜谱应用，帮助用户发现、收藏和制作美味菜肴。

## 📱 功能特性

- 🔥 **人气排行榜** - 展示最受欢迎的菜谱
- 📂 **分类浏览** - 按菜系、类型分类查看
- ❤️ **点赞收藏** - 收藏喜欢的菜谱
- 📝 **详细步骤** - 图文并茂的制作教程
- 👤 **个人中心** - 管理收藏和点赞

## 🛠️ 技术栈

| 技术         | 版本     | 说明       |
| ------------ | -------- | ---------- |
| React        | 19.1.0   | 核心框架   |
| React Native | 0.81.5   | 移动端框架 |
| Expo         | ~54.0.33 | 开发工具链 |
| TypeScript   | ~5.9.2   | 类型系统   |

## 📦 安装与运行

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm start
```

### 运行平台

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

## 📁 项目结构

```
yumy-food/
├── src/
│   ├── components/        # UI 组件
│   │   └── RecipeCard.tsx # 菜谱卡片组件
│   ├── types.ts           # TypeScript 类型定义
│   ├── data.ts            # 模拟数据
│   ├── store.tsx          # 状态管理
│   └── views.tsx          # 页面视图
├── App.tsx                # 应用入口
└── package.json
```

## 🎨 设计规范

- 深色主题 (#0a0a0a 背景)
- 主题色: #FF6B6B (珊瑚红)
- 圆角卡片设计
- 底部 Tab 导航

## 📝 开发规范

请参考 [AGENTS.md](./AGENTS.md) 了解详细的开发规范和打包流程。

## 🚀 打包发布

### Expo EAS 打包

```bash
# 安装 EAS CLI
npm install -g eas-cli

# 登录
eas login

# 构建 Android
eas build --platform android --profile preview

# 构建 iOS
eas build --platform ios --profile preview
```

## 📄 License

MIT
