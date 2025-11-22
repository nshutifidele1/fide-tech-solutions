import AdminSidebar from '@/components/layout/AdminSidebar';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
