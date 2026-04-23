import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { RecipeCard } from '@components/RecipeCard';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';
import type { IRecipe, ISubCategory } from '@/types';

const RenderRecipeCard: ListRenderItem<IRecipe> = ({ item }) => <RecipeCard recipe={item} />;

interface SubCategoryDetailProps {
  cat: ISubCategory | undefined;
  recipes: IRecipe[];
  loading: boolean;
  error: Error | null;
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onBack: () => void;
}

export function SubCategoryDetail({
  cat,
  recipes,
  loading,
  error,
  searchQuery,
  onSearchChange,
  onBack,
}: SubCategoryDetailProps) {
  const [searchFocused, setSearchFocused] = React.useState(false);
  const displayRecipes = recipes.filter(
    (r) => r.title.includes(searchQuery) || r.description.includes(searchQuery),
  );

  return (
    <View className="flex-1 flex-col" style={{ backgroundColor: COLORS.background }}>
      {/* 头部导航 */}
      <View className="flex-row items-center pt-4 pb-3 px-4" style={{ gap: SPACING.md }}>
        <TouchableOpacity
          className="justify-center items-center"
          style={{
            width: SIZES.circleButton + 4,
            height: SIZES.circleButton + 4,
            borderRadius: (SIZES.circleButton + 4) / 2,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
          onPress={onBack}
        >
          <Ionicons name="chevron-back" size={SIZES.iconLarge} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text className="font-bold" style={{ fontSize: FONT_SIZES.xxl, color: COLORS.textPrimary }}>
          {cat?.name}
        </Text>
      </View>

      {/* 搜索框 */}
      <View
        className="flex-row items-center rounded-xl px-4 mb-4 mx-4"
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
          placeholder={`在 ${cat?.name} 中搜索...`}
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={onSearchChange}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
      </View>

      {/* 菜谱列表 */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View className="items-center justify-center py-16">
          <Ionicons name="warning-outline" size={SIZES.iconLarge} color={COLORS.textSecondary} />
          <Text style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.md }}>菜谱加载失败</Text>
          <Text className="mt-1" style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.sm }}>
            {error.message}
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <FlashList
            data={displayRecipes}
            renderItem={RenderRecipeCard}
            keyExtractor={(item) => item.id}
            estimatedItemSize={160}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 100 }}
            ListEmptyComponent={
              <View className="items-center justify-center py-16">
                <Text style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.md }}>
                  该分类下暂无相关菜谱
                </Text>
              </View>
            }
          />
        </View>
      )}
    </View>
  );
}
