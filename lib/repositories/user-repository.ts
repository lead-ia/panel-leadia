import { Settings } from "@/types/settings";

export interface UserData {
  userId: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt?: string;
  settings?: Settings;
  [key: string]: any;
}

export interface IUserRepository {
  getUser(userId: string): Promise<UserData | null>;
  createUser(user: UserData): Promise<UserData>;
  updateUser(userId: string, data: Partial<UserData>): Promise<UserData>;
  updateSettings(userId: string, settings: Partial<Settings>): Promise<void>;
}

export class UserRepository implements IUserRepository {
  private baseUrl = "/api/users";

  async getUser(userId: string): Promise<UserData | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`);
      if (response.status === 404) return null;
      if (!response.ok) throw new Error("Failed to fetch user");
      return await response.json();
    } catch (error) {
      console.error("UserRepository.getUser error:", error);
      throw error;
    }
  }

  async createUser(user: UserData): Promise<UserData> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });
      if (!response.ok) throw new Error("Failed to create user");
      return await response.json();
    } catch (error) {
      console.error("UserRepository.createUser error:", error);
      throw error;
    }
  }

  async updateUser(userId: string, data: Partial<UserData>): Promise<UserData> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update user");
      return await response.json();
    } catch (error) {
      console.error("UserRepository.updateUser error:", error);
      throw error;
    }
  }

  async updateSettings(userId: string, settings: Partial<Settings>): Promise<void> {
    // This is a placeholder implementation for the API repository.
    // In a real scenario, this would call an API endpoint.
    // Since we are using FirebaseUserRepository mostly, this might not be used.
    // But for completeness:
    await this.updateUser(userId, { settings: settings as any });
  }
}
