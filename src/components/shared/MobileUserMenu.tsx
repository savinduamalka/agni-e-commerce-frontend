import { Link, useNavigate } from "react-router-dom";
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronRight,
  UserCircle,
  Heart,
  Package
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface MobileUserMenuProps {
  onClose: () => void;
}

export function MobileUserMenu({ onClose }: MobileUserMenuProps) {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    onClose();
  };

  const handleLinkClick = () => {
    onClose();
  };

  if (!isAuthenticated) {
    return (
      <div className="space-y-3">
        <Link 
          to="/signIn" 
          onClick={handleLinkClick}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <User className="h-5 w-5" />
            <span className="font-medium">Sign In</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </Link>
        <Link 
          to="/signUp" 
          onClick={handleLinkClick}
          className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl text-white hover:from-green-600 hover:to-teal-700 transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <UserCircle className="h-5 w-5" />
            <span className="font-medium">Create Account</span>
          </div>
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    );
  }

  const userMenuItems = [
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'My Orders', href: '/orders', icon: Package },
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="space-y-2">
      {/* User info header */}
      <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white mb-4">
        <div className="bg-white/20 p-2 rounded-full">
          <User className="h-6 w-6" />
        </div>
        <div>
          <p className="font-semibold">
            {user?.name || 'User'}
          </p>
          <p className="text-sm opacity-90">
            {user?.email}
          </p>
        </div>
      </div>

      {/* User menu items */}
      {userMenuItems.map((item) => {
        const Icon = item.icon;
        
        return (
          <Link
            key={item.name}
            to={item.href}
            onClick={handleLinkClick}
            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-lg group-hover:bg-orange-100 dark:group-hover:bg-orange-800 transition-colors">
                <Icon className="h-4 w-4 text-gray-600 dark:text-gray-300 group-hover:text-orange-600" />
              </div>
              <span className="font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
            </div>
            <ChevronRight className="h-4 w-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        );
      })}

      {/* Logout button */}
      <Button
        onClick={handleLogout}
        variant="ghost"
        className="w-full justify-start p-3 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg mt-4"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <LogOut className="h-4 w-4" />
          </div>
          <span className="font-medium">Sign Out</span>
        </div>
      </Button>
    </div>
  );
}
