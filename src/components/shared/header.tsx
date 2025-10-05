import { HelpCircle, LogIn, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import { UserNav } from '@/components/shared/user-nav';
import ModernMobileSidebar from '@/components/shared/ModernMobileSidebar';
import { useAuth } from '@/context/AuthContext';
import logo from '@/assets/logo.png';
import CartIcon from '../cart/CartIcon';

export default function Header() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center space-x-2 sm:space-x-6 flex-1 min-w-0">
          {/* Mobile Menu */}
          <ModernMobileSidebar />

          {/* Logo/Brand */}
          <Link
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 min-w-0"
          >
            <img
              src={logo}
              alt="Agni"
              className="h-8 sm:h-10 w-auto flex-shrink-0"
            />
            <div className="hidden sm:block min-w-0">
              <span className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-4 py-1 text-sm font-semibold text-slate-800 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[var(--color-teal-500)]" />
                Agni Online Store
              </span>
              <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.35em] text-slate-400">
                Curated essentials
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex">
          <NavigationMenu>
            <NavigationMenuList className="space-x-1">
              <NavigationMenuItem>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive('/')
                        ? 'bg-[var(--color-teal-500)] text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[var(--color-teal-500)]'
                    }`}
                >
                  <ShoppingBag className="h-4 w-4 inline mr-2" />
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  to="/categories"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive('/categories')
                        ? 'bg-[var(--color-teal-500)] text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[var(--color-teal-500)]'
                    }`}
                >
                  Categories
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  to="/products"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive('/products')
                        ? 'bg-[var(--color-teal-500)] text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[var(--color-teal-500)]'
                    }`}
                >
                  Products
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  to="/offers"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive('/offers')
                        ? 'bg-[var(--color-teal-500)] text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[var(--color-teal-500)]'
                    }`}
                >
                  Offers
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  to="/contact"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${
                      isActive('/contact')
                        ? 'bg-[var(--color-teal-500)] text-white'
                        : 'text-gray-700 hover:bg-gray-100 hover:text-[var(--color-teal-500)]'
                    }`}
                >
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
          <nav className="flex items-center space-x-2 sm:space-x-3">
            <Link to="/help" className="hidden lg:block">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 hover:text-[var(--color-teal-500)]"
              >
                <HelpCircle className="h-5 w-5" />
              </Button>
            </Link>
            <div className="hidden sm:block">
              <UserNav />
            </div>
            <div className="hidden sm:block">
              <CartIcon />
            </div>
            {/* Mobile Actions */}
            <div className="flex items-center space-x-2 sm:hidden">
              <CartIcon />
              {!isAuthenticated && (
                <Button
                  asChild
                  size="sm"
                  className="bg-[var(--color-teal-500)] hover:bg-[var(--color-teal-600)] text-white"
                >
                  <Link to="/signIn" className="flex items-center space-x-1.5">
                    <LogIn className="h-3.5 w-3.5" />
                    <span>Login</span>
                  </Link>
                </Button>
              )}
              {isAuthenticated && <UserNav />}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
