import axios from "axios";
import { authService } from "./auth.service";

const API_URL = "http://localhost:8080/api";

export interface Page {
  id: string;
  textContent: string;
  pageNumber: number;
  chapterId: string;
}

export interface CreatePageRequest {
  textContent: string;
  pageNumber: number;
  chapterId: string;
}

export interface UpdatePageRequest {
  textContent: string;
  pageNumber: number;
}

class PageService {
  private getAuthHeader() {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Debug log
    
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

  async createPage(page: CreatePageRequest): Promise<Page> {
    try {
      console.log("Creating page with data:", page); // Debug log
      const headers = this.getAuthHeader();
      console.log("Using headers:", headers); // Debug log
      
      const response = await axios.post(`${API_URL}/pages`, page, {
        headers,
        withCredentials: true
      });
      
      console.log("Response:", response.data); // Debug log
      return response.data;
    } catch (error: any) {
      console.error("Error in createPage:", error);
      console.error("Error response:", error.response?.data); // Debug log
      console.error("Error status:", error.response?.status); // Debug log
      console.error("Error headers:", error.response?.headers); // Debug log
      throw error;
    }
  }

  async getPage(id: string): Promise<Page> {
    try {
      const headers = this.getAuthHeader();
      console.log("Getting page with headers:", headers); // Debug log
      
      const response = await axios.get(`${API_URL}/pages/${id}`, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error("Error in getPage:", error);
      console.error("Error response:", error.response?.data); // Debug log
      console.error("Error status:", error.response?.status); // Debug log
      console.error("Error headers:", error.response?.headers); // Debug log
      throw error;
    }
  }

  async getPagesByChapter(chapterId: string): Promise<Page[]> {
    try {
      const headers = this.getAuthHeader();
      console.log("Getting pages for chapter with headers:", headers); // Debug log
      console.log("Chapter ID:", chapterId); // Debug log
      
      const response = await axios.get(`${API_URL}/pages/chapter/${chapterId}`, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error("Error in getPagesByChapter:", error);
      console.error("Error response:", error.response?.data); // Debug log
      console.error("Error status:", error.response?.status); // Debug log
      console.error("Error headers:", error.response?.headers); // Debug log
      throw error;
    }
  }

  async updatePage(id: string, page: UpdatePageRequest): Promise<Page> {
    try {
      const headers = this.getAuthHeader();
      console.log("Updating page with headers:", headers); // Debug log
      
      const response = await axios.put(`${API_URL}/pages/${id}`, page, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error: any) {
      console.error("Error in updatePage:", error);
      console.error("Error response:", error.response?.data); // Debug log
      console.error("Error status:", error.response?.status); // Debug log
      console.error("Error headers:", error.response?.headers); // Debug log
      throw error;
    }
  }

  async deletePage(id: string): Promise<void> {
    try {
      const headers = this.getAuthHeader();
      console.log("Deleting page with headers:", headers); // Debug log
      
      await axios.delete(`${API_URL}/pages/${id}`, {
        headers,
        withCredentials: true
      });
    } catch (error: any) {
      console.error("Error in deletePage:", error);
      console.error("Error response:", error.response?.data); // Debug log
      console.error("Error status:", error.response?.status); // Debug log
      console.error("Error headers:", error.response?.headers); // Debug log
      throw error;
    }
  }
}

export default new PageService(); 