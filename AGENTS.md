# Yumy-Food 项目开发规范

## 1. 技术架构

### 核心技术栈

- **React**: 19.1.0（核心框架）
- **React Native**: 0.81.5（移动端框架）
- **Expo**: ~54.0.33（开发工具链）
- **TypeScript**: ~5.9.2（类型系统）
- **@types/react**: ~19.1.0（React 类型定义）
- **Tamagui**: UI 组件库（保证跨平台一致性）
- **react-native-vector-icons**: 标准图标库

### React 使用规范

- 必须使用函数式组件 + Hooks，严格禁用 class 组件
- 组件命名采用 PascalCase，文件名必须与组件名保持一致
- 组件需遵循单一职责原则，超过 200 行时必须拆分

### 状态管理规范

- 采用 `useState` / `useReducer` + `Context API` 作为核心状态管理方案
- 局部组件状态使用 `useState`，复杂状态逻辑使用 `useReducer`
- 跨组件共享状态使用 `Context API` 提供全局状态
- 重度复杂场景（如大型表单、复杂数据流）才考虑引入 Zustand 或 Redux

### Hooks 规范

- 自定义 Hook 必须以 `use` 开头（如 `useUserData`）
- `useEffect` 必须提供完整的依赖数组，禁止空依赖导致的无限循环

### TypeScript 规范

- 启用 `strict: true`，严禁使用 `any` 类型
- 接口命名以 `I` 开头（如 `IUser`），类型别名直接使用名称
- 所有 Props 和 State 必须显式定义类型，禁止隐式 any

### 网络交互规范

- 环境变量使用 `EXPO_PUBLIC_` 前缀定义（如 `EXPO_PUBLIC_API_BASE_URL`），Expo 内置支持，无需额外库
- 必须封装 Axios 实例作为网络请求客户端，提供拦截器、请求/响应转换、自动 JSON 处理等功能
- 必须添加请求拦截器（注入 Token、统一请求头）和响应拦截器（统一错误处理、Token 过期刷新）
- 必须在 api 层统一管理所有 API 接口定义，按业务模块拆分（如 auth.ts、user.ts）
- 必须将请求逻辑和 UI 状态封装为自定义 Hook（如 `useUserData`），使组件专注于视图渲染
- 敏感信息（如 Token、用户凭证）必须使用 `expo-secure-store` 安全存储，禁止使用 AsyncStorage

### 常量管理规范

- 所有常量必须汇总到 `src/constants/` 目录中，禁止在组件或业务代码中硬编码
- 常量必须按类型拆分到独立文件：colors.ts（主题色值）、layout.ts（间距、尺寸）、config.ts（App 配置）
- 魔法数字、魔法字符串必须提取为具名常量，提升代码可读性和可维护性

### UI 与图标规范

- 必须使用 Tamagui 作为 UI 组件库，保证跨平台（iOS/Android/Web）的一致性
- 必须使用 react-native-vector-icons 作为标准图标库，禁止使用自定义图片替代图标
- 优先使用 Tamagui 提供的组件，仅在无法满足需求时才自定义组件
- 图标使用必须统一从 react-native-vector-icons 导入，保持视觉风格一致

## 2. 项目结构

