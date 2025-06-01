import axios from "axios";
import { authService } from "./auth.service";

const API_URL = "http://localhost:8080/api";

export interface Book {
  id: string;
  title: string;
  description: string;
  type: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  progress: number;
  wordCount: number;
  chapters: any[];
  images: any[];
  audio: any[];
}

export interface CreateBookRequest {
  title: string;
  description: string;
  type: string;
}

class BookService {
  private getAuthHeader() {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Debug log
    
    if (!token) {
      throw new Error("No authentication token found");
    }

    // Extract user ID from token
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      throw new Error("Invalid token format");
    }

    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.userId; // Get user ID from the token
      console.log("Extracted user ID:", userId); // Debug log

      if (!userId) {
        throw new Error("No user ID found in token");
      }

      return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Id": userId
      };
    } catch (error) {
      console.error("Error parsing token:", error);
      throw new Error("Invalid token format");
    }
  }

  async createBook(book: CreateBookRequest): Promise<Book> {
    try {
      console.log("Creating book with data:", book); // Debug log
      const headers = this.getAuthHeader();
      console.log("Using headers:", headers); // Debug log
      
      const response = await axios.post(`${API_URL}/books`, book, {
        headers,
        withCredentials: true
      });
      
      console.log("Response:", response.data); // Debug log
      return response.data;
    } catch (error: any) {
      console.error("Error in createBook:", error);
      console.error("Error response:", error.response?.data); // Debug log
      console.error("Error status:", error.response?.status); // Debug log
      console.error("Error headers:", error.response?.headers); // Debug log
      throw error;
    }
  }

  async getBooks(): Promise<Book[]> {
    try {
      const headers = this.getAuthHeader();
      console.log("Getting books with headers:", headers); // Debug log
      
      const response = await axios.get(`${API_URL}/books/user`, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error in getBooks:", error);
      throw error;
    }
  }

  async getBook(id: string): Promise<Book> {
    try {
      const headers = this.getAuthHeader();
      console.log("Getting book with headers:", headers); // Debug log
      
      const response = await axios.get(`${API_URL}/books/${id}`, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error in getBook:", error);
      throw error;
    }
  }
}

export default new BookService(); 