# Yumy-Food AGENTS.md 规范升级计划

## 当前已完成项
- ✅ 依赖更新：expo-router, nativewind, tanstack query, zustand, expo-image, react-native-vector-icons 等
- ✅ NativeWind v4 配置文件：tailwind.config.js, global.css, metro.config.js, babel.config.js
- ✅ Expo Router v7：app.json, index.ts, tsconfig.json, src/app/ 目录结构
- ✅ 全局根布局：src/app/_layout.tsx（SafeAreaProvider + QueryClientProvider + AppProvider + Stack）
- ✅ Tab 导航：src/app/(tabs)/_layout.tsx
- ✅ 页面迁移：index.tsx, categories.tsx, profile.tsx, recipe/[id].tsx
- ✅ 清理旧系统：删除 MainNavigator.tsx、screens/ 目录
- ✅ 双主题：colors.ts（lightTheme/darkTheme）、theme/index.ts（useAppTheme）
- ✅ ErrorBoundary 函数式重构（react-error-boundary）
- ✅ API 客户端类型安全（client.ts 消除 any）
- ✅ 图标库统一（@expo/vector-icons → react-native-vector-icons）
- ✅ 图片组件替换（原生 Image → expo-image）
- ✅ +not-found.tsx 全局 404 兜底

---

## 待执行任务

### Phase 1: NativeWind 样式迁移（核心）

将 5 个核心文件的 `StyleSheet.create` 全部替换为 NativeWind `className`，使用 Tailwind 原子类编写布局。

- **P1-1**: `src/app/(tabs)/index.tsx` StyleSheet → className（328 行，含骨架屏和快捷分类）
- **P1-2**: `src/app/(tabs)/categories.tsx` StyleSheet → className（353 行，含侧边栏+子分类详情）
- **P1-3**: `src/app/(tabs)/profile.tsx` StyleSheet → className（377 行，含 Tab 切换和评论卡片）
- **P1-4**: `src/app/recipe/[id].tsx` StyleSheet → className（362 行，含步骤和评论）
- **P1-5**: `src/components/RecipeCard.tsx` StyleSheet → className（208 行）

> 注意：保留 COLORS/SPACING 常量引用，通过 `style={{ color: COLORS.primary }}` 处理动态条件样式，其余静态样式全部 className 化。

### Phase 2: 组件拆分（单一职责）

AGENTS.md 要求超过 200 行必须拆分。当前超标文件：

- **P2-1**: 拆分 `categories.tsx`
  - 提取 `SubCategoryDetail`（子分类详情视图）→ `src/app/(tabs)/components/SubCategoryDetail.tsx`
  - 提取 `Sidebar`（左侧父分类导航）→ `src/components/business/CategorySidebar.tsx`
  - 主文件保留左右布局骨架
- **P2-2**: 拆分 `profile.tsx`
  - 提取 `CommentCard`（评论卡片）→ `src/components/business/CommentCard.tsx`
  - 提取 `AuthPrompt`（未登录状态）→ `src/components/business/AuthPrompt.tsx`
  - 提取 `ProfileTabBar`（Tab 切换栏）→ `src/components/business/ProfileTabBar.tsx`
- **P2-3**: 拆分 `recipe/[id].tsx`
  - 提取 `IngredientList`、`StepList`、`CommentList` → `src/components/business/` 下
  - 提取 `RecipeHeader`（顶部图片+操作按钮）

### Phase 3: Zustand 状态管理（重度场景）

AGENTS.md 要求用户会话、全局主题等重度场景使用 Zustand 5.0。

- **P3-1**: 创建 `src/store/useAuthStore.ts`
  - 迁移 AuthContext 全部状态：currentUser, isAuthLoading, showAuthModal, pendingAction
  - 迁移 loginAsync, registerAsync, logout, initAuth 逻辑
  - 继续使用 expo-secure-store 存储 Token
- **P3-2**: 创建 `src/store/useThemeStore.ts`
  - 管理当前 theme 模式（light/dark/system）
  - 替代 AppProvider 中的主题相关逻辑（如有）
- **P3-3**: 全局 Context → Zustand 替换
  - 所有 `useAuthContext()` 改为 `useAuthStore()`
  - 从 AppProvider 中移除 AuthProvider 嵌套
  - 保留 NavigationContext（基础场景，符合规范）

### Phase 4: TanStack Query 重构（数据层）

当前 hooks 直接调用 API，未使用 useQuery/useMutation 缓存。

- **P4-1**: 重构 `src/hooks/useRecipes.ts` → `useQuery({ queryKey: ['recipes'], queryFn: ... })`
- **P4-2**: 重构 `src/hooks/useCategories.ts` → useQuery
- **P4-3**: 重构 `src/hooks/useRecipeDetail.ts` → useQuery
- **P4-4**: 重构 `src/hooks/useSearchRecipes.ts` → useQuery + debounce
- **P4-5**: 重构 `src/hooks/useUserInteraction.ts` / `useMyComments.ts` → useQuery
- **P4-6**: 重构 RecipeContext 中的 toggleLike/toggleFavorite/addComment → useMutation
  - 乐观更新通过 mutate + onSuccess/onError 处理
  - RecipeContext 可以大幅简化或移除

### Phase 5: FlashList 虚拟化（性能）

AGENTS.md 严禁长数据中使用 `ScrollView.map`。

- **P5-1**: `categories.tsx` 子分类详情中的菜谱列表 `ScrollView.map` → `FlashList`
- **P5-2**: `profile.tsx` 收藏列表和评价列表 → `FlashList`
- **P5-3**: `recipe/[id].tsx` 评论列表 → `FlashList`
- **P5-4**: `index.tsx` 人气榜和推荐列表（如有长数据风险）→ `FlashList`

### Phase 6: 类型安全与规范扫尾

- **P6-1**: 目录迁移：`src/@types/` → `src/types/`
  - 更新所有 `import type { ... } from '@/@types'` → `'@/types'`
  - 更新 `tsconfig.json` paths（如有 `@types` 别名）
- **P6-2**: 接口命名加 `I` 前缀
  - `ThemeColors` → `IThemeColors`
  - `BackendErrorResponse` → `IBackendErrorResponse`
  - `ApiError` → `IApiError`
  - `RecipeCardProps` → `IRecipeCardProps` 等
- **P6-3**: 消除剩余 `any`
  - `AuthContext.tsx` 第 79、115 行 `catch (error: any)` → 使用 `unknown` + 类型收窄
- **P6-4**: 清理 `tsconfig.json` 中过时的 `@screens/*` 路径别名

### Phase 7: 构建前检查与验证

- **P7-1**: `npm run type-check`（`tsc --noEmit`）— 必须零错误
- **P7-2**: `npm run lint`（`eslint .`）— 必须零错误
- **P7-3**: `expo start` 启动验证 — 关键路径无报错
