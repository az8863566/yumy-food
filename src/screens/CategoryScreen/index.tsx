import React, { useState } from 'react';
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
import { useRecipeContext } from '@/store/RecipeContext';
import { parentCategories, subCategories } from '@/data';
import { RecipeCard } from '@components/RecipeCard';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';

export function CategoryScreen() {
  const { activeMinorCategoryId, setActiveMinorCategoryId } = useNavigationContext();
  const { recipes } = useRecipeContext();
  const [selectedParent, setSelectedParent] = useState(parentCategories[0].id);
  const [localSearch, setLocalSearch] = useState('');

  // 子分类详情视图
  if (activeMinorCategoryId) {
    const cat = subCategories.find((c) => c.id === activeMinorCategoryId);
    const displayRecipes = recipes.filter(
      (r) =>
        r.categoryId === activeMinorCategoryId &&
        (r.title.includes(localSearch) || r.description.includes(localSearch)),
    );

    return (
      <View style={styles.detailContainer}>
        <View style={styles.subCategoryHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setActiveMinorCategoryId(null)}>
            <Ionicons name="chevron-back" size={SIZES.iconLarge} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.subCategoryTitle}>{cat?.name}</Text>
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
            placeholder={`在 ${cat?.name} 中搜索...`}
            placeholderTextColor={COLORS.textSecondary}
            value={localSearch}
            onChangeText={setLocalSearch}
          />
        </View>

        <ScrollView
          style={styles.subCategoryContent}
          contentContainerStyle={styles.subCategoryScrollContent}
        >
          {displayRecipes.length > 0 ? (
            displayRecipes.map((r) => <RecipeCard key={r.id} recipe={r} />)
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>该分类下暂无相关菜谱</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }

  // 左右结构主分类视图
  const activeMinors = subCategories.filter((sub) => sub.parentId === selectedParent);

  return (
    <View style={styles.container}>
      {/* 左侧父分类导航栏 */}
      <View style={styles.leftSidebar}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {parentCategories.map((parent) => (
            <TouchableOpacity
              key={parent.id}
              style={[styles.sidebarItem, selectedParent === parent.id && styles.sidebarItemActive]}
              onPress={() => setSelectedParent(parent.id)}
            >
              <View
                style={[
                  styles.sidebarIndicator,
                  selectedParent === parent.id && styles.sidebarIndicatorActive,
                ]}
              />
              <Text
                style={[
                  styles.sidebarText,
                  selectedParent === parent.id && styles.sidebarTextActive,
                ]}
              >
                {parent.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 右侧子分类内容区 */}
      <ScrollView
        style={styles.rightContent}
        contentContainerStyle={styles.rightScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.rightTitle}>
          {parentCategories.find((c) => c.id === selectedParent)?.name}
        </Text>
        <View style={styles.subCategoryGrid}>
          {activeMinors.map((minor) => (
            <TouchableOpacity
              key={minor.id}
              style={styles.subCategoryCard}
              onPress={() => setActiveMinorCategoryId(minor.id)}
            >
              <Image source={{ uri: minor.image }} style={styles.subCategoryImage} />
              <View style={styles.subCategoryOverlay}>
                <Text style={styles.subCategoryCardName}>{minor.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        {activeMinors.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>该分类下暂无子选项</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    flexDirection: 'row',
  },
  detailContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    flexDirection: 'column',
  },
  // 左侧父分类导航栏
  leftSidebar: {
    width: 96,
    backgroundColor: COLORS.surface,
    borderRightWidth: 1,
    borderRightColor: COLORS.borderLight,
  },
  sidebarItem: {
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
    borderLeftWidth: 2,
    borderLeftColor: 'transparent',
    position: 'relative',
  },
  sidebarItemActive: {
    backgroundColor: COLORS.overlayLight,
    borderLeftColor: COLORS.primary,
  },
  sidebarIndicator: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'transparent',
  },
  sidebarIndicatorActive: {
    backgroundColor: COLORS.primary,
  },
  sidebarText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  sidebarTextActive: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  // 右侧子分类内容区
  rightContent: {
    flex: 1,
  },
  rightScrollContent: {
    padding: SPACING.lg,
    paddingBottom: 100,
  },
  rightTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  subCategoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  subCategoryCard: {
    width: '47%',
    height: 112,
    borderRadius: SIZES.borderRadius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    position: 'relative',
  },
  subCategoryImage: {
    width: '100%',
    height: '100%',
  },
  subCategoryOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subCategoryCardName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: FONT_SIZES.md,
  },
  // 子分类详情视图
  subCategoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  backBtn: {
    width: SIZES.circleButton + 4,
    height: SIZES.circleButton + 4,
    borderRadius: (SIZES.circleButton + 4) / 2,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subCategoryTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SPACING.lg,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
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
  subCategoryContent: {
    flex: 1,
  },
  subCategoryScrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxxl * 2,
  },
  emptyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
});
