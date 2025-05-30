import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

class AuthService {
  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, {
      username,
      password
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  }

  async register(username: string, email: string, password: string): Promise<void> {
    await axios.post(`${API_URL}/auth/register`, {
      username,
      email,
      password
    });
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getCurrentToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentToken();
  }
}

export const authService = new AuthService(); 