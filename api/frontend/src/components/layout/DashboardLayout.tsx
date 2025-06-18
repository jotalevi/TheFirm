"use client";

import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { isAdmin, isModerator } = useAuth();
  return (
    <div className="min-h-screen bg-background">
      {(isAdmin || isModerator) && <Sidebar />}
      <div className={isAdmin || isModerator ? "pl-64" : ""}>
        <Header title={title} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 