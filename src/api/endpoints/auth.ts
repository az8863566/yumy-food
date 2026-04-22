/**
 * 用户认证相关 API
 */
import { api } from '@/api/client';
import type {
  Result,
  TocAuthVO,
  TocAuthLoginDTO,
  TocAuthRegisterDTO,
  TocUserVO,
  TocUserUpdateDTO,
} from '@/api/types';

/**
 * 用户登录
 */
export const login = (data: TocAuthLoginDTO) => {
  return api.post<Result<TocAuthVO>>('/api/toc/v1/auth/login', data);
};

/**
 * 用户注册
 */
export const register = (data: TocAuthRegisterDTO) => {
  return api.post<Result<TocAuthVO>>('/api/toc/v1/auth/register', data);
};

/**
 * 获取当前用户信息
 */
export const getCurrentUser = () => {
  return api.get<Result<TocUserVO>>('/api/toc/v1/users/me');
};

/**
 * 更新当前用户信息
 */
export const updateUser = (data: TocUserUpdateDTO) => {
  return api.put<Result<TocUserVO>>('/api/toc/v1/users/me', data);
};
