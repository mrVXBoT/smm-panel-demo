import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAppStore } from '../../app/store';

export function CustomerLayout() {
  const userId = useAppStore((state) => state.currentUser.id);
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg-dark text-brand-text-dark">
      <Header />
      <div className="flex-1 flex min-w-0">
        <Sidebar mode="customer" />
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet key={userId} />
        </main>
      </div>
    </div>
  );
}
