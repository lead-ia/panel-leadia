import { db } from "@/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { IUserRepository, UserData } from "./user-repository";
import { Settings } from "@/types/settings";

export class FirebaseUserRepository implements IUserRepository {
  private collectionName = "users";

  async getUser(userId: string): Promise<UserData | null> {
    try {
      const docRef = doc(db, this.collectionName, userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as UserData;
      } else {
        return null;
      }
    } catch (error) {
      console.error("FirebaseUserRepository.getUser error:", error);
      throw error;
    }
  }

  async createUser(user: UserData): Promise<UserData> {
    try {
      const docRef = doc(db, this.collectionName, user.userId);
      // setDoc with merge: true acts like an upsert, but for create we can just set
      // We'll use setDoc to create or overwrite if it exists (though usually create implies new)
      // To match typical create behavior we might want to check existence, but setDoc is idempotent
      await setDoc(docRef, {
        ...user,
        createdAt: user.createdAt || new Date().toISOString(),
      });
      return user;
    } catch (error) {
      console.error("FirebaseUserRepository.createUser error:", error);
      throw error;
    }
  }

  async updateUser(userId: string, data: Partial<UserData>): Promise<UserData> {
    try {
      const docRef = doc(db, this.collectionName, userId);
      await updateDoc(docRef, data);
      
      // Fetch the updated document to return it
      const updatedSnap = await getDoc(docRef);
      if (updatedSnap.exists()) {
        return updatedSnap.data() as UserData;
      }
      throw new Error("User not found after update");
    } catch (error) {
      console.error("FirebaseUserRepository.updateUser error:", error);
      throw error;
    }
  }

  async updateSettings(userId: string, settings: Partial<Settings>): Promise<void> {
    try {
      const docRef = doc(db, this.collectionName, userId);
      
      // Convert partial settings to dot notation for deep merge in Firestore
      const updateData: any = {};
      Object.entries(settings).forEach(([key, value]) => {
        updateData[`settings.${key}`] = value;
      });

      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error("FirebaseUserRepository.updateSettings error:", error);
      throw error;
    }
  }
}
