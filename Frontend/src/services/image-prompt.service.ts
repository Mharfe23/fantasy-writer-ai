import axios from "axios";
import { authService } from "./auth.service";

const API_URL = "http://localhost:8080/api";

export interface ImagePrompt {
  id: string;
  selectedText: string;
  imagePath: string;
  pageId: string;
}

export interface CreateImagePromptRequest {
  selectedText: string;
  imagePath: string;
  pageId: string;
}

class ImagePromptService {
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

  async createImagePrompt(prompt: CreateImagePromptRequest): Promise<ImagePrompt> {
    try {
      const headers = this.getAuthHeader();
      const response = await axios.post(`${API_URL}/image-prompts`, prompt, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error in createImagePrompt:", error);
      throw error;
    }
  }

  async getImagePrompt(id: string): Promise<ImagePrompt> {
    try {
      const headers = this.getAuthHeader();
      const response = await axios.get(`${API_URL}/image-prompts/${id}`, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error in getImagePrompt:", error);
      throw error;
    }
  }

  async getImagePromptsByPage(pageId: string): Promise<ImagePrompt[]> {
    try {
      const headers = this.getAuthHeader();
      const response = await axios.get(`${API_URL}/image-prompts/page/${pageId}`, {
        headers,
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      console.error("Error in getImagePromptsByPage:", error);
      throw error;
    }
  }

  async deleteImagePrompt(id: string): Promise<void> {
    try {
      const headers = this.getAuthHeader();
      await axios.delete(`${API_URL}/image-prompts/${id}`, {
        headers,
        withCredentials: true
      });
    } catch (error) {
      console.error("Error in deleteImagePrompt:", error);
      throw error;
    }
  }
}

export default new ImagePromptService(); 