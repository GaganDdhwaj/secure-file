import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useFileStore } from '../../store/fileStore';

export const UploadZone = () => {
  const { uploadFile, isLoading } = useFileStore();

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      files.forEach(uploadFile);
    },
    [uploadFile]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-blue-500 transition-colors"
    >
      <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
      <h3 className="text-lg font-medium mb-2">Drop files here</h3>
      <p className="text-gray-500 mb-4">or click to select files</p>
      <input
        type="file"
        multiple
        onChange={(e) => e.target.files && Array.from(e.target.files).forEach(uploadFile)}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isLoading ? 'Uploading...' : 'Select Files'}
      </label>
    </div>
  );
};