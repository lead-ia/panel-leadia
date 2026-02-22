import { useState } from "react";
import { StorageRepository } from "@/lib/repositories/storage-repository";

export function useStorage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const repository = new StorageRepository();

  const upload = async (file: File, path?: string) => {
    setLoading(true);
    setError(null);
    try {
      const key = await repository.insert(file, path);
      return key;
    } catch (err: any) {
      setError(err.message || "Upload failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getURL = async (key: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = await repository.read(key);
      return url;
    } catch (err: any) {
      setError(err.message || "Failed to get URL");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    upload,
    getURL,
    loading,
    error,
  };
}
