import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { navItems } from '@/components/layout/navItems';

const MobileSidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side="left"
        className="w-[280px] sm:w-[320px] p-0 bg-gradient-to-br from-purple-700 to-indigo-800 text-primary-foreground flex flex-col"
      >
        <div className="flex items-center justify-center p-3 sm:p-4 h-14 sm:h-16 border-b border-purple-600">
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight">ManutençãoPro</h1>
        </div>
        <nav className="flex-1 px-2 py-3 sm:py-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {navItems.map(item => (
            <NavLink
              key={item.name}
              to={item.href}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center rounded-lg px-3 py-2 sm:py-2.5 text-sm font-medium transition-all duration-150 ease-in-out',
                  'hover:bg-purple-600 hover:shadow-md',
                  isActive
                    ? 'bg-accent text-accent-foreground shadow-lg'
                    : 'text-purple-100 hover:text-white'
                )
              }
            >
              <item.icon className="mr-3 h-4 w-4 sm:h-5 sm:w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 sm:p-4 border-t border-purple-600">
          <div className="p-2 sm:p-3 rounded-lg bg-purple-600/50 text-center">
            <p className="text-[10px] sm:text-xs text-purple-200">
              © {new Date().getFullYear()} ManutençãoPro
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
