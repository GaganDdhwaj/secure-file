export interface FileItem {
  id: string;
  name: string;
  type: string;
  size: number;
  lastModified: Date;
  owner: string;
  shared: boolean;
  encrypted: boolean;
}

export interface FileState {
  files: FileItem[];
  isLoading: boolean;
  error: string | null;
  uploadFile: (file: File) => Promise<void>;
  deleteFile: (id: string) => Promise<void>;
  shareFile: (id: string) => Promise<void>;
}