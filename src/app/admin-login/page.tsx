import { Suspense } from 'react';
import AdminLoginClient from './client';

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F5] flex items-center justify-center">
          <div className="animate-pulse text-slate-400 font-medium">Loading...</div>
        </div>
      }
    >
      <AdminLoginClient />
    </Suspense>
  );
}