```
app/
├── .expo/                      # Expo 本地缓存（自动生成，不提交）
├── android/                    # 原生 Android 工程（React Native CLI）
├── ios/                        # 原生 iOS 工程（React Native CLI）
├── node_modules/               # 依赖
├── patches/                    # patch-package 修复记录
│
├── assets/                     # 静态资源
│   ├── fonts/                  # 字体文件 (.ttf, .otf)
│   ├── images/                 # 图片资源 (.png, .jpg)
│   └── icons/                  # 图标集
│
├── src/                        # 主源码目录
│   ├── @types/                 # 全局类型声明
│   │   ├── navigation.d.ts     # 导航参数类型
│   │   ├── env.d.ts            # 环境变量类型
│   │   └── assets.d.ts         # 图片模块声明
│   │
│   ├── api/                    # 网络请求层
│   │   ├── client.ts           # Axios 实例、拦截器
│   │   ├── endpoints/          # 按业务拆分 API
│   │   │   ├── auth.ts
│   │   │   └── user.ts
│   │   └── types.ts            # API 返回类型定义
│   │
│   ├── components/             # 可复用 UI 组件（无业务逻辑）
│   │   ├── Button/
│   │   │   ├── index.tsx
│   │   │   └── styles.ts
│   │   ├── Input/
│   │   └── index.ts            # 统一导出
│   │
│   ├── constants/              # 常量定义
│   │   ├── colors.ts           # 主题色值
│   │   ├── layout.ts           # 间距、尺寸
│   │   └── config.ts           # App 配置
│   │
│   ├── hooks/                  # 自定义 Hooks
│   │   ├── useAppDispatch.ts
│   │   ├── useAppSelector.ts
│   │   └── useDebounce.ts
│   │
│   ├── navigation/             # 路由配置
│   │   ├── RootNavigator.tsx   # 根导航
│   │   ├── AppStack.tsx        # 主业务栈
│   │   ├── AuthStack.tsx       # 认证栈
│   │   └── types.ts            # 路由参数列表
│   │
│   ├── screens/                # 页面组件（业务容器）
│   │   ├── Home/
│   │   │   ├── index.tsx
│   │   │   ├── components/     # 页面私有组件
│   │   │   │   └── PostItem.tsx
│   │   │   └── styles.ts
│   │   ├── Profile/
│   │   └── index.ts
│   │
│   ├── services/               # 业务逻辑 / 第三方服务封装
│   │   ├── auth.service.ts
│   │   ├── storage.service.ts  # AsyncStorage 封装
│   │   └── analytics.service.ts
│   │
│   ├── store/                  # 状态管理（Context API + useReducer）
│   │   ├── AuthContext.tsx     # 认证状态 Context
│   │   ├── ThemeContext.tsx    # 主题状态 Context
│   │   └── hooks.ts            # 状态管理自定义 Hooks
│   │
│   ├── theme/                  # 主题系统（Tamagui 配置）
│   │   ├── index.ts            # Tamagui 主题配置
│   │   ├── tokens.ts           # 设计 Token（颜色、间距、字体）
│   │   └── themes.ts           # 主题变体（light/dark）
│   │
│   ├── utils/                  # 工具函数
│   │   ├── formatDate.ts
│   │   ├── validators.ts
│   │   └── permissions.ts
│   │
│   └── App.tsx                 # App 入口组件（Expo 下常为根文件）
│
├── .env                        # 环境变量（不提交）
├── .env.example                # 环境变量模板
├── .eslintrc.js                # ESLint 配置
├── .prettierrc                 # Prettier 配置
├── app.json                    # Expo 配置
├── babel.config.js             # Babel 配置（含 module-resolver）
├── metro.config.js             # Metro 打包配置
├── package.json
├── tsconfig.json               # TypeScript 配置
└── index.js                    # 原生 CLI 的入口（Expo 下为 App.tsx 直接启动）
```

## 3. 项目打包

### 打包方式

- **Expo EAS 打包（推荐）**：使用 `eas build` 命令进行云端构建，支持 Android 和 iOS
- **本地构建**：使用 `npx expo run:android --variant release` 或 `npx expo run:ios --configuration Release`

### 构建前检查清单

- TypeScript 编译必须无错误（`npx tsc --noEmit`）
- ESLint 检查必须通过（`npx eslint .`）
- 依赖版本必须锁定，检查 package.json 无 `^` 或 `~` 外的版本范围
- 环境变量配置必须完整，`.env` 文件存在且正确

### 测试流程

1. 开发环境测试：`expo start` 验证基础功能
2. 预发布测试：EAS preview profile 构建真机测试
3. 生产构建：EAS production profile 构建上架包
4. 关键路径验证：登录、核心业务流程、支付等

