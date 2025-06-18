"use client";
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAdmin, isModerator, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin && !isModerator) {
      router.push('/calendar-user');
    }
  }, [isLoading, isAuthenticated, isAdmin, isModerator, router]);
  return <>{children}</>;
} 