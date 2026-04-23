/**
 * API 客户端封装
 * 配置 Axios 实例、拦截器、错误处理
 */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';

// API 基础配置
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:8080';
const API_TIMEOUT = 15000; // 15秒超时

/** 后端错误响应结构 */
interface IBackendErrorResponse {
  msg?: string;
  message?: string;
  error?: string;
  errorMessage?: string;
  [key: string]: unknown;
}

/** 扩展的 Axios 错误，携带后端业务消息 */
interface IApiError extends AxiosError {
  backendMessage?: string;
  responseData?: unknown;
}

/**
 * 创建 Axios 实例
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 请求拦截器：自动注入 Token
 */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // 从 SecureStore 获取 Token
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Failed to get token from SecureStore:', error);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

/**
 * 响应拦截器：统一错误处理
 */
apiClient.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response;
  },
  async (error: AxiosError<IBackendErrorResponse>) => {
    const apiError = error as IApiError;

    // 处理错误
    if (error.response) {
      const { status, data } = error.response;

      // 尝试从后端响应中提取业务错误消息（支持多种字段名）
      const backendMessage = data?.msg || data?.message || data?.error || data?.errorMessage || '';

      // 打印完整响应数据用于调试
      console.error(`[HTTP ${status}] Response data:`, JSON.stringify(data, null, 2));

      switch (status) {
        case 401:
          // Token 过期或无效，清除本地 Token
          console.error('Unauthorized: Token expired or invalid');
          await SecureStore.deleteItemAsync('auth_token');
          // TODO: 可以在此处触发全局的登出逻辑
          break;
        case 403:
          console.error('Forbidden: Access denied');
          break;
        case 404:
          console.error('Not Found: Resource does not exist');
          break;
        case 500:
          console.error('Server Error:', backendMessage || 'Internal server error');
          break;
        default:
          console.error(`Error ${status}:`, backendMessage || data);
      }

      // 将后端错误消息附加到 error 对象上，供上层业务使用
      if (backendMessage) {
        apiError.backendMessage = backendMessage;
      }
      // 同时把完整响应数据也附加上去，方便上层解析
      apiError.responseData = data;
    } else if (error.request) {
      // 请求已发送但没有收到响应
      console.error('Network Error: No response received');
      apiError.backendMessage = '网络异常，请检查网络连接';
    } else {
      // 请求配置出错
      console.error('Request Error:', error.message);
      apiError.backendMessage = '请求出错，请稍后重试';
    }

    return Promise.reject(apiError);
  },
);

/**
 * 通用请求方法
 */
export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.get<T>(url, config).then((res) => res.data),

  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.post<T>(url, data, config).then((res) => res.data),

  put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    apiClient.put<T>(url, data, config).then((res) => res.data),

  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    apiClient.delete<T>(url, config).then((res) => res.data),
};

export default apiClient;
