export interface IStorageRepository {
  insert(file: File, path?: string): Promise<string>;
  read(key: string): Promise<string>;
}

export class StorageRepository implements IStorageRepository {
  private baseUrl = "/api/storage";

  async insert(file: File, path?: string): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    if (path) {
      formData.append("path", path);
    }

    const response = await fetch(this.baseUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to upload file");
    }

    const data = await response.json();
    return data.key;
  }

  async read(key: string): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}?key=${encodeURIComponent(key)}`,
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Failed to get file URL");
    }

    const data = await response.json();
    return data.url;
  }
}
