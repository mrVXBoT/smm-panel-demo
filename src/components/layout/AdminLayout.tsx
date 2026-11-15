import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg-dark text-brand-text-dark">
      <Header />
      <div className="flex-1 flex min-w-0">
        <Sidebar mode="admin" />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
