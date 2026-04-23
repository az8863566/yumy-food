# Yumy-Food 项目开发规范

本项目是一个**高性能跨平台移动端 APP (iOS & Android)**，要求使用 2026 年最新版的 React Native 与 Expo 架构进行开发。当你在本项目中编写、重构或审查代码时，请严格遵循以下开发规范。

## 一、 技术架构 (Technical Architecture)

本项目采用 2026 年最新的 React Native 移动端技术栈，请严格基于以下版本特性生成代码：

### 1.1 核心技术栈

- **核心框架**: React Native 0.83.x + React 19.2+（充分利用 `<Activity>`、`Suspense` 及 `use` Hook 进行性能优化）
- **开发语言**: TypeScript 5.5+（严格模式，禁止隐式 `any`）
- **APP 底座**: Expo SDK 55（全面启用 New Architecture 强制新架构，默认开启 Hermes V1 引擎）
- **路由导航**: Expo Router v7（采用基于文件系统的路由 `app/` 目录，启用底层原生导航栈和 Liquid Glass 底栏特效）
- **UI 与样式**: NativeWind v4（Tailwind CSS 的 React Native 移植版，支持在 RN 中写原子类）+ Expo UI 组件库
- **状态管理**: Zustand 5.0（用于管理用户会话、全局主题、APP 偏好设置）
- **数据请求**: TanStack Query v5 (React Query) + Axios，结合 Expo 的网络状态模块处理弱网/离线情况
- **动画引擎**: React Native Reanimated v3 + 配合 Expo Skia（如需复杂特效）

### 1.2 路由与导航

- 采用 Expo Router v7 进行路由管理，启用底层原生导航栈
- 严格遵守 `src/app/` 目录下的 Expo Router 文件路由约定，所有页面入口文件均放置于该目录层级中
- 底部导航使用原生 Tab 栏配置（Liquid Glass 底栏特效）
- 路由跳转统一使用 `import { router, Link } from 'expo-router'`，页面跳转使用 `router.push('/profile')` 或 `<Link href="/profile">` 语法
- 所有的页面入口文件均不需要书写导航配置代码，导航 UI 由 `_layout.tsx` 全权负责
- 禁止使用传统 `@react-navigation/native` 的 API，不使用 react-navigation 进行手动路由管理
- 禁止在页面组件中手动创建 `Stack.Screen`、`Tab.Screen` 等导航声明，路由注册完全由文件系统约定自动生成

### 1.3 状态管理

- **基础场景**: 采用 `useState` / `useReducer` + `Context API`
- **重度复杂场景**: 引入 Zustand 5.0（如大型表单、复杂数据流、用户会话、全局主题、APP 偏好设置）
- 局部组件状态使用 `useState`，复杂状态逻辑使用 `useReducer`
- 跨组件共享状态使用 `Context API` 提供全局状态

### 1.4 数据请求与缓存

- 必须封装 Axios 实例作为网络请求客户端，提供拦截器、请求/响应转换、自动 JSON 处理
- 必须添加请求拦截器（注入 Token、统一请求头）和响应拦截器（统一错误处理、Token 过期刷新）
- 结合 TanStack Query v5 (React Query) 进行数据缓存和状态管理
- 必须在 api 层统一管理所有 API 接口定义，按业务模块拆分
- 必须将请求逻辑和 UI 状态封装为自定义 Hook，使组件专注于视图渲染
- 禁止跳过拦截器直接发起请求

### 1.5 动画与交互

- 使用 React Native Reanimated v3 进行流畅动画
- 配合 Expo Skia 实现复杂视觉效果（如需）
- 页面跳转利用 Expo Router 的原生过渡效果（Native Stack Transitions）
- 长列表渲染必须使用 `@shopify/flash-list` 或官方最新虚拟列表

### 1.6 网络交互安全

- 环境变量使用 `EXPO_PUBLIC_` 前缀定义，Expo 内置支持，无需额外库
- 敏感信息（如 Token、用户凭证）必须使用 `expo-secure-store` 安全存储，禁止使用 AsyncStorage
- 禁止在组件中直接使用 fetch 或未封装的 Axios

### 1.7 UI 与样式系统

- 必须使用 NativeWind v4 作为样式系统（支持 Tailwind CSS 原子类写法），保证跨平台（iOS/Android/Web）的一致性
- 绝大部分布局应当使用 NativeWind 提供的 `className` 属性（Tailwind 语法）编写，减少繁琐的 `StyleSheet.create`
- 优先使用 Expo UI 组件库提供的组件，仅在无法满足需求时才自定义组件

### 1.8 图标规范

