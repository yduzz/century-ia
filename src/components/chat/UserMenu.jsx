import { useState } from 'react';
import { LogOut, Settings, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

export default function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return null;
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (email) => {
    const colors = [
      'bg-blue-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-red-500',
      'bg-yellow-500',
      'bg-green-500',
      'bg-indigo-500',
      'bg-cyan-500',
    ];
    const charCode = email.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 w-full justify-start px-2 h-10">
          <div className={`w-8 h-8 rounded-full ${getAvatarColor(user.email)} flex items-center justify-center text-white text-xs font-semibold`}>
            {getInitials(user.full_name || user.email)}
          </div>
          <div className="flex-1 text-left min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {user.full_name || user.email}
            </p>
            <p className="text-xs text-gray-400 truncate">{user.role}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
        <DropdownMenuLabel className="text-gray-200">Minha Conta</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem className="text-gray-200 cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
          <User className="w-4 h-4 mr-2" />
          <span>Perfil</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="text-gray-200 cursor-pointer hover:bg-gray-700 focus:bg-gray-700">
          <Settings className="w-4 h-4 mr-2" />
          <span>Configurações</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          onClick={() => {
            setIsOpen(false);
            logout();
          }}
          className="text-red-400 cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
