'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-end items-center">
          <div className="flex items-center">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.firstNames} {user?.lastNames}</p>
              <p className="text-xs text-gray-500">{user?.run}</p>
            </div>
            <div className="ml-3 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-700">
                {user?.firstNames?.[0]}{user?.lastNames?.[0]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
} 