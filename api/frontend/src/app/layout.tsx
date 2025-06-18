import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AuthGate from './AuthGate';

export const metadata: Metadata = {
  title: "TheFirm Admin",
  description: "Panel de administración para TheFirm",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <AuthGate>
            {children}
          </AuthGate>
        </AuthProvider>
      </body>
    </html>
  );
}
