import React from 'react';
import { Sidebar } from '../layout/Sidebar';
import { FileList } from '../dashboard/FileList';
import { UploadZone } from '../dashboard/UploadZone';
import { useAuthStore } from '../../store/authStore';

export const UserDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Files</h1>
          <p className="text-gray-600">
            Welcome back, {user?.username}!
          </p>
        </div>

        <div className="mb-8">
          <UploadZone />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Files</h2>
          <FileList />
        </div>
      </div>
    </div>
  );
};