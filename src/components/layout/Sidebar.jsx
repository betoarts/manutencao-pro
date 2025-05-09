import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { navItems } from '@/components/layout/navItems';

const Sidebar = ({ isCollapsed, toggleSidebar }) => {
  const location = useLocation();

  return (
    <motion.div
      initial={false}
      animate={{ width: isCollapsed ? '4rem' : '16rem' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={cn(
        'hidden md:flex flex-col h-screen bg-gradient-to-br from-purple-700 to-indigo-800 text-primary-foreground shadow-2xl overflow-y-auto overflow-x-hidden'
      )}
    >
      <div className="flex items-center justify-between p-2 sm:p-4 h-14 sm:h-16 border-b border-purple-600">
        {!isCollapsed && (
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg sm:text-2xl font-bold tracking-tight"
          >
            ManutençãoPro
          </motion.h1>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="text-primary-foreground hover:bg-purple-600 h-8 w-8 sm:h-9 sm:w-9"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
        </Button>
      </div>
      <nav className="flex-1 px-1 sm:px-2 py-2 sm:py-4 space-y-1 sm:space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center rounded-lg px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-150 ease-in-out',
                'hover:bg-purple-600 hover:shadow-md',
                isActive
                  ? 'bg-accent text-accent-foreground shadow-lg scale-105'
                  : 'text-purple-100 hover:text-white',
                isCollapsed ? 'justify-center' : ''
              )
            }
          >
            <item.icon className={cn('h-4 w-4 sm:h-5 sm:w-5', isCollapsed ? '' : 'mr-2 sm:mr-3')} />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {item.name}
              </motion.span>
            )}
            {isCollapsed && <span className="sr-only">{item.name}</span>}
          </NavLink>
        ))}
      </nav>
      {!isCollapsed && (
        <motion.div
          className="p-2 sm:p-4 mt-auto border-t border-purple-600"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-2 sm:p-3 rounded-lg bg-purple-600/50 text-center">
            <p className="text-[10px] sm:text-xs text-purple-200">
              © {new Date().getFullYear()} ManutençãoPro
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Sidebar;
