import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Create URLSearchParams for OAuth2PasswordRequestForm (not FormData)
    const params = new URLSearchParams();
    params.append('username', credentials.username);
    params.append('password', credentials.password);

    const response = await api.post<AuthResponse>('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // Future: Add token validation endpoint
  validateToken: async (token: string): Promise<boolean> => {
    try {
      // This would make a call to validate the token
      // For now, just check if token exists and is not expired
      if (!token) return false;
      
      // You could decode the JWT here to check expiration
      // For now, just return true if token exists
      return true;
    } catch (error) {
      return false;
    }
  }
};
