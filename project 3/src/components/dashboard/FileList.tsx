import React from 'react';
import { motion } from 'framer-motion';
import { FileIcon, Trash2, Share2, Lock } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';
import type { FileItem } from '../../types/file';

export const FileList = () => {
  const { files, deleteFile, shareFile } = useFileStore();

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="grid grid-cols-[1fr,100px,100px,150px,100px] gap-4 mb-4 text-gray-500 font-medium">
        <div>Name</div>
        <div>Size</div>
        <div>Type</div>
        <div>Modified</div>
        <div>Actions</div>
      </div>

      {files.map((file, index) => (
        <motion.div
          key={file.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="grid grid-cols-[1fr,100px,100px,150px,100px] gap-4 items-center py-3 border-b border-gray-100 hover:bg-gray-50"
        >
          <div className="flex items-center space-x-3">
            <FileIcon className="h-5 w-5 text-blue-500" />
            <span className="font-medium">{file.name}</span>
          </div>
          <div>{formatSize(file.size)}</div>
          <div>{file.type.split('/')[1]}</div>
          <div>{new Date(file.lastModified).toLocaleDateString()}</div>
          <div className="flex space-x-2">
            <button
              onClick={() => shareFile(file.id)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title={file.shared ? 'Unshare' : 'Share'}
            >
              <Share2 className={`h-4 w-4 ${file.shared ? 'text-green-500' : 'text-gray-500'}`} />
            </button>
            <button
              onClick={() => deleteFile(file.id)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Delete"
            >
              <Trash2 className="h-4 w-4 text-red-500" />
            </button>
            {file.encrypted && (
              <Lock className="h-4 w-4 text-blue-500" title="Encrypted" />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};