import React from 'react';
import { Outlet } from 'react-router-dom';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* AuthenticatedNavbar will be added in Phase 3 */}
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