### 质量标准

- 应用启动时间 < 3 秒
- 内存占用 < 200MB
- 崩溃率 < 0.1%
- 必须通过 Expo DevTools 性能检测

## 4. 项目边界

### 技术边界

- 仅限 React Native + Expo 生态，不引入 Web 技术栈
- 状态管理采用 `useState` / `useReducer` + `Context API`，重度复杂场景才引入 Redux/Zustand
- 网络请求统一通过封装的 Axios 实例，禁止在组件中直接使用 fetch

### 功能边界

- UI 组件必须是无状态的纯展示组件，业务逻辑抽离至 services 层
- 页面组件负责组合 UI 组件和管理本地状态，不包含复杂业务逻辑
- API 调用必须在 api 层统一管理，组件中禁止直接写请求逻辑

### 文件组织边界

- 组件文件超过 300 行必须拆分
- 每个目录职责单一，禁止跨层混用（如 components 中写业务逻辑）
- 类型定义集中在 @types 或对应模块的 types.ts 中

### App.tsx 职责边界

- App.tsx 是整个应用的根组件，负责全局配置、初始化、路由挂载和状态供给
- 标准结构应仅包含 Provider 嵌套层：TamaguiProvider → StoreProvider → SafeAreaProvider → NavigationContainer → RootNavigator
- 禁止在 App.tsx 中编写大量业务逻辑（如数据获取、复杂计算），应放到 screens 或 hooks 中
- 禁止在 App.tsx 中硬编码样式值，应使用 Tamagui 主题系统或 StyleSheet.create 外置
- 禁止在 App.tsx 中直接操作原生模块，初始化应抽离为 services 并在 useEffect 中调用
- 禁止在 App.tsx 中定义路由配置详情，导航器应在 src/navigation/ 目录内独立维护

## 5. 一定不能做

- 禁止使用 class 组件，必须使用函数式组件
- 禁止使用 `any` 类型，所有数据必须有明确类型
- 禁止在组件中直接写业务逻辑或 API 调用
- 禁止在 App.tsx 中编写大量业务逻辑、硬编码样式、直接操作原生模块、定义路由配置
- 禁止 `useEffect` 缺少依赖数组
- 禁止跳过构建前检查直接打包
- 禁止修改 .expo、android、ios 等自动生成目录的代码
- 禁止将 `.env` 文件提交到版本库
- 禁止在组件中直接使用 fetch 或未封装的 Axios
- 禁止使用 AsyncStorage 存储敏感信息（Token、密码等）
- 禁止跳过拦截器直接发起请求
- 禁止在组件或业务代码中硬编码常量（颜色、尺寸、配置值等）
- 禁止使用 Tamagui 以外的 UI 库或自定义样式系统
- 禁止使用 react-native-vector-icons 以外的图标方案

## 6. 一定要做

- 必须为所有组件定义 Props 类型
- 必须使用 PascalCase 命名组件，文件名与组件名一致
- 必须在 `useEffect` 中提供完整的依赖数组
- 必须在打包前执行 TypeScript 编译检查和 ESLint 检查
- 必须保持目录结构清晰，各层职责分离
- 必须使用函数式组件 + Hooks 模式
- 必须遵循单一职责原则，及时拆分过大的组件或文件
- 必须使用封装的 Axios 实例发起网络请求，并配置拦截器
- 必须将 API 接口定义统一在 api 层管理，按业务模块拆分
- 必须使用自定义 Hook 封装请求逻辑和 UI 状态
- 必须使用 `expo-secure-store` 存储敏感信息（Token、凭证等）
- 必须使用 `EXPO_PUBLIC_` 前缀定义环境变量
- 必须将所有常量汇总到 `src/constants/` 目录，按类型拆分文件
- 必须使用 Tamagui 组件库构建 UI，保证跨平台一致性
- 必须使用 react-native-vector-icons 作为图标库
