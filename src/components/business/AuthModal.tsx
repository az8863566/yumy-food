import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/store/useAuthStore';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, loginAsync, pendingAction, setPendingAction } =
    useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = useCallback(() => {
    setShowAuthModal(false);
    setErrorMsg('');
    setUsername('');
    setPassword('');
    setPendingAction(null);
  }, [setShowAuthModal, setPendingAction]);

  const handleSubmit = useCallback(async () => {
    setErrorMsg('');

    if (!username.trim() || !password.trim()) {
      setErrorMsg('请输入完整的用户名和密码');
      return;
    }

    setLoading(true);
    try {
      await loginAsync(username.trim(), password.trim());
      setShowAuthModal(false);
      setUsername('');
      setPassword('');
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '登录失败，请重试';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  }, [username, password, loginAsync, setShowAuthModal, pendingAction, setPendingAction]);

  return (
    <Modal
      visible={showAuthModal}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1, backgroundColor: COLORS.background }}
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 32,
            justifyContent: 'center',
            backgroundColor: COLORS.background,
          }}
        >
          {/* 返回按钮 */}
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 48,
              left: 24,
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 10,
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
            }}
            onPress={handleClose}
          >
            <Ionicons name="chevron-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* 标题区域 */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <Text
              style={{
                fontWeight: 'bold',
                marginBottom: 8,
                fontSize: 36,
                color: COLORS.primary,
                letterSpacing: 2,
              }}
            >
              甄味
            </Text>
            <Text
              style={{
                fontSize: FONT_SIZES.sm,
                color: COLORS.textSecondary,
                letterSpacing: 4,
                textTransform: 'uppercase',
              }}
            >
              FlavorGuide
            </Text>
          </View>

          {/* 表单 */}
          <View style={{ gap: SPACING.lg }}>
            <View style={{ gap: SPACING.xs }}>
              <Text
                style={{
                  fontSize: FONT_SIZES.xs,
                  color: COLORS.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  fontWeight: '500',
                  marginLeft: SPACING.xs,
                }}
              >
                用户名
              </Text>
              <TextInput
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                  borderColor: errorMsg ? 'rgba(255,77,77,0.5)' : 'rgba(255,255,255,0.1)',
                  borderRadius: SIZES.borderRadiusLarge,
                  paddingHorizontal: SPACING.lg,
                  paddingVertical: SPACING.md + 4,
                  color: COLORS.textPrimary,
                  fontSize: FONT_SIZES.md,
                }}
                placeholder="请输入用户名"
                placeholderTextColor={COLORS.textSecondary}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  setErrorMsg('');
                }}
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={{ gap: SPACING.xs }}>
              <Text
                style={{
                  fontSize: FONT_SIZES.xs,
                  color: COLORS.textSecondary,
                  textTransform: 'uppercase',
                  letterSpacing: 2,
                  fontWeight: '500',
                  marginLeft: SPACING.xs,
                }}
              >
                密码
              </Text>
              <TextInput
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                  borderColor: errorMsg ? 'rgba(255,77,77,0.5)' : 'rgba(255,255,255,0.1)',
                  borderRadius: SIZES.borderRadiusLarge,
                  paddingHorizontal: SPACING.lg,
                  paddingVertical: SPACING.md + 4,
                  color: COLORS.textPrimary,
                  fontSize: FONT_SIZES.md,
                }}
                placeholder="请输入密码"
                placeholderTextColor={COLORS.textSecondary}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  setErrorMsg('');
                }}
                secureTextEntry
                editable={!loading}
              />
            </View>

            {/* 错误提示 */}
            {errorMsg ? (
              <View
                style={{
                  alignItems: 'center',
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: 'rgba(255,77,77,0.1)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,77,77,0.2)',
                }}
              >
                <Text style={{ fontSize: FONT_SIZES.sm, color: COLORS.error }}>{errorMsg}</Text>
              </View>
            ) : null}

            {/* 登录按钮 */}
            <TouchableOpacity
              style={{
                alignItems: 'center',
                paddingVertical: 16,
                marginTop: 8,
                backgroundColor: COLORS.primary,
                borderRadius: SIZES.borderRadiusLarge,
                opacity: loading ? 0.7 : 1,
              }}
              onPress={handleSubmit}
              disabled={loading}
              activeOpacity={0.9}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.background} />
              ) : (
                <Text
                  style={{
                    fontWeight: '600',
                    color: COLORS.background,
                    fontSize: FONT_SIZES.md,
                    letterSpacing: 4,
                  }}
                >
                  登录
                </Text>
              )}
            </TouchableOpacity>

            {/* 测试账号提示 */}
            <View style={{ alignItems: 'center', marginTop: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 9999,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.05)',
                }}
              >
                <Ionicons
                  name="bulb-outline"
                  size={12}
                  color={COLORS.primary}
                  style={{ marginRight: 4 }}
                />
                <Text style={{ fontSize: FONT_SIZES.xs, color: COLORS.textSecondary }}>
                  测试账号:{' '}
                  <Text style={{ color: COLORS.primary, fontFamily: 'monospace' }}>admin</Text> /
                  密码:{' '}
                  <Text style={{ color: COLORS.primary, fontFamily: 'monospace' }}>123456</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
