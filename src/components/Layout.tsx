import { Outlet } from 'react-router';
import Navigation from '@/components/Navigation';

const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center">
      <Navigation />
      <main className="flex flex-col items-center mt-10 my-auto w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
