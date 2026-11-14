import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { DemoWatermark } from './DemoWatermark';

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg-dark text-brand-text-dark">
      <DemoWatermark />
      <Header />
      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
