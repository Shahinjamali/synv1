// src/utils/api.ts
import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import { ApiResponse, ApiError, ApiItemResponse } from '@/types/api';
import { Equipment } from '@/types/equipment';
import {
  OilAnalysisResponse,
  OilNotification,
  OilAnalysis,
  OilEntry,
  Parameter,
  TrendData,
} from '@/types/oil';
import { Category, CategoryListResponse } from '@/types/category';
import { MediaAsset } from '@/types/mediaAsset';
import { Product, ProductListResponse } from '@/types/products';
import {
  Service,
  ServiceListResponse,
  GetServicesParams,
} from '@/types/services';
import { User } from '@/types/auth';

import { TestimonialData, Blogs } from '@/types/content';
import { ContactFormData } from '@/types/user';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

const apiFetch = async <T>({
  method = 'GET',
  endpoint,
  data,
  token,
  customHeaders = {},
  params = {},
  signal, // Optional signal
}: {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  data?: object;
  token?: string;
  customHeaders?: Record<string, string>;
  params?: Record<string, string | number | boolean>;
  signal?: AbortSignal; // Optional
}): Promise<ApiResponse<T>> => {
  try {
    const config: AxiosRequestConfig = {
      method,
      url: endpoint,
      data: method !== 'GET' && method !== 'DELETE' ? data : undefined,
      params: method === 'GET' || method === 'DELETE' ? params : undefined,
      headers: {
        ...customHeaders,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        'Cache-Control': 'no-cache',
      },
      signal, // Include only if provided
    };
    const response = await apiClient(config);
    if (!response.data) {
      throw new Error('Empty response from server');
    }
    return response.data as ApiResponse<T>;
  } catch (error: unknown) {
    // Error handling remains unchanged
    console.error(`API Fetch Error - ${method} ${endpoint}:`, {
      message: (error as AxiosError).message || (error as Error).message,
      response: (error as AxiosError).response?.data,
      status: (error as AxiosError).response?.status,
    });
    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const errorPayload: ApiError = {
        status,
        message:
          typeof data?.message === 'string'
            ? data.message
            : 'An error occurred',
        data: data?.data || null,
      };
      throw errorPayload;
    }
    const networkError: ApiError = {
      status: null,
      message: (error as Error).message || 'Network error, please try again',
    };
    throw networkError;
  }
};

//Content APIS
export const getTestimonials = (options?: {
  signal?: AbortSignal;
}): Promise<ApiResponse<TestimonialData[]>> =>
  apiFetch<TestimonialData[]>({
    method: 'GET',
    endpoint: '/api/content/home/testimonials',
    signal: options?.signal,
  });

export const getThreeBlogs = (options?: {
  signal?: AbortSignal;
}): Promise<ApiResponse<Blogs[]>> =>
  apiFetch<Blogs[]>({
    method: 'GET',
    endpoint: '/api/content/blogs/latest-articles/last-three',
    signal: options?.signal,
  });

export const getAllBlogs = (options?: {
  signal?: AbortSignal;
}): Promise<ApiResponse<{ content: Blogs[] }>> =>
  apiFetch<{ content: Blogs[] }>({
    method: 'GET',
    endpoint: '/api/content/blogs',
    signal: options?.signal,
  });

export const getBlogBySlug = (
  slug: string,
  options?: { signal?: AbortSignal }
): Promise<ApiResponse<Blogs>> =>
  apiFetch<Blogs>({
    method: 'GET',
    endpoint: `/api/content/blogs/latest-articles/${encodeURIComponent(slug)}`,
    signal: options?.signal,
  });

//Auth apis

export const loginUser = (
  email: string,
  password: string
): Promise<ApiResponse<User>> =>
  apiFetch<User>({
    method: 'POST',
    endpoint: '/api/auth/login',
    data: { email, password },
  });

export const logoutUser = (): Promise<ApiResponse<void>> =>
  apiFetch<void>({
    method: 'POST',
    endpoint: '/api/auth/logout',
  });

export const checkAuthStatus = (): Promise<ApiResponse<User>> =>
  apiFetch<User>({
    endpoint: '/api/auth/check-auth',
  });

