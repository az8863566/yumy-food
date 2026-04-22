import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuthContext } from '@/store/AuthContext';
import { useNavigationContext } from '@/store/NavigationContext';
import { updateUser } from '@/api/endpoints';
import { uploadFile } from '@/api/endpoints';
import { COLORS, SPACING, SIZES, FONT_SIZES } from '@/constants';

export function EditProfileScreen() {
  const { currentUser, updateCurrentUser } = useAuthContext();
  const { setShowEditProfile } = useNavigationContext();

  const [nickname, setNickname] = useState(currentUser?.nickname || currentUser?.username || '');
  const [signature, setSignature] = useState(currentUser?.signature || '');
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
        signature: signature.trim() || undefined,
      });

      if (response.code === 0 && response.data) {
        updateCurrentUser({
          nickname: response.data.nickname,
          signature: response.data.signature,
          avatar: response.data.avatar || '',
        });
        setShowEditProfile(false);
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
  }, [nickname, signature, avatar, updateCurrentUser, setShowEditProfile]);

  if (!currentUser) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* 顶部导航 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setShowEditProfile(false)}>
          <Ionicons name="chevron-down" size={SIZES.iconLarge} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>编辑个人资料</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 头像区域 */}
        <TouchableOpacity
          style={styles.avatarSection}
          onPress={handlePickImage}
          disabled={uploading}
        >
          {uploading ? (
            <View style={[styles.avatar, styles.avatarLoading]}>
              <ActivityIndicator color={COLORS.primary} />
            </View>
          ) : (
            <Image source={{ uri: avatar || currentUser.avatar }} style={styles.avatar} />
          )}
          <Text style={styles.avatarHint}>点击更换头像</Text>
        </TouchableOpacity>

        {/* 昵称 */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>昵称</Text>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="请输入昵称"
            placeholderTextColor={COLORS.textSecondary}
            maxLength={64}
          />
        </View>

        {/* 手机号（只读） */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>手机号</Text>
          <View style={styles.readonlyField}>
            <Text style={styles.readonlyText}>未设置</Text>
          </View>
        </View>

        {/* 签名 */}
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>签名</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={signature}
            onChangeText={setSignature}
            placeholder="写点什么..."
            placeholderTextColor={COLORS.textSecondary}
            maxLength={200}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* 保存按钮 */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={COLORS.background} />
          ) : (
            <Text style={styles.saveBtnText}>保存修改</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxxl,
    paddingBottom: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xxxl,
    paddingTop: SPACING.xxl,
    paddingBottom: SPACING.xxxl * 2,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xxxl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarLoading: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  avatarHint: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  fieldGroup: {
    marginBottom: SPACING.xl,
  },
  fieldLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
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
  multilineInput: {
    minHeight: 80,
    paddingTop: SPACING.md + 2,
  },
  readonlyField: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.borderRadius,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md + 2,
  },
  readonlyText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.md,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: SIZES.borderRadius,
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: COLORS.background,
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
});
