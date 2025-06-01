import axios from "axios";
import { authService } from "./auth.service";

const API_URL = "http://localhost:8080/api";

export interface Chapter {
  id: string;
  title: string;
  order: number;
  bookId: string;
}

export interface CreateChapterRequest {
  title: string;
  order: number;
  bookId: string;
}

export interface UpdateChapterRequest {
  title?: string;
  order?: number;
}

class ChapterService {
  private getAuthHeader() {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        throw new Error("Invalid token format");
      }

      const payload = JSON.parse(atob(tokenParts[1]));
      const userId = payload.userId;

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

  async createChapter(chapter: CreateChapterRequest): Promise<Chapter> {
    try {
      const headers = this.getAuthHeader();
      const response = await axios.post(`${API_URL}/chapters`, chapter, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error in createChapter:", error);
      throw error;
    }
  }

  async getChapter(id: string): Promise<Chapter> {
    try {
      const headers = this.getAuthHeader();
      const response = await axios.get(`${API_URL}/chapters/${id}`, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error in getChapter:", error);
      throw error;
    }
  }

  async getChaptersByBook(bookId: string): Promise<Chapter[]> {
    try {
      const headers = this.getAuthHeader();
      const response = await axios.get(`${API_URL}/chapters/book/${bookId}`, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error in getChaptersByBook:", error);
      throw error;
    }
  }

  async updateChapter(id: string, chapter: UpdateChapterRequest): Promise<Chapter> {
    try {
      const headers = this.getAuthHeader();
      const response = await axios.put(`${API_URL}/chapters/${id}`, chapter, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error in updateChapter:", error);
      throw error;
    }
  }

  async deleteChapter(id: string): Promise<void> {
    try {
      const headers = this.getAuthHeader();
      await axios.delete(`${API_URL}/chapters/${id}`, {
        headers,
        withCredentials: true
      });
    } catch (error) {
      console.error("Error in deleteChapter:", error);
      throw error;
    }
  }
}

export default new ChapterService(); 