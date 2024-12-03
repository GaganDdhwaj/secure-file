import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User } from 'lucide-react';

export const AuthChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome</h1>
          <p className="text-gray-400">Choose your login type</p>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/admin-login')}
            className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-lg rounded-xl hover:bg-white/20 transition-all duration-200"
          >
            <Shield className="h-12 w-12 text-blue-500 mb-4" />
            <span className="text-lg font-medium text-white">Admin</span>
          </button>

          <button
            onClick={() => navigate('/user-login')}
            className="flex flex-col items-center p-6 bg-white/10 backdrop-blur-lg rounded-xl hover:bg-white/20 transition-all duration-200"
          >
            <User className="h-12 w-12 text-green-500 mb-4" />
            <span className="text-lg font-medium text-white">User</span>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            New user? Sign up here
          </button>
        </div>
      </div>
    </div>
  );
};