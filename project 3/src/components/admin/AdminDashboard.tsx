import React from 'react';
import { Sidebar } from '../layout/Sidebar';
import { FileList } from '../dashboard/FileList';
import { Analytics } from '../dashboard/Analytics';
import { useAuthStore } from '../../store/authStore';

export const AdminDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">
            Welcome back, {user?.username}! Last login: {user?.lastLogin?.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">System Overview</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-900">24</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-green-600">Active Sessions</p>
                <p className="text-2xl font-bold text-green-900">8</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-purple-600">Total Files</p>
                <p className="text-2xl font-bold text-purple-900">156</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-600">Storage Used</p>
                <p className="text-2xl font-bold text-orange-900">2.4 GB</p>
              </div>
            </div>
          </div>
          <Analytics />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Recent Files</h2>
          <FileList />
        </div>
      </div>
    </div>
  );
};