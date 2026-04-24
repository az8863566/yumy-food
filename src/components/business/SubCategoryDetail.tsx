import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
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
    <View style={{ flex: 1, flexDirection: 'column', backgroundColor: COLORS.background }}>
      {/* 头部导航 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 16, paddingBottom: 12, paddingHorizontal: 16, gap: SPACING.md }}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.1)',
          }}
          onPress={onBack}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', fontSize: FONT_SIZES.xxl, color: COLORS.textPrimary }}>
          {cat?.name}
        </Text>
      </View>

      {/* 搜索框 */}
      <View
        style={[
          {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 12,
            paddingHorizontal: 16,
            marginBottom: 16,
            marginHorizontal: 16,
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
          },
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
          style={{ flex: 1, paddingVertical: 12, color: COLORS.textPrimary, fontSize: FONT_SIZES.md }}
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : error ? (
        <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 64 }}>
          <Ionicons name="warning-outline" size={SIZES.iconLarge} color={COLORS.textSecondary} />
          <Text style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.md }}>菜谱加载失败</Text>
          <Text style={{ marginTop: 4, color: COLORS.textSecondary, fontSize: FONT_SIZES.sm }}>
            {error.message}
          </Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <FlashList
            data={displayRecipes}
            renderItem={RenderRecipeCard}
            keyExtractor={(item) => item.id}
            estimatedItemSize={160}
            contentContainerStyle={{ paddingHorizontal: SPACING.lg, paddingBottom: 100 }}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 64 }}>
                <Text
                  style={{ textAlign: 'center', marginTop: 40, color: COLORS.textSecondary, fontSize: FONT_SIZES.sm }}
                >
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
