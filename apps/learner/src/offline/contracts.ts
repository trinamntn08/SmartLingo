export type OfflineManifest = {
  formatVersion: 1;
  buildId: string;
  totalBytes: number;
  files: { url: string; size: number; sha256: string }[];
};

export type OfflineStatus = {
  state: 'empty' | 'ready' | 'incomplete';
  bytes: number;
  buildId?: string;
  downloadedAt?: string;
};

export type DownloadProgress = { completed: number; total: number; bytes: number };

export type OfflineInfo = {
  canDownload: boolean;
  reason?: string;
  manifest?: OfflineManifest;
  saved: OfflineStatus;
};

/** Browser asset caching is separate from the learner's IndexedDB stores. */
export interface OfflineAssetManager {
  inspect(): Promise<OfflineInfo>;
  download(onProgress: (progress: DownloadProgress) => void): Promise<OfflineStatus>;
  remove(): Promise<OfflineStatus>;
}