- 必须使用 react-native-vector-icons 作为标准图标库，禁止使用自定义图片替代图标
- 图标使用必须统一从 react-native-vector-icons 导入，保持视觉风格一致

### 1.9 主题与深色模式

- 必须通过 NativeWind 的 `dark:` 前缀或监听 `useColorScheme()` 动态适配深色模式，绝不能写死颜色
- 应用具备出色的深色质感，必须完整支持 light/dark 双主题切换

### 1.10 图片处理

- 必须使用 `expo-image` 组件代替原生 `<Image>`，以获得更快的加载速度、内存缓存以及无缝的占位符加载过渡（BlurHash/Thumbhash）

### 1.11 常量管理

- 所有常量必须汇总到 `src/constants/` 目录中，禁止在组件或业务代码中硬编码
- 常量必须按类型拆分到独立文件：colors.ts（主题色值）、layout.ts（间距、尺寸）、config.ts（App 配置）
- 魔法数字、魔法字符串必须提取为具名常量

### 1.12 TypeScript 规范

- 启用 `strict: true`，严禁使用 `any` 类型
- 接口命名以 `I` 开头（如 `IUser`），类型别名直接使用名称
- 所有 Props 和 State 必须显式定义类型，禁止隐式 any

### 1.13 Hooks 规范

- 自定义 Hook 必须以 `use` 开头（如 `useUserData`）
- `useEffect` 必须提供完整的依赖数组，禁止空依赖导致的无限循环

## 二、 文件层级 (Directory Structure)

本项目采用 Expo Router 的约定式路由目录，结构必须保持高度模块化：

### 2.1 目录结构

```text
yumy-food/
├── .expo/                      # Expo 本地缓存（自动生成，不提交）
├── node_modules/               # 依赖
├── patches/                    # patch-package 修复记录
│
├── assets/                     # 静态资源 (由 Expo 托管)
│   ├── fonts/                  # 字体文件
│   └── images/                 # 图片 (使用 expo-image 加载)
│
├── src/                        # ✨ 主源码目录 (推荐将代码集中在 src 下)
│   │
│   ├── app/                    # 🚀 核心：Expo Router 文件系统路由 (替代原 screens 和 navigation)
│   │   ├── (tabs)/             # 底部导航组
│   │   │   ├── _layout.tsx     # 底部导航栏配置
│   │   │   ├── index.tsx       # 首页页面 (原 screens/Home)
│   │   │   └── profile.tsx     # 我的页面 (原 screens/Profile)
│   │   ├── (auth)/             # 鉴权路由组
│   │   │   ├── sign-in.tsx     # 登录页
│   │   │   └── sign-up.tsx     # 注册页
│   │   ├── _layout.tsx         # 全局根布局 (配置 ThemeProvider, QueryClient, 全局防抖等)
│   │   └── +not-found.tsx      # 全局 404 兜底路由
│   │
│   ├── components/             # 可复用 UI 组件
│   │   ├── ui/                 # 基础无状态 UI (Button, Input, Avatar)
│   │   └── business/           # 业务相关 UI (RecipeCard, PostItem)
│   │
│   ├── api/                    # 网络请求层 (TanStack Query + Axios)
│   │   ├── client.ts           # Axios 实例及拦截器
│   │   └── endpoints/          # 按模块拆分请求 (auth.ts, user.ts)
│   │
│   ├── store/                  # 状态管理 (Zustand)
│   │   ├── useAuthStore.ts     # 替代原来的 AuthContext
│   │   └── useThemeStore.ts    # 替代原来的 ThemeContext
│   │
│   ├── theme/                  # 主题与 NativeWind 配置
│   │   └── global.css          # Tailwind/NativeWind 的全局 CSS 变量定义
│   │
│   ├── hooks/                  # 自定义 Hooks
│   │   └── useDebounce.ts      # 纯逻辑 Hooks
│   │
│   ├── utils/                  # 工具函数
│   │   ├── format.ts           # 数据格式化
│   │   └── storage.ts          # 基于 MMKV 或 SecureStore 的本地存储封装
│   │
│   └── types/                  # 全局 TS 声明 (替代 @types，避免特殊符号命名)
│       └── env.d.ts            
│
├── .env                        # 环境变量
├── .gitignore                  # 🚨 必须在此忽略 /ios 和 /android 目录
├── app.json                    # Expo 核心配置 (应用名、图标、插件配置)
├── babel.config.js             # 包含 NativeWind 和 Reanimated 插件
├── metro.config.js             # Expo Metro 配置
├── tailwind.config.js          # NativeWind 原子类配置文件
├── package.json
└── tsconfig.json               # 需配置 "paths" 支持 "@/*" 绝对路径引入
```

### 2.2 文件组织边界

