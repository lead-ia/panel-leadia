export interface IFilesRepository {
  getPresignedUrl(key: string): Promise<string>;
}

export class FilesRepository implements IFilesRepository {
  private baseUrl: string;

  constructor() {
    // Note: process.env.URL_API_SERVICE_EXTERNAL must be defined.
    // If used on the client, ensure it's prefixed with NEXT_PUBLIC_ or handled via a proxy.
    this.baseUrl =
      process.env.URL_API_SERVICE_EXTERNAL ||
      process.env.NEXT_PUBLIC_URL_API_SERVICE_EXTERNAL ||
      "";
  }

  async getPresignedUrl(key: string): Promise<string> {
    if (!this.baseUrl) {
      throw new Error("Files API URL is not configured");
    }

    const fileKeySplit = key.split("comprovantes/");
    const fileKey = "comprovantes/" + fileKeySplit[fileKeySplit.length - 1];

    try {
      const response = await fetch(
        `${this.baseUrl}/api/files/presigned-url?key=${encodeURIComponent(fileKey)}`,
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail ||
            errorData.error ||
            `Failed to get presigned URL: ${response.status}`,
        );
      }

      const data = await response.json();
      console.log("Incoming url: ", data.url);
      return data.url;
    } catch (error) {
      console.error("FilesRepository.getPresignedUrl error:", error);
      throw error;
    }
  }
}
