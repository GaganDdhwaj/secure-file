import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderIcon,
  Users,
  Settings,
  Shield,
  LogOut,
  BarChart3,
  Upload,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();

  const menuItems = [
    { icon: FolderIcon, label: 'Files', path: '/dashboard' },
    { icon: Upload, label: 'Upload', path: '/upload' },
    { icon: Users, label: 'Shared', path: '/shared' },
    { icon: BarChart3, label: 'Analytics', path: '/analytics' },
    { icon: Shield, label: 'Security', path: '/security' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="h-screen w-64 bg-gray-900 text-white p-6">
      <div className="mb-8">
        <h2 className="text-xl font-bold">Secure Files</h2>
        <p className="text-sm text-gray-400">Welcome, {user?.username}</p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <button
        onClick={logout}
        className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-red-600/20 text-red-500 mt-auto absolute bottom-6"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </button>
    </div>
  );
};