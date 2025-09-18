import { HelpCircle, LogIn } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { UserNav } from "@/components/shared/user-nav";
import ModernMobileSidebar from "@/components/shared/ModernMobileSidebar";
import { useAuth } from "@/context/AuthContext";
import logo from "@/assets/logo.png";
import CartIcon from "../cart/CartIcon";

export default function Header() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          {/* Mobile Menu */}
          <ModernMobileSidebar />

          {/* Logo/Brand */}
          <Link to="/" className="flex items-center space-x-2 min-w-0">
            <img src={logo} alt="Agni" className="h-6 sm:h-8 w-auto flex-shrink-0" />
            <span className="text-lg sm:text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 hidden sm:block truncate">
              Agni Online Store
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className="space-x-4">
              <NavigationMenuItem>
                <Link to="/" className={navigationMenuTriggerStyle()}>
                  Home
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/categories" className={navigationMenuTriggerStyle()}>
                  Categories
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/products" className={navigationMenuTriggerStyle()}>
                  Products
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/offers" className={navigationMenuTriggerStyle()}>
                  Offers
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact" className={navigationMenuTriggerStyle()}>
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link to="/help" className="hidden sm:block">
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </Link>
            <div className="hidden sm:block">
              <UserNav />
            </div>
            <div className="hidden sm:block">
              <CartIcon />
            </div>
            {/* Mobile Actions - visible only on mobile */}
            <div className="flex items-center space-x-1.5 sm:hidden">
              <CartIcon />
              {!isAuthenticated && (
                <Button 
                  asChild 
                  size="sm" 
                  className="bg-black hover:bg-gray-800 text-white border-0 shadow-md text-xs px-2 py-1 h-7 min-w-0 transition-colors"
                >
                  <Link to="/signIn" className="flex items-center space-x-1">
                    <LogIn className="h-3 w-3 flex-shrink-0" />
                    <span className="text-xs">Login</span>
                  </Link>
                </Button>
              )}
              {isAuthenticated && (
                <div className="scale-75">
                  <UserNav />
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}