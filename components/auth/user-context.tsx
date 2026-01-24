"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "./auth-context";
import { UserData } from "@/lib/repositories/user-repository";
import { FirebaseUserRepository } from "@/lib/repositories/firebase-user-repository";
import { Settings } from "@/types/settings";

interface UserContextType {
  dbUser: UserData | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<UserData>) => Promise<void>;
  updateSettings: (settings: Partial<Settings>) => Promise<void>;
  createUser: (user: UserData) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: firebaseUser } = useAuth();
  const [dbUser, setDbUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const userRepository = new FirebaseUserRepository();

  const fetchDbUser = async () => {
    if (!firebaseUser) {
      setDbUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      let data = await userRepository.getUser(firebaseUser.uid);

      if (!data) {
        // Auto-create user if not found (e.g. legacy user or first login via provider)
        const newUser: UserData = {
          userId: firebaseUser.uid,
          email: firebaseUser.email || "",
          name: firebaseUser.displayName || "",
          photoURL: firebaseUser.photoURL || "",
          createdAt: new Date().toISOString(),
        };
        data = await userRepository.createUser(newUser);
      }

      setDbUser(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching DB user:", err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDbUser();
  }, [firebaseUser]);

  const refreshUser = async () => {
    await fetchDbUser();
  };

  const updateUser = async (data: Partial<UserData>) => {
    if (!firebaseUser || !dbUser) return;

    try {
      const updated = await userRepository.updateUser(firebaseUser.uid, data);
      setDbUser(updated);
    } catch (err) {
      console.error("Error updating user:", err);
      throw err;
    }
  };

  const createUser = async (userData: UserData) => {
    try {
      const created = await userRepository.createUser(userData);
      setDbUser(created);
    } catch (err) {
      console.error("Error creating user:", err);
      throw err;
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    if (!firebaseUser || !dbUser) return;

    try {
      await userRepository.updateSettings(firebaseUser.uid, newSettings);
      // Optimistically update local state
      setDbUser({
        ...dbUser,
        settings: {
          ...(dbUser.settings || {}),
          ...newSettings,
        } as Settings,
      });
    } catch (err) {
      console.error("Error updating settings:", err);
      throw err;
    }
  };

  return (
    <UserContext.Provider
      value={{
        dbUser,
        loading,
        error,
        refreshUser,
        updateUser,
        createUser,
        updateSettings,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
