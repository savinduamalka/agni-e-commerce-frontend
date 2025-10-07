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
  Heart,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/logo.png';

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
    { name: 'Wishlist', href: '/wishlist', icon: Heart },
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
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm transition-opacity duration-300 md:hidden"
          onClick={() => setIsOpen(false)}
          onTouchEnd={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 z-50 flex h-full w-80 flex-col border-r border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out md:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-br from-teal-600 via-teal-500 to-teal-400 px-6 pb-6 pt-5 text-white">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'120\' height=\'120\' viewBox=\'0 0 120 120\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M60 0h60v60H60zM0 60h60v60H0z\' fill=\'rgba(255,255,255,0.08)\'/%3E%3C/svg%3E')] opacity-40" />
          <div className="relative flex items-center justify-between">
            <Link
              to="/"
              className="flex items-center space-x-3 rounded-full bg-white/10 px-3 py-2 backdrop-blur-sm transition hover:bg-white/20"
              onClick={handleLinkClick}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <img src={logo} alt="Agni" className="h-7 w-auto" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium uppercase tracking-[0.4em] text-white/80">
                  Agni
                </p>
                <p className="truncate text-lg font-semibold leading-tight text-white">
                  Online Store
                </p>
              </div>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="rounded-full text-white hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="relative mt-5 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3 text-sm font-medium text-white/90">
              <Sparkles className="h-4 w-4" />
              Discover curated essentials every week
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={handleLinkClick}
                  className={`group flex items-center justify-between rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? 'border-transparent bg-teal-600 text-white shadow-lg shadow-teal-500/30'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={`flex h-9 w-9 items-center justify-center rounded-full border transition ${
                        isActive
                          ? 'border-white/30 bg-white/20 text-white'
                          : 'border-slate-200 bg-white text-teal-600 group-hover:border-teal-200 group-hover:text-teal-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{item.name}</span>
                    {item.badge && (
                      <Badge
                        className={`${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-teal-100 text-teal-700'
                        } border-none px-2 py-[3px] text-[11px] uppercase tracking-wide`}
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 transition ${
                      isActive
                        ? 'translate-x-1 text-white'
                        : 'text-slate-300 group-hover:translate-x-1 group-hover:text-teal-500'
                    }`}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-700">Agni Online Store</p>
            <p className="mt-1">© 2025 • Premium experiences, delivered.</p>
          </div>
        </div>
      </div>
    </>
  );
}
