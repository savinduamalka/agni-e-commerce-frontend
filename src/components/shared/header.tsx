import { ShoppingCart, HelpCircle, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MainNav } from "@/components/shared/main-nav";
import { UserNav } from "@/components/shared/user-nav";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center space-x-4">
            {/* Mobile Menu */}
            <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                </Button>
                </SheetTrigger>
                <SheetContent side="left">
                <nav className="grid gap-6 text-lg font-medium">
                    <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
                        <MainNav />
                    </Link>
                    <Link to="/categories" className="hover:text-foreground">
                    Categories
                    </Link>
                    <Link to="/products" className="text-muted-foreground hover:text-foreground">
                    Products
                    </Link>
                    <Link to="/offers" className="text-muted-foreground hover:text-foreground">
                    Offers
                    </Link>
                    <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                    </Link>
                </nav>
                </SheetContent>
            </Sheet>
            </div>

            {/* Logo/Brand */}
            <div className="hidden md:flex">
                <MainNav />
            </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList className="space-x-4">
              <NavigationMenuItem>
                <Link to="/categories">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Categories
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/products">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Products
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/offers">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Offers
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Contact
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <nav className="flex items-center space-x-4">
            <Link to="/cart">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/help">
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-4 w-4" />
              </Button>
            </Link>
            <Button asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
            <UserNav />
          </nav>
        </div>
      </div>
    </header>
  );
}