//User APIs
// User Management APIs
export const getUsers = (params: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<
  ApiResponse<{
    data: User[];
    total: number;
    pages: number;
    currentPage: number;
  }>
> =>
  apiFetch<{
    data: User[];
    total: number;
    pages: number;
    currentPage: number;
  }>({
    method: 'GET',
    endpoint: '/api/users',
    params,
  });

export const deleteUser = (userId: string): Promise<ApiResponse<void>> =>
  apiFetch<void>({
    method: 'DELETE',
    endpoint: `/api/users/${userId}`,
  });

export const updateUser = (
  userId: string,
  data: Partial<User>
): Promise<ApiResponse<User>> =>
  apiFetch<User>({
    method: 'PUT',
    endpoint: `/api/users/${userId}`,
    data,
  });

export const createUser = (
  data: Omit<User, '_id' | 'hasCompletedWelcome'>
): Promise<ApiResponse<User>> =>
  apiFetch<User>({
    method: 'POST',
    endpoint: '/api/users',
    data,
  });

export const getUserById = async (
  userId: string
): Promise<ApiResponse<User>> => {
  const response = await apiFetch<User>({
    method: 'GET',
    endpoint: `/api/users/${userId}`,
  });
  return response;
};

// Equipment APIs
export const createEquipment = (
  data: Omit<Equipment, '_id'>
): Promise<ApiResponse<Equipment>> =>
  apiFetch<Equipment>({ method: 'POST', endpoint: '/api/equipment', data });

export const updateEquipment = (
  id: string,
  data: Partial<Equipment>
): Promise<ApiResponse<Equipment>> =>
  apiFetch({ method: 'PATCH', endpoint: `/api/equipment/${id}`, data });

export const deleteEquipment = (id: string): Promise<ApiResponse<void>> =>
  apiFetch({ method: 'DELETE', endpoint: `/api/equipment/${id}` });

export const getEquipmentList = (params?: {
  page?: number;
  limit?: number;
}): Promise<
  ApiResponse<{
    equipment: Equipment[];
    total: number;
    pages: number;
    currentPage: number;
  }>
> =>
  apiFetch<{
    equipment: Equipment[];
    total: number;
    pages: number;
    currentPage: number;
  }>({
    method: 'GET',
    endpoint: '/api/equipment',
    params: { ...params, deleted: false },
  });

export const getEquipmentById = (id: string): Promise<ApiResponse<Equipment>> =>
  apiFetch<Equipment>({ method: 'GET', endpoint: `/api/equipment/${id}` });

export const searchEquipment = (
  query: string
): Promise<ApiResponse<{ currentPage: number; equipment: Equipment[] }>> =>
  apiFetch<{ currentPage: number; equipment: Equipment[] }>({
    endpoint: `/api/equipment?query=${encodeURIComponent(query)}`,
  });

//Oil Apis

export const addOil = (
  equipmentId: string,
  data: Omit<
    OilEntry,
    'oilTypeId' | 'healthScore' | 'lastHealthUpdate' | 'deletedAt'
  >
): Promise<ApiResponse<OilEntry>> =>
  apiFetch<OilEntry>({
    method: 'POST',
    endpoint: `/api/equipment/${equipmentId}/oil`,
    data,
  });

export const updateOil = (
  equipmentId: string,
  oilId: string,
  data: Partial<OilEntry>
): Promise<ApiResponse<OilEntry>> =>
  apiFetch<OilEntry>({
    method: 'PATCH',
    endpoint: `/api/equipment/${equipmentId}/oil/${oilId}`,
    data,
  });

export const replaceOil = (
  equipmentId: string,
  oilId: string,
  data: Omit<
    OilEntry,
    'oilTypeId' | 'healthScore' | 'lastHealthUpdate' | 'deletedAt'
  >
): Promise<ApiResponse<OilEntry>> =>
  apiFetch<OilEntry>({
    method: 'PUT',
    endpoint: `/api/equipment/${equipmentId}/oil/${oilId}/replace`,
    data,
  });

export const deleteOil = (
  equipmentId: string,
  oilId: string
): Promise<ApiResponse<{ message: string }>> =>
  apiFetch<{ message: string }>({
    method: 'DELETE',
    endpoint: `/api/equipment/${equipmentId}/oil/${oilId}`,
  });

//Lab APIs

//Sample Apis

export const sampleOil = (
  equipmentId: string,
  oilId: string,
  data: { sampleDate: string; source: string; submittedBy: string }
): Promise<ApiResponse<OilAnalysis>> =>
  apiFetch<OilAnalysis>({
    method: 'POST',
    endpoint: '/api/lab-reports/sample',
    data: { equipmentId, oilId, ...data },
    token: localStorage.getItem('token') ?? undefined, // Fix: Convert null to undefined
  });

export const getLabData = (
  equipmentId: string,
  oilId: string
): Promise<ApiResponse<{ labReports: OilAnalysis[] }>> =>
  apiFetch<{ labReports: OilAnalysis[] }>({
    method: 'GET',
    endpoint: `/api/lab-reports?equipmentId=${encodeURIComponent(equipmentId)}&oilId=${encodeURIComponent(oilId)}`,
  });

export const getOilTrends = (
  equipmentId: string,
  oilId: string
): Promise<ApiResponse<TrendData>> =>
  apiFetch<TrendData>({
    method: 'GET',
    endpoint: `/api/trends/equipment/${encodeURIComponent(equipmentId)}/oil/${encodeURIComponent(oilId)}`,
  });

export const getOilAnalyses = (
  equipmentId: string,
  oilName?: string
): Promise<ApiResponse<OilAnalysisResponse>> =>
  apiFetch({
    endpoint: `/api/oil-analysis?equipmentId=${encodeURIComponent(equipmentId)}${oilName ? `&oilName=${encodeURIComponent(oilName)}` : ''}`,
  });

export const completeWelcome = async (): Promise<
  ApiResponse<{ success: boolean }>
> =>
  apiFetch<{ success: boolean }>({
    method: 'POST',
    endpoint: '/api/auth/complete-welcome',
  });

//Lab Data

export const addLabData = (data: {
  equipmentId: string;
  oilId: string;
  oilTypeId: string;
  companyId: string;
  timestamp: string;
  parameters: { name: string; value: number; unit: string; category: string }[];
  source: 'lab' | 'sensor';
  submittedBy?: string;
}): Promise<ApiResponse<OilAnalysis>> =>
  apiFetch<OilAnalysis>({
    method: 'POST',
    endpoint: '/api/lab-reports',
    data,
  });

export const getOilParameterType = (
  oilType: string
): Promise<ApiResponse<{ oilType: string; parameters: Parameter[] }>> =>
  apiFetch({
    method: 'GET',
    endpoint: `/api/oil-parameter-types/${encodeURIComponent(oilType)}`,
  });

export const generateReport = (
  type: 'equipment' | 'oilTrends',
  companyId: string
): Promise<ApiResponse<{ reportUrl: string }>> =>
  apiFetch<{ reportUrl: string }>({
    method: 'POST',
    endpoint: `/api/reports/${type}`,
    data: { companyId },
  });

// New Notification APIs
export const getNotifications = (
  params: {
    equipmentId?: string;
    status?: 'unread' | 'read' | 'archived';
    limit?: number;
    page?: number;
    oilTypeId?: string;
  } = {}
): Promise<
  ApiResponse<{
    notifications: OilNotification[];
    total: number;
    pages: number;
    currentPage: number;
  }>
> => apiFetch({ endpoint: '/api/notifications', params });

export const createNotification = (data: {
  equipmentId?: string;
  companyId?: string;
  userId?: string;
  type: string;
  shortMessage: string;
  detailedMessage: string;
  priority?: string;
}): Promise<ApiResponse<OilNotification>> =>
  apiFetch<OilNotification>({
    method: 'POST',
    endpoint: '/api/notifications',
    data,
  });

export const markNotificationAsRead = async (
  notificationId: string
): Promise<ApiResponse<OilNotification>> =>
  apiFetch<OilNotification>({
    method: 'PATCH',
    endpoint: `/api/notifications/${notificationId}/read`,
  });

// ==============================
//       newsletter APIs and Contact APIs
// ==============================
export const subscribeToNewsletter = async (
  email: string
): Promise<ApiResponse<{ subscribed: boolean }>> => {
  return apiFetch<{ subscribed: boolean }>({
    method: 'POST',
    endpoint: '/api/newsletter/subscribe',
    data: { email },
  });
};

export const sendContactMessage = async (
  data: ContactFormData
): Promise<ApiResponse<{ success: boolean }>> => {
  return apiFetch({
    method: 'POST',
    endpoint: '/api/public/contact',
    data,
  });
};

// ==============================
//       Product APIs
// ==============================
export const getProducts = (params: {
  categorySlug?: string;
  subcategorySlug?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<ApiResponse<ProductListResponse>> =>
  apiFetch<ProductListResponse>({
    method: 'GET',
    endpoint: '/api/products',
    params,
  });

export const getProductCategories = (): Promise<
  ApiResponse<CategoryListResponse>
> =>
  apiFetch<CategoryListResponse>({
    method: 'GET',
    endpoint: '/api/products/categories',
  });

export const getProductSubcategories = (
  categorySlug: string
): Promise<ApiResponse<CategoryListResponse>> =>
  apiFetch<CategoryListResponse>({
    method: 'GET',
    endpoint: `/api/products/${categorySlug}/subcategories`,
  });

export const getProductCategoryBySlug = (
  slug: string
): Promise<ApiResponse<CategoryListResponse>> =>
  apiFetch<CategoryListResponse>({
    method: 'GET',
    endpoint: `/api/products/?slug=${slug}`,
  });

export const getProductBySlug = (slug: string): Promise<ApiResponse<Product>> =>
  apiFetch<Product>({
    method: 'GET',
    endpoint: `/api/products/${slug}`,
  });

export const createProduct = (
  data: Omit<Product, '_id'>
): Promise<ApiResponse<Product>> =>
  apiFetch<Product>({
    method: 'POST',
    endpoint: '/api/products',
    data,
  });

export const updateProduct = (
  slug: string,
  data: Partial<Product>
): Promise<ApiResponse<Product>> =>
  apiFetch<Product>({
    method: 'PUT',
    endpoint: `/api/products/${slug}`,
    data,
  });

export const deleteProduct = (
  slug: string
): Promise<ApiResponse<{ deleted: boolean }>> =>
  apiFetch<{ deleted: boolean }>({
    method: 'DELETE',
    endpoint: `/api/products/${slug}`,
  });

// ==============================
//       Category APIs
// ==============================

export const getCategories = (): Promise<ApiResponse<Category[]>> =>
  apiFetch<Category[]>({
    method: 'GET',
    endpoint: '/api/categories',
  });

export const getSubcategories = (
  categoryId: string
): Promise<ApiResponse<Category[]>> =>
  apiFetch<Category[]>({
    method: 'GET',
    endpoint: `/api/categories/${categoryId}/subcategories`,
  });

export const createCategory = (
  data: Omit<Category, '_id'>
): Promise<ApiResponse<Category>> =>
  apiFetch<Category>({
    method: 'POST',
    endpoint: '/api/categories',
    data,
  });

// ==============================
//       Service APIs
// ==============================
export const getServices = (
  params: GetServicesParams
): Promise<ApiResponse<ServiceListResponse>> =>
  apiFetch<ServiceListResponse>({
    method: 'GET',
    endpoint: '/api/services',
    params: params as Record<string, string | number | boolean>,
  });

export const getServiceBySlug = (
  slug: string
): Promise<ApiResponse<ApiItemResponse<Service>>> =>
  apiFetch<ApiItemResponse<Service>>({
    method: 'GET',
    endpoint: `/api/services/${slug}`,
  });

export const createService = (
  data: Omit<Service, '_id'>
): Promise<ApiResponse<Service>> =>
  apiFetch<Service>({
    method: 'POST',
    endpoint: '/api/services',
    data,
  });

export const updateService = (
  slug: string,
  data: Partial<Omit<Service, '_id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Service>> =>
  apiFetch<Service>({
    method: 'PUT',
    endpoint: `/api/services/${slug}`,
    data,
    token: localStorage.getItem('token') ?? undefined,
  });

export const deleteService = (
  slug: string
): Promise<ApiResponse<{ deleted: boolean }>> =>
  apiFetch<{ deleted: boolean }>({
    method: 'DELETE',
    endpoint: `/api/services/${slug}`,
    token: localStorage.getItem('token') ?? undefined,
  });

// ==============================
//       Media Asset APIs
// ==============================

export const uploadMediaAsset = (
  file: File,
  metadata: Partial<MediaAsset>
): Promise<ApiResponse<MediaAsset>> =>
  apiFetch<MediaAsset>({
    method: 'POST',
    endpoint: '/api/media/upload',
    data: { file, metadata },
    customHeaders: { 'Content-Type': 'multipart/form-data' },
  });

export default apiFetch;
