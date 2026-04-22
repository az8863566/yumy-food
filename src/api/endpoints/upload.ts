/**
 * 文件上传相关 API
 */
import apiClient from '@/api/client';
import type { Result, UploadVO } from '@/api/types';

/**
 * 上传文件
 * @param file - 文件对象（FormData）
 */
export const uploadFile = (formData: FormData) => {
  return apiClient.post<Result<UploadVO>>('/api/toc/v1/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
