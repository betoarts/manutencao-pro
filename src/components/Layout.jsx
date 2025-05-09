import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';
import MobileSidebar from '@/components/layout/MobileSidebar';
import Header from '@/components/layout/Header';
import { useTheme } from '@/hooks/useTheme';

export default function Layout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme('light');

  const toggleSidebar = () => setIsSidebarCollapsed(!isSidebarCollapsed);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-gray-900">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
      <MobileSidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      <div className="flex-1 flex flex-col w-full">
        <Header onMenuClick={toggleMobileMenu} toggleTheme={toggleTheme} currentTheme={theme} />
        <main className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={useLocation().pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-[1400px] mx-auto"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
        <footer className="py-3 px-4 sm:py-4 sm:px-6 text-center text-xs sm:text-sm text-muted-foreground border-t">
          <p>Copyright Humberto Moura © Todos Direitos reservados 2025.</p>
        </footer>
      </div>
    </div>
  );
}
