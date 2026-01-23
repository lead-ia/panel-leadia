export interface UserData {
  userId: string;
  email: string;
  name?: string;
  phoneNumber?: string;
  photoURL?: string;
  createdAt?: string;
  [key: string]: any;
}

export interface IUserRepository {
  getUser(userId: string): Promise<UserData | null>;
  createUser(user: UserData): Promise<UserData>;
  updateUser(userId: string, data: Partial<UserData>): Promise<UserData>;
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
}
