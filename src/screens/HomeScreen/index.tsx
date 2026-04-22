import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationContext } from '@/store/NavigationContext';
import { useSearchRecipes, useCategories } from '@/hooks';
import { RecipeCard } from '@components/RecipeCard';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';
import type { SubCategory } from '@/@types';

/** 菜谱卡片骨架屏 */
function RecipeCardSkeleton() {
  return (
    <View style={styles.skeletonCard}>
      <View style={styles.skeletonImage} />
      <View style={styles.skeletonContent}>
        <View style={styles.skeletonTitle} />
        <View style={styles.skeletonDesc} />
        <View style={styles.skeletonMeta} />
      </View>
    </View>
  );
}

/** 快捷分类项组件（带按下高亮效果） */
function QuickCategoryItem({ cat, onPress }: { cat: SubCategory; onPress: () => void }) {
  const [pressed, setPressed] = React.useState(false);

  return (
    <TouchableOpacity
      style={styles.quickCategoryItem}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={0.8}
    >
      <View style={[styles.quickCategoryCircle, pressed && styles.quickCategoryCirclePressed]}>
        <Image source={{ uri: cat.image || 'https://picsum.photos/200' }} style={styles.quickCategoryImage} />
      </View>
      <Text style={[styles.quickCategoryName, pressed && styles.quickCategoryNamePressed]}>
        {cat.name}
      </Text>
    </TouchableOpacity>
  );
}

export function HomeScreen() {
  const { searchQuery, setSearchQuery, setCurrentTab, setActiveMinorCategoryId } =
    useNavigationContext();
  const { topRanked, recommended, searchResults, isSearching, loading: searchLoading, loadingSearch } =
    useSearchRecipes();
  const { homeCategories, loading: categoriesLoading } = useCategories();
  const [searchFocused, setSearchFocused] = React.useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={[styles.searchContainer, searchFocused && styles.searchContainerFocused]}>
        <Ionicons
          name="search"
          size={SIZES.iconMedium}
          color={searchFocused ? COLORS.primary : COLORS.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索食谱或食材..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        {loadingSearch && (
          <ActivityIndicator size="small" color={COLORS.primary} style={styles.searchLoader} />
        )}
      </View>

      {isSearching ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>搜索结果</Text>
          {loadingSearch ? (
            <View style={styles.skeletonList}>
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
              <RecipeCardSkeleton />
            </View>
          ) : searchResults.length > 0 ? (
            searchResults.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
          ) : (
            <Text style={styles.emptyText}>未找到相关食谱</Text>
          )}
        </View>
      ) : (
        <>
          <View style={styles.header}>
            <Text style={styles.title}>甄味</Text>
            <Text style={styles.subtitle}>FlavorGuide</Text>
          </View>

          {/* 快捷分类入口 - 4列2行 */}
          <View style={styles.quickCategories}>
            {categoriesLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <View key={i} style={styles.categorySkeleton}>
                    <View style={styles.categorySkeletonCircle} />
                    <View style={styles.categorySkeletonText} />
                  </View>
                ))
              : homeCategories.slice(0, 8).map((cat) => (
                  <QuickCategoryItem
                    key={cat.id}
                    cat={cat}
                    onPress={() => {
                      setCurrentTab('categories');
                      setActiveMinorCategoryId(String(cat.id));
                    }}
                  />
                ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🔥 人气排行榜</Text>
            {searchLoading || topRanked.length === 0 ? (
              <View style={styles.skeletonList}>
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>✨ 为你推荐</Text>
            {searchLoading || recommended.length === 0 ? (
              <View style={styles.skeletonList}>
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
                <RecipeCardSkeleton />
              </View>
            ) : (
              recommended.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))
            )}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.xxl,
    marginTop: SPACING.sm,
  },
  title: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xxl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchContainerFocused: {
    borderColor: COLORS.primary,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
  },
  section: {
    marginBottom: SPACING.xxl,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  quickCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginBottom: SPACING.xxl,
  },
  quickCategoryItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  quickCategoryCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  quickCategoryImage: {
    width: '100%',
    height: '100%',
  },
  quickCategoryName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  quickCategoryCirclePressed: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  quickCategoryNamePressed: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  searchLoader: {
    marginLeft: SPACING.sm,
  },
  skeletonList: {
    gap: SPACING.lg,
  },
  skeletonCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skeletonImage: {
    width: 120,
    height: 100,
    backgroundColor: COLORS.border,
  },
  skeletonContent: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  skeletonTitle: {
    height: 16,
    width: '60%',
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
  skeletonDesc: {
    height: 12,
    width: '80%',
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
  skeletonMeta: {
    height: 12,
    width: '40%',
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
  categorySkeleton: {
    width: '25%',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  categorySkeletonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  categorySkeletonText: {
    width: 40,
    height: 12,
    backgroundColor: COLORS.border,
    borderRadius: 4,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    marginVertical: SPACING.xl,
  },
});
