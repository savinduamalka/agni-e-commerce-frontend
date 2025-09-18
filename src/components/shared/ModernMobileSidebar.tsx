import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Home, 
  Grid3X3, 
  Package, 
  Tag, 
  Mail, 
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import logo from "@/assets/logo.png";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

export default function ModernMobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigationItems: NavigationItem[] = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Categories', href: '/categories', icon: Grid3X3 },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Offers', href: '/offers', icon: Tag, badge: 'New' },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  // Handle escape key and prevent body scroll when sidebar is open
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Menu Trigger */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSidebar}
        className="md:hidden relative z-50"
        aria-label="Toggle mobile menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          onTouchEnd={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-80 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 transform transition-all duration-300 ease-out z-50 md:hidden ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full shadow-none'
        } border-r border-gray-200 dark:border-gray-700`}
        style={{
          backgroundImage: isOpen ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' : 'none'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-gray-900 via-black to-gray-800 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
          
          <div className="relative flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center space-x-3 group" 
              onClick={handleLinkClick}
            >
              <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                <img src={logo} alt="Agni" className="h-8 w-auto" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg">Agni Online Store</h2>
                <p className="text-white/80 text-sm">Premium Shopping</p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="text-white hover:bg-white/20 rounded-full transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 p-6 space-y-2 mt-4">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={handleLinkClick}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-200 group transform hover:scale-[1.02] ${
                  isActive
                    ? 'bg-black text-white shadow-lg shadow-black/30'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-white/20' 
                      : 'bg-gray-200 dark:bg-gray-600 group-hover:bg-gray-300 dark:group-hover:bg-gray-600'
                  }`}>
                    <Icon className={`h-5 w-5 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-gray-600 dark:text-gray-300 group-hover:text-black dark:group-hover:text-white'
                    }`} />
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {item.badge && (
                    <Badge className="bg-black text-white text-xs px-2 py-1">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {item.badge}
                    </Badge>
                  )}
                </div>
                <ChevronRight className={`h-5 w-5 transition-transform group-hover:translate-x-1 ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`} />
              </Link>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-gray-100 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <Sparkles className="h-4 w-4 text-black dark:text-white" />
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Agni Online Store
              </p>
              <Sparkles className="h-4 w-4 text-black dark:text-white" />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              © 2025 • Premium Shopping Experience
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
