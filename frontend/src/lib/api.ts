// API configuration and base setup
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any[];
  };
}

// API Configuration
export const apiConfig = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Get auth token from localStorage
export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
export const setAuthToken = (token: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('authToken', token);
};

// Remove auth token from localStorage
export const removeAuthToken = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('authToken');
};

// Base API function with error handling
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const token = getAuthToken();
    
    // If body is FormData, do not set Content-Type or apiConfig.headers
    let headers: Record<string, string> = {};
    if (options.body instanceof FormData) {
      // Only add Authorization if present
      if (token) headers['Authorization'] = `Bearer ${token}`;
      // Do NOT merge options.headers for FormData, let browser handle it
    } else {
      // Only spread options.headers if it's a plain object (not Headers instance or array)
      let extraHeaders: Record<string, string> = {};
      if (
        options.headers &&
        typeof options.headers === 'object' &&
        !Array.isArray(options.headers) &&
        !(options.headers instanceof Headers)
      ) {
        extraHeaders = options.headers as Record<string, string>;
      }
      headers = {
        ...apiConfig.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
        ...extraHeaders,
      };
    }
    const config: RequestInit = {
      ...options,
      headers,
    };

    const response = await fetch(`${apiConfig.baseURL}${endpoint}`, config);
    
    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 401) {
        // Unauthorized - clear token but don't auto-redirect from demo page
        removeAuthToken();
        // Only redirect if not on demo page
        if (typeof window !== 'undefined' && !window.location.pathname.includes('/demo')) {
          window.location.href = '/auth';
        }
      }
      
      const errorData = await response.json().catch(() => ({
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`,
        },
      }));
      
      return errorData;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network request failed',
      },
    };
  }
};

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string) => 
    apiRequest<T>(endpoint, { method: 'GET' }),
    
  post: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  put: <T = any>(endpoint: string, data?: any) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }),
    
  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
    
  // For file uploads
  postFormData: <T = any>(endpoint: string, formData: FormData) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      headers: {}, // Let browser set Content-Type for FormData
      body: formData,
    }),
};

export default api;