- 组件文件超过 300 行必须拆分
- 每个目录职责单一，禁止跨层混用（如 components 中写业务逻辑）
- 类型定义集中在 @types 或对应模块的 types.ts 中

### 2.3 App.tsx 职责边界

- App.tsx 是整个应用的根组件，负责全局配置、初始化、路由挂载和状态供给
- 标准结构应仅包含 Provider 嵌套层：StoreProvider → SafeAreaProvider → ExpoRouterRoot（由 `src/app/_layout.tsx` 自动接管路由，无需手动创建 NavigationContainer）
- 禁止在 App.tsx 中编写大量业务逻辑（如数据获取、复杂计算），应放到 screens 或 hooks 中
- 禁止在 App.tsx 中硬编码样式值，应使用 NativeWind 主题系统或 StyleSheet.create 外置
- 禁止在 App.tsx 中直接操作原生模块，初始化应抽离为 services 并在 useEffect 中调用
- 禁止在 App.tsx 中定义路由配置详情，导航布局由 `src/app/_layout.tsx` 全权负责，不再使用 `src/navigation/` 目录

## 三、 代码规范 (Coding Standards)

### 3.1 视图与布局

- 绝大部分布局应当使用 NativeWind 提供的 `className` 属性（Tailwind 语法）编写，减少繁琐的 `StyleSheet.create`
- 处理安全区域时，禁止硬编码 padding，必须使用 `react-native-safe-area-context` 提供的 `useSafeAreaInsets`
- 必须使用 `<KeyboardAvoidingView>` 或 `react-native-keyboard-aware-scroll-view` 处理表单键盘遮挡问题

### 3.2 主题与深色模式

- 必须通过 NativeWind 的 `dark:` 前缀或监听 `useColorScheme()` 动态适配深色模式，绝不能写死颜色
- 应用具备出色的深色质感，必须完整支持 light/dark 双主题切换

### 3.3 图片处理

- 必须使用 `expo-image` 组件代替原生 `<Image>`，以获得更快的加载速度、内存缓存以及无缝的占位符加载过渡（BlurHash/Thumbhash）

### 3.4 组件开发规范

- 必须使用函数式组件 + Hooks，严格禁用 class 组件
- 组件命名采用 PascalCase，文件名必须与组件名保持一致
- 组件需遵循单一职责原则，超过 200 行时必须拆分
- UI 组件必须是无状态的纯展示组件，业务逻辑抽离至 services 层
- 页面组件负责组合 UI 组件和管理本地状态，不包含复杂业务逻辑

### 3.5 性能优化

- 长列表渲染必须使用 `@shopify/flash-list` 或官方最新虚拟列表，严禁在长数据中直接使用 `ScrollView.map`
- 在长列表的 `renderItem` 属性中，严禁直接传入匿名函数，必须使用 `useCallback` 包裹或提取为单独组件
- 数据请求时必须呈现友好的骨架屏 (Skeleton) 或 `ActivityIndicator`，数据为空时要有兜底的 Empty Component

### 3.6 路由使用规范

- 禁用传统的 `react-navigation` 包导入，不使用 react-navigation 进行手动路由管理
- 严格遵守 `src/app/` 目录下的 Expo Router 文件路由约定
- 所有的路由跳转必须使用 `import { router, Link } from 'expo-router'`，采用 `router.push('/profile')` 或 `<Link href="/profile">` 语法
- 所有的页面入口文件均不需要书写导航配置代码，导航 UI 由 `_layout.tsx` 全权负责
- 页面跳转利用原生过渡效果保证丝滑手感

### 3.7 项目边界

**技术边界：**
- 仅限 React Native + Expo 生态，不引入 Web 技术栈
- 状态管理采用 `useState` / `useReducer` + `Context API`，重度复杂场景才引入 Zustand
- 网络请求统一通过封装的 Axios 实例，禁止在组件中直接使用 fetch

**功能边界：**
- UI 组件必须是无状态的纯展示组件，业务逻辑抽离至 services 层
- 页面组件负责组合 UI 组件和管理本地状态，不包含复杂业务逻辑
- API 调用必须在 api 层统一管理，组件中禁止直接写请求逻辑

### 3.8 项目打包

**打包方式：**
- **Expo EAS 打包（推荐）**：使用 `eas build` 命令进行云端构建，支持 Android 和 iOS
- **本地构建**：使用 `npx expo run:android --variant release` 或 `npx expo run:ios --configuration Release`

**构建前检查清单：**
- TypeScript 编译必须无错误（`npx tsc --noEmit`）
- ESLint 检查必须通过（`npx eslint .`）
- 依赖版本必须锁定，检查 package.json 无 `^` 或 `~` 外的版本范围
- 环境变量配置必须完整，`.env` 文件存在且正确

