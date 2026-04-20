import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigationContext } from '@/store/NavigationContext';
import { useAuthContext } from '@/store/AuthContext';
import { HomeScreen, CategoryScreen, ProfileScreen, RecipeDetailScreen } from '@/screens';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';
import type { TabType } from '@/@types';

interface TabConfig {
  key: TabType;
  icon: 'home-outline' | 'grid-outline' | 'person-outline';
  activeIcon: 'home' | 'grid' | 'person';
  label: string;
}

const TAB_CONFIGS: TabConfig[] = [
  { key: 'home', icon: 'home-outline', activeIcon: 'home', label: '首页' },
  { key: 'categories', icon: 'grid-outline', activeIcon: 'grid', label: '分类' },
  { key: 'profile', icon: 'person-outline', activeIcon: 'person', label: '我的' },
];

/**
 * 登录弹窗组件
 * 全屏模态窗，包含用户名/密码登录表单
 */
function AuthModal() {
  const { showAuthModal, login, setShowAuthModal, pendingAction, setPendingAction } =
    useAuthContext();
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = () => {
    if (!username || !password) return;
    login({
      id: Math.random().toString(),
      username,
      avatar: 'https://picsum.photos/seed/' + username + '/200',
    });
    setShowAuthModal(false);
    setUsername('');
    setPassword('');
    // 登录成功后执行待处理的动作（如跳转到菜谱详情）
    if (pendingAction) {
      // 使用 setTimeout 确保状态更新已完成
      const action = pendingAction;
      setPendingAction(null);
      setTimeout(action, 0);
    }
  };

  return (
    <Modal visible={showAuthModal} animationType="slide" transparent={false}>
      <View style={authStyles.container}>
        <TouchableOpacity style={authStyles.closeBtn} onPress={() => setShowAuthModal(false)}>
          <Ionicons name="chevron-back" size={SIZES.iconLarge} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={authStyles.formContainer}>
          <View style={authStyles.brand}>
            <Text style={authStyles.brandTitle}>甄味</Text>
            <Text style={authStyles.brandSubtitle}>FlavorGuide</Text>
          </View>

          <View style={authStyles.inputGroup}>
            <Text style={authStyles.label}>用户名</Text>
            <TextInput
              style={authStyles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="请输入用户名"
              placeholderTextColor={COLORS.textSecondary}
            />
          </View>

          <View style={authStyles.inputGroup}>
            <Text style={authStyles.label}>密码</Text>
            <TextInput
              style={authStyles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="请输入密码"
              placeholderTextColor={COLORS.textSecondary}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={authStyles.submitBtn} onPress={handleSubmit}>
            <Text style={authStyles.submitBtnText}>登录</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
  },
  closeBtn: {
    position: 'absolute',
    top: SPACING.xxxl + SPACING.lg,
    left: SPACING.lg,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    paddingHorizontal: SPACING.xxxl,
  },
  brand: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl * 2,
  },
  brandTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  brandSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    letterSpacing: 4,
    marginTop: SPACING.xs,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md + 2,
    color: COLORS.textPrimary,
    fontSize: FONT_SIZES.md,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  submitBtnText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    letterSpacing: 3,
  },
});

/**
 * 主导航组件
 * 负责 Tab 导航和页面切换逻辑
 */
export function MainNavigator() {
  const { currentTab, setCurrentTab, activeRecipeId } = useNavigationContext();

  const renderTabContent = () => {
    switch (currentTab) {
      case 'home':
        return <HomeScreen />;
      case 'categories':
        return <CategoryScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const renderTabButton = (config: TabConfig) => {
    const isActive = currentTab === config.key;

    return (
      <TouchableOpacity
        key={config.key}
        style={styles.tabButton}
        onPress={() => setCurrentTab(config.key)}
      >
        <Ionicons
          name={isActive ? config.activeIcon : config.icon}
          size={SIZES.iconLarge}
          color={isActive ? COLORS.primary : COLORS.textSecondary}
        />
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{config.label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderTabContent()}</View>

      <View style={styles.tabBar}>{TAB_CONFIGS.map(renderTabButton)}</View>

      {activeRecipeId && <RecipeDetailScreen />}

      <AuthModal />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: SPACING.xxl,
    paddingTop: SPACING.sm,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  tabText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
});
