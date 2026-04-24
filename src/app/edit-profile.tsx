import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
// @ts-expect-error - expo-image-picker types not available
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import { updateUser, uploadFile } from '@/api/endpoints';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';

export default function EditProfileScreen() {
  const { currentUser, updateCurrentUser } = useAuthStore();

  const [nickname, setNickname] = useState(currentUser?.nickname || currentUser?.username || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handlePickImage = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const pickedAsset = result.assets[0];
      setUploading(true);

      const formData = new FormData();
      const fileName = pickedAsset.fileName || 'avatar.jpg';
      const fileType = pickedAsset.mimeType || 'image/jpeg';

      // @ts-expect-error - React Native FormData 支持 uri 格式
      formData.append('file', {
        uri: pickedAsset.uri,
        name: fileName,
        type: fileType,
      });

      const response = await uploadFile(formData);
      if (response.data.code === 0 && response.data.data) {
        setAvatar(response.data.data.url);
      } else {
        Alert.alert('上传失败', response.data.msg || response.data.message || '头像上传失败');
      }
    } catch (error: unknown) {
      console.error('Upload avatar error:', error);
      const message = error instanceof Error ? error.message : '头像上传失败，请重试';
      Alert.alert('上传失败', message);
    } finally {
      setUploading(false);
    }
  }, []);

  const handleSave = useCallback(async () => {
    if (!nickname.trim()) {
      Alert.alert('提示', '昵称不能为空');
      return;
    }

    setSaving(true);
    try {
      const response = await updateUser({
        nickname: nickname.trim(),
        avatar: avatar || undefined,
      });

      if (response.code === 0 && response.data) {
        updateCurrentUser({
          nickname: response.data.nickname,
          avatar: response.data.avatar || '',
        });
        router.back();
      } else {
        Alert.alert('保存失败', response.msg || response.message || '修改失败');
      }
    } catch (error: unknown) {
      console.error('Update user error:', error);
      const message = error instanceof Error ? error.message : '修改失败，请重试';
      Alert.alert('保存失败', message);
    } finally {
      setSaving(false);
    }
  }, [nickname, avatar, updateCurrentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* 顶部导航 */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: SPACING.lg,
          paddingTop: SPACING.xxxl,
          paddingBottom: SPACING.lg,
          backgroundColor: COLORS.background,
        }}
      >
        <View style={{ width: 40, height: 40 }} />
        <Text style={{ fontWeight: 'bold', fontSize: FONT_SIZES.xl, color: COLORS.textPrimary }}>
          编辑个人资料
        </Text>
        <TouchableOpacity
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-down" size={SIZES.iconLarge} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: SPACING.xxxl,
          paddingTop: SPACING.xxl,
          paddingBottom: SPACING.xxxl * 2,
        }}
      >
        {/* 头像区域 */}
        <TouchableOpacity
          style={{ alignItems: 'center', marginBottom: SPACING.xxxl }}
          onPress={handlePickImage}
          disabled={uploading}
        >
          {uploading ? (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: COLORS.surface,
                borderWidth: 2,
                borderColor: 'rgba(197,160,89,0.3)',
                padding: 4,
              }}
            >
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : (
            <Image
              source={{ uri: avatar || currentUser.avatar }}
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 2,
                borderColor: 'rgba(197,160,89,0.3)',
                padding: 4,
              }}
              contentFit="cover"
              transition={200}
            />
          )}
          <Text
            style={{
              marginTop: SPACING.md,
              fontSize: FONT_SIZES.sm,
              color: COLORS.textSecondary,
            }}
          >
            点击更换头像
          </Text>
        </TouchableOpacity>

        {/* 昵称 */}
        <View style={{ marginBottom: SPACING.xl }}>
          <Text
            style={{
              fontSize: FONT_SIZES.xs,
              color: COLORS.textSecondary,
              marginBottom: SPACING.xs,
              marginLeft: SPACING.xs,
              textTransform: 'uppercase',
              letterSpacing: 2,
              fontWeight: '500',
            }}
          >
            昵称
          </Text>
          <TextInput
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: SIZES.borderRadiusLarge,
              paddingHorizontal: SPACING.lg,
              paddingVertical: SPACING.lg,
              color: COLORS.textPrimary,
              fontSize: FONT_SIZES.md,
            }}
            value={nickname}
            onChangeText={setNickname}
            placeholder="请输入昵称"
            placeholderTextColor={COLORS.textSecondary}
            maxLength={64}
          />
        </View>

        {/* 手机号（只读） */}
        <View style={{ marginBottom: SPACING.xl }}>
          <Text
            style={{
              fontSize: FONT_SIZES.xs,
              color: COLORS.textSecondary,
              marginBottom: SPACING.xs,
              marginLeft: SPACING.xs,
              textTransform: 'uppercase',
              letterSpacing: 2,
              fontWeight: '500',
            }}
          >
            手机号
          </Text>
          <View
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)',
              borderRadius: SIZES.borderRadiusLarge,
              paddingHorizontal: SPACING.lg,
              paddingVertical: SPACING.lg,
            }}
          >
            <Text style={{ color: COLORS.textSecondary, fontSize: FONT_SIZES.md }}>未设置</Text>
          </View>
        </View>

        {/* 保存按钮 */}
        <TouchableOpacity
          style={{
            alignItems: 'center',
            backgroundColor: COLORS.primary,
            paddingVertical: SPACING.lg,
            borderRadius: SIZES.borderRadius,
            marginTop: SPACING.xl,
            opacity: saving ? 0.6 : 1,
          }}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text
              style={{
                fontWeight: 'bold',
                color: COLORS.background,
                fontSize: FONT_SIZES.md,
                letterSpacing: 2,
              }}
            >
              保存修改
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
