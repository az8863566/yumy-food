import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigationContext } from '@/store/NavigationContext';
import { useSearchRecipes, useCategories } from '@/hooks';
import { RecipeCard } from '@components/RecipeCard';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';
import type { ISubCategory } from '@/types';

/** 菜谱卡片骨架屏 */
function RecipeCardSkeleton() {
  return (
    <View
      className="flex-row rounded-xl overflow-hidden"
      style={{ backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border }}
    >
      <View className="w-[120px] h-[100px]" style={{ backgroundColor: COLORS.border }} />
      <View className="flex-1 p-4 justify-center" style={{ gap: SPACING.sm }}>
        <View className="h-4 w-[60%] rounded" style={{ backgroundColor: COLORS.border }} />
        <View className="h-3 w-[80%] rounded" style={{ backgroundColor: COLORS.border }} />
        <View className="h-3 w-[40%] rounded" style={{ backgroundColor: COLORS.border }} />
      </View>
    </View>
  );
}

/** 快捷分类项组件（带按下高亮效果） */
function QuickCategoryItem({ cat, onPress }: { cat: ISubCategory; onPress: () => void }) {
  const [pressed, setPressed] = React.useState(false);

  return (
    <TouchableOpacity
      className="w-[25%] items-center mb-4"
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.8}
    >
      <View
        className="w-14 h-14 rounded-full overflow-hidden mb-1"
        style={[
          { borderWidth: 1, borderColor: COLORS.border },
          pressed && { borderColor: COLORS.primary, borderWidth: 2 },
        ]}
      >
        <Image
          source={{ uri: cat.image || 'https://picsum.photos/200' }}
          className="w-full h-full"
          contentFit="cover"
          transition={200}
        />
      </View>
      <Text
        className="text-xs"
        style={[
          { color: COLORS.textSecondary },
          pressed && { color: COLORS.primary, fontWeight: '500' },
        ]}
      >
        {cat.name}
      </Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { searchQuery, setSearchQuery, setActiveMinorCategoryId } = useNavigationContext();
  const {
    topRanked,
    recommended,
    searchResults,
    isSearching,
    loading: searchLoading,
    loadingSearch,
  } = useSearchRecipes();
  const { homeCategories, loading: categoriesLoading } = useCategories();
  const [searchFocused, setSearchFocused] = React.useState(false);

  return (
    <ScrollView
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
      contentContainerStyle={{ padding: SPACING.lg, paddingBottom: 100 }}
    >
      <View
        className="flex-row items-center rounded-xl px-4 mb-6"
        style={[
          { backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
          searchFocused && { borderColor: COLORS.primary },
        ]}
      >
        <Ionicons
          name="search"
          size={SIZES.iconMedium}
          color={searchFocused ? COLORS.primary : COLORS.textSecondary}
          style={{ marginRight: SPACING.sm }}
        />
        <TextInput
          className="flex-1 py-3"
          style={{ color: COLORS.textPrimary, fontSize: FONT_SIZES.md }}
          placeholder="搜索食谱或食材..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {loadingSearch && (
          <ActivityIndicator
            size="small"
            color={COLORS.primary}
            style={{ marginLeft: SPACING.sm }}
          />
        )}
      </View>

      {isSearching ? (
        <View className="mb-6">
          <Text
            className="font-bold mb-4"
            style={{ fontSize: FONT_SIZES.xxl, color: COLORS.textPrimary }}
          >
            搜索结果
          </Text>
          {loadingSearch ? (
            <View style={{ gap: SPACING.lg }}>
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
            </View>
          ) : searchResults.length > 0 ? (
            searchResults.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
          ) : (
            <Text
              className="text-center"
              style={{
                color: COLORS.textSecondary,
                fontSize: FONT_SIZES.md,
                marginVertical: SPACING.xl,
              }}
            >
              未找到相关食谱
            </Text>
          )}
        </View>
      ) : (
        <>
          <View className="mt-1 mb-6">
            <Text
              className="font-bold"
              style={{ fontSize: FONT_SIZES.title, color: COLORS.textPrimary }}
            >
              甄味
            </Text>
            <Text className="mt-1" style={{ fontSize: FONT_SIZES.md, color: COLORS.textSecondary }}>
              FlavorGuide
            </Text>
          </View>

          {/* 快捷分类入口 - 4列2行 */}
          <View className="flex-row flex-wrap justify-start mb-6">
            {categoriesLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <View key={i} className="w-[25%] items-center mb-4">
                    <View
                      className="w-14 h-14 rounded-full mb-1"
                      style={{ backgroundColor: COLORS.border }}
                    />
                    <View className="w-10 h-3 rounded" style={{ backgroundColor: COLORS.border }} />
                  </View>
                ))
              : homeCategories.slice(0, 8).map((cat) => (
                  <QuickCategoryItem
                    key={cat.id}
                    cat={cat}
                    onPress={() => {
                      setActiveMinorCategoryId(String(cat.id));
                      router.push('/(tabs)/categories');
                    }}
                  />
                ))}
          </View>

          <View className="mb-6">
            <Text
              className="font-bold mb-4"
              style={{ fontSize: FONT_SIZES.xxl, color: COLORS.textPrimary }}
            >
              🔥 人气排行榜
            </Text>
            {searchLoading || topRanked.length === 0 ? (
              <View style={{ gap: SPACING.lg }}>
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
              </View>
            ) : (
              topRanked.map((recipe, index) => (
                <RecipeCard key={recipe.id} recipe={recipe} indexRanking={index + 1} />
              ))
            )}
          </View>

          <View className="mb-6">
            <Text
              className="font-bold mb-4"
              style={{ fontSize: FONT_SIZES.xxl, color: COLORS.textPrimary }}
            >
              ✨ 为你推荐
            </Text>
            {searchLoading || recommended.length === 0 ? (
              <View style={{ gap: SPACING.lg }}>
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
              </View>
            ) : (
              recommended.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}
