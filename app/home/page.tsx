'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useApi } from '../hooks/useApi';
import DashboardShell from '@/components/DashboardShell';

export default function HomePage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const api = useApi(); // API with automatic token management

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-[20px] shadow-lg p-8 mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-3xl font-bold text-[#333333]">Welcome Home</h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              Logout
              
            </button>
          </div>
        </div>

        {/* User Information Card */}
        <div className="bg-white rounded-[20px] shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#333333] mb-6">User Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">
                  Name
                </label>
                <p className="text-lg text-[#333333] font-medium">
                  {user?.name || 'Not available'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">
                  Email
                </label>
                <p className="text-lg text-[#333333] font-medium">
                  {user?.email || 'Not available'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">
                  Role
                </label>
                <p className="text-lg text-[#333333] font-medium">
                  {user?.role || 'Not available'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">
                  User ID
                </label>
                <p className="text-lg text-[#333333] font-medium">
                  {user?.id || 'Not available'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info Card */}
        <div className="bg-white rounded-[20px] shadow-lg p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#333333] mb-6">Session Information</h2>
          <div className="bg-[#F8F9FA] rounded-lg p-4">
            <p className="text-[#666666]">
              You are currently logged in and have access to protected content. 
              Your session is active and secure.
            </p>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
