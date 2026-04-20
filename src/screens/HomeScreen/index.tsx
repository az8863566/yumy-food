import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationContext } from '@/store/NavigationContext';
import { useSearchRecipes } from '@/hooks';
import { RecipeCard } from '@components/RecipeCard';
import { subCategories } from '@/data';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';

export function HomeScreen() {
  const { searchQuery, setSearchQuery, setCurrentTab, setActiveMinorCategoryId } =
    useNavigationContext();
  const { topRanked, recommended } = useSearchRecipes();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Text style={styles.title}>甄味</Text>
        <Text style={styles.subtitle}>FlavorGuide</Text>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={SIZES.iconMedium}
          color={COLORS.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索食谱或食材..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* 快捷分类入口 - 4列2行 */}
      <View style={styles.quickCategories}>
        {subCategories.slice(0, 8).map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={styles.quickCategoryItem}
            onPress={() => {
              setCurrentTab('categories');
              setActiveMinorCategoryId(cat.id);
            }}
          >
            <View style={styles.quickCategoryCircle}>
              <Image source={{ uri: cat.image }} style={styles.quickCategoryImage} />
            </View>
            <Text style={styles.quickCategoryName}>{cat.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔥 人气排行榜</Text>
        {topRanked.map((recipe, index) => (
          <RecipeCard key={recipe.id} recipe={recipe} indexRanking={index + 1} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ 为你推荐</Text>
        {recommended.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
});
