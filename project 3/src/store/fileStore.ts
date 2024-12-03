import { create } from 'zustand';
import { FileState, FileItem } from '../types/file';

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  isLoading: false,
  error: null,

  uploadFile: async (file: File) => {
    set({ isLoading: true });
    try {
      const newFile: FileItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: new Date(file.lastModified),
        owner: 'current-user',
        shared: false,
        encrypted: true,
      };
      
      set(state => ({
        files: [...state.files, newFile],
        error: null,
      }));
    } catch (error) {
      set({ error: 'Failed to upload file' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteFile: async (id: string) => {
    set({ isLoading: true });
    try {
      set(state => ({
        files: state.files.filter(file => file.id !== id),
        error: null,
      }));
    } catch (error) {
      set({ error: 'Failed to delete file' });
    } finally {
      set({ isLoading: false });
    }
  },

  shareFile: async (id: string) => {
    set({ isLoading: true });
    try {
      set(state => ({
        files: state.files.map(file =>
          file.id === id ? { ...file, shared: !file.shared } : file
        ),
        error: null,
      }));
    } catch (error) {
      set({ error: 'Failed to share file' });
    } finally {
      set({ isLoading: false });
    }
  },
}));