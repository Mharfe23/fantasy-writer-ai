import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
    window.location.href = '/login';
  }

  getCurrentToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentToken();
  }

  getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) return null;

      const payload = JSON.parse(atob(tokenParts[1]));
      return {
        username: payload.sub,
        userId: payload.userId
      };
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  }
}

export const authService = new AuthService(); 