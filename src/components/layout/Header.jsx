import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Sun, Moon, Bell, LogOut, UserCircle, Settings, HelpCircle } from 'lucide-react';

const Header = ({ onMenuClick, toggleTheme, currentTheme }) => {
  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-14 sm:h-16 px-2 sm:px-4 md:px-6 bg-background/80 backdrop-blur-md border-b shadow-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-1 sm:mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
        <h1 className="text-base sm:text-xl font-semibold text-foreground hidden md:block">
          Bem-vindo ao Sistema de Manutenção
        </h1>
      </div>
      <div className="flex items-center space-x-1 sm:space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="text-foreground hover:bg-accent/10 h-8 w-8 sm:h-9 sm:w-9"
        >
          {currentTheme === 'dark' ? (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5" />
          ) : (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5" />
          )}
          <span className="sr-only">Alternar tema</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-foreground hover:bg-accent/10 relative h-8 w-8 sm:h-9 sm:w-9"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute top-0.5 right-0.5 flex h-1.5 w-1.5 sm:h-2 sm:w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-red-500"></span>
          </span>
          <span className="sr-only">Notificações</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full">
              <Avatar className="h-8 w-8 sm:h-9 sm:w-9">
                <AvatarImage src="https://avatar.vercel.sh/user.png" alt="Usuário" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">Usuário Admin</p>
                <p className="text-xs leading-none text-muted-foreground">admin@example.com</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Ajuda</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
