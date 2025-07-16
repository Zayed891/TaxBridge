import { api, setAuthToken, removeAuthToken } from '@/lib/api';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  country: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Auth Service
export class AuthService {
  // Register new user
  static async register(data: RegisterData) {
    const response = await api.post<AuthResponse>('/api/auth/register', data);
    
    if (response.success && response.data) {
      setAuthToken(response.data.token);
    }
    
    return response;
  }

  // Login user
  static async login(credentials: LoginCredentials) {
    try {
      const response = await api.post<AuthResponse>('/api/auth/login', credentials);
      
      if (response.success && response.data) {
        setAuthToken(response.data.token);
        console.log('Login successful');
      } else {
        console.error('Login failed:', response.error?.message);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: {
          code: 'LOGIN_ERROR',
          message: 'Failed to connect to authentication server',
        },
      };
    }
  }

  // Logout user
  static async logout() {
    removeAuthToken();
    // Redirect to home page
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  }

  // Get current user info
  static async getCurrentUser() {
    return api.get<User>('/api/auth/me');
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('authToken');
  }
}

export default AuthService;
