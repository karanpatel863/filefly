const STORAGE_UPLOAD_ID_KEY = "filefly-upload-id";

export class LocalStorage {
  setLatestUploadId(uploadId: string): void {
    localStorage.setItem(STORAGE_UPLOAD_ID_KEY, uploadId);
  }

  getLatestUploadId(): string | null {
    return localStorage.getItem(STORAGE_UPLOAD_ID_KEY);
  }

  resetLatestUploadId(): void {
    localStorage.removeItem(STORAGE_UPLOAD_ID_KEY);
  }
}

export const ls = new LocalStorage();
