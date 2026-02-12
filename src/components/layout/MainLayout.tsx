import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} isMobile={isMobile} />

      {/* Mobile header */}
      {isMobile && (
        <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-30 flex items-center px-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="ml-3 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-gold flex items-center justify-center">
              <span className="text-xs font-bold text-sidebar-primary-foreground">H</span>
            </div>
            <span className="font-display font-bold text-sm">HouseRent Connect</span>
          </div>
        </header>
      )}

      {/* Main content */}
      <motion.main
        animate={{
          marginLeft: isMobile ? 0 : sidebarOpen ? 256 : 64,
          paddingTop: isMobile ? 56 : 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="min-h-screen"
      >
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default MainLayout;
