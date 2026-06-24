import type { Metadata } from 'next';
import AdminSidebar from '@/components/admin/Sidebar';
import TopHeader from '@/components/admin/TopHeader';

export const metadata: Metadata = {
  title: { template: '%s | DevPhoeniX Admin', default: 'Admin | DevPhoeniX' },
  robots: 'noindex, nofollow',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <AdminSidebar />
      <div className="flex-grow flex flex-col min-w-0 h-screen overflow-hidden">
        <TopHeader />
        <main className="flex-1 overflow-auto">
          <div className="pt-14 lg:pt-0 px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