**测试流程：**
1. 开发环境测试：`expo start` 验证基础功能
2. 预发布测试：EAS preview profile 构建真机测试
3. 生产构建：EAS production profile 构建上架包
4. 关键路径验证：登录、核心业务流程、支付等

**质量标准：**
- 应用启动时间 < 3 秒
- 内存占用 < 200MB
- 崩溃率 < 0.1%
- 必须通过 Expo DevTools 性能检测

## 四、 一定要做 (Dos)

### 4.1 组件与类型

- 必须为所有组件定义 Props 类型
- 必须使用 PascalCase 命名组件，文件名与组件名一致
- 必须使用函数式组件 + Hooks 模式
- 必须遵循单一职责原则，及时拆分过大的组件或文件

### 4.2 Hooks 与状态

- 必须在 `useEffect` 中提供完整的依赖数组

### 4.3 网络与安全

- 必须使用封装的 Axios 实例发起网络请求，并配置拦截器
- 必须将 API 接口定义统一在 api 层管理，按业务模块拆分
- 必须使用自定义 Hook 封装请求逻辑和 UI 状态
- 必须使用 `expo-secure-store` 存储敏感信息（Token、凭证等）
- 必须使用 `EXPO_PUBLIC_` 前缀定义环境变量

### 4.4 常量与规范

- 必须将所有常量汇总到 `src/constants/` 目录，按类型拆分文件

### 4.5 UI 与样式

- 必须使用 NativeWind v4 样式系统构建 UI，保证跨平台一致性
- 绝大部分布局使用 NativeWind 的 `className` 属性（Tailwind 语法）编写
- 必须使用 react-native-vector-icons 作为图标库
- 必须使用 `expo-image` 组件代替原生 `<Image>`
- 必须通过 `useColorScheme()` 动态适配深色模式

### 4.6 性能与交互

- 长列表必须使用 `@shopify/flash-list` 或官方最新虚拟列表
- 数据请求时必须呈现骨架屏或加载指示器，数据为空时要有兜底组件
- 表单页面必须处理键盘遮挡问题
- 保证原生丝滑手感：在执行页面跳转或打开弹窗（BottomSheet/Modal）时，利用 Expo Router 的原生过渡效果（Native Stack Transitions）

### 4.7 构建与发布

- 必须在打包前执行 TypeScript 编译检查和 ESLint 检查
- 必须保持目录结构清晰，各层职责分离

## 五、 一定不能做 (Don'ts)

### 5.1 架构与框架

- 禁用 Web 思维与 HTML 标签：严禁出现 `<div>`、`<span>`、`<p>` 等 HTML 标签！文本必须用 `<Text>`，容器必须用 `<View>`，按钮必须用 `<Pressable>` 或 `<TouchableOpacity>`
- 禁止使用已淘汰的老架构工具：严禁使用任何依赖老架构（Bridge）且不再维护的第三方依赖
- 禁用传统的 `react-navigation` 包导入：所有路由跳转必须使用 Expo Router
- 禁止使用 react-navigation 进行手动路由管理：严禁手动创建 `NavigationContainer`、`Stack.Navigator`、`Tab.Navigator`、`Stack.Screen`、`Tab.Screen` 等导航声明
- 禁止在页面入口文件中书写导航配置代码：导航 UI 由 `_layout.tsx` 全权负责，页面文件只负责渲染页面内容
- 禁止使用 class 组件，必须使用函数式组件

### 5.2 类型与规范

- 禁止使用 `any` 类型，所有数据必须有明确类型

### 5.3 业务逻辑与职责

- 禁止在组件中直接写业务逻辑或 API 调用
- 禁止在 App.tsx 中编写大量业务逻辑、硬编码样式、直接操作原生模块、定义路由配置

### 5.4 网络与安全

- 禁止在组件中直接使用 fetch 或未封装的 Axios
- 禁止使用 AsyncStorage 存储敏感信息（Token、密码等）
- 禁止跳过拦截器直接发起请求

### 5.5 Hooks

- 禁止 `useEffect` 缺少依赖数组
- 禁止滥用内联匿名函数：在长列表的 `renderItem` 中，严禁直接传入匿名函数

### 5.6 代码质量

- 禁止在组件或业务代码中硬编码常量（颜色、尺寸、配置值等）
- 禁止使用 NativeWind 以外的样式系统或自定义样式系统
- 禁止使用 react-native-vector-icons 以外的图标方案

### 5.7 构建与发布

- 禁止跳过构建前检查直接打包
- 禁止修改 .expo、android、ios 等自动生成目录的代码
- 禁止将 `.env` 文件提交到版本库
