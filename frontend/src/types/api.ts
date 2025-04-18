// src/types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  status: number | null; // Ensure this field exists
  message: string;
  data?: unknown; // Changed from 'any' to 'unknown'
}
export interface ApiItemResponse<T> {
  item: T;
}